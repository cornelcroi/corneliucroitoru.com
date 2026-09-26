"""Import photo series from a local folder into src/content/photos/.

Each subfolder of SOURCE becomes one series: up to --max photos, picked evenly
across the folder, resized to 2000 px on the long edge. Camera, lens and
exposure are read from the original and written to index.md, where the site
shows them; the published file itself carries no metadata, so no GPS. Only
what the file records is shown, nothing is inferred. index.md is written once
and never overwritten, so titles edited by hand survive a re-import.

    npm run photos                                  # import the folders not on the site yet
    npm run photos -- --refresh "Japon"             # re-import one series, keep its title
    npm run photos -- --max 0                       # all photos per series instead of 12
    npm run photos -- --source "<another folder>"
"""
import argparse
import re
import subprocess
import unicodedata
from pathlib import Path

LONG_EDGE = 2000
QUALITY = 82
DEST = Path(__file__).resolve().parent.parent / "src" / "content" / "photos"
SOURCE = Path.home() / ("Library/Mobile Documents/com~apple~CloudDocs/Documents/Documents (icloud)/"
                        "PERSO/Photos_Films/POZE_FILME/POZE_processed/manbehindlens.com")

# Folder names are how they were typed years ago; these are how they read on the site.
TITLES = {
    "Boats - Conflans": "Boats at Conflans",
    "Etretat - France": "Étretat, France",
    "Guerande": "Guérande, France",
    "Honfleur - Night": "Honfleur at night",
    "Japon": "Japan",
    "lanzarote": "Lanzarote, Spain",
    "Lisboa - Portugal": "Lisbon, Portugal",
    "Liverpool": "Liverpool, UK",
    "Mareil-Marly-Snow": "Mareil-Marly in snow",
    "Moret-sur-Loing": "Moret-sur-Loing, France",
    "Naples": "Naples, Italy",
    "Saint-Emilion - France": "Saint-Émilion, France",
    "Short walk in Deauville, Normandy": "A short walk in Deauville",
}


# EXIF model codes that are not the name photographers know the camera by.
CAMERA_NAMES = {"ILCE-7C": "Sony A7C"}


def slugify(text):
    ascii_text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", ascii_text.lower()).strip("-")


def title_for(folder_name):
    return TITLES.get(folder_name, folder_name.replace(" - ", ", "))


def read_exif(photo):
    out = subprocess.run(["magick", "identify", "-format", "%[EXIF:*]", str(photo)],
                         capture_output=True, text=True).stdout
    tags = {}
    for line in out.splitlines():
        key, _, value = line.partition("=")
        tags[key.removeprefix("exif:")] = value.strip()
    return tags


def _ratio(value):
    num, _, den = value.partition("/")
    try:
        return float(num) / float(den or 1)
    except ValueError:
        return None


def shooting_data(tags):
    """Display-ready fields, only the ones the file actually records."""
    data = {}
    camera = tags.get("Model", "")
    lens = tags.get("LensModel", "")
    # iPhone exports sometimes drop Model but keep it in LensModel ("iPhone 17 Pro back triple camera ...").
    if not camera and " back " in lens:
        camera = lens.split(" back ")[0]
    if camera:
        data["camera"] = CAMERA_NAMES.get(camera, camera)
    if lens and not lens.startswith(camera or "\0"):
        data["lens"] = lens
    focal35 = tags.get("FocalLengthIn35mmFilm")
    focal = _ratio(tags.get("FocalLength", ""))
    if focal35:
        data["focal"] = f"{focal35} mm eq."
    elif focal:
        data["focal"] = f"{focal:g} mm"
    aperture = _ratio(tags.get("FNumber", ""))
    if aperture:
        data["aperture"] = f"f/{aperture:g}"
    exposure = _ratio(tags.get("ExposureTime", ""))
    if exposure:
        data["shutter"] = f"{exposure:g} s" if exposure >= 1 else f"1/{round(1 / exposure)} s"
    if tags.get("PhotographicSensitivity"):
        data["iso"] = f"ISO {tags['PhotographicSensitivity']}"
    taken = tags.get("DateTimeOriginal", "")
    if taken[:4].isdigit():
        data["taken"] = taken[:10].replace(":", "-")
    return data


def pick_evenly(files, count):
    if len(files) <= count:
        return files
    step = (len(files) - 1) / (count - 1)
    return [files[round(i * step)] for i in range(count)]


def imported_sources():
    """Source folder name -> series folder, read from each index.md's `source:` line."""
    found = {}
    for index in DEST.glob("*/index.md"):
        for line in index.read_text().splitlines():
            if line.startswith("source: "):
                found[line.removeprefix("source: ").strip('"')] = index.parent
    return found


def kept_front_matter(index):
    """Hand-edited fields a refresh must not lose."""
    kept = {}
    if index.exists():
        for line in index.read_text().splitlines():
            key = line.split(":", 1)[0]
            if key in ("title", "description"):
                kept[key] = line
    return kept


def import_series(folder, max_photos, target=None):
    photos = sorted(p for p in folder.iterdir() if p.suffix.lower() in (".jpg", ".jpeg"))
    if not photos:
        print(f"skipped {folder.name}: no jpg")
        return
    title = title_for(folder.name)
    target = target or DEST / slugify(title)
    index = target / "index.md"
    kept = kept_front_matter(index)
    target.mkdir(parents=True, exist_ok=True)
    for old in target.glob("*.jpg"):
        old.unlink()

    picked = photos if max_photos <= 0 else pick_evenly(photos, max_photos)
    entries = []
    for i, src in enumerate(picked, start=1):
        name = f"{i:02d}.jpg"
        subprocess.run(["magick", str(src), "-auto-orient", "-resize", f"{LONG_EDGE}x{LONG_EDGE}>",
                        "-strip", "-quality", str(QUALITY), str(target / name)], check=True)
        entries.append((name, shooting_data(read_exif(src))))

    years = sorted({d["taken"][:4] for _, d in entries if "taken" in d})
    lines = ["---", kept.get("title", f'title: "{title}"')]
    if "description" in kept:
        lines.append(kept["description"])
    lines += [f'source: "{folder.name}"', f"year: {years[0] if years else 'null'}",
              f"cover: ./{entries[0][0]}", "photos:"]
    for name, data in entries:
        lines.append(f"  - src: ./{name}")
        lines += [f'    {key}: "{value}"' for key, value in data.items()]
    lines += ["---", ""]
    index.write_text("\n".join(lines))
    print(f"{title}: {len(entries)} of {len(photos)}")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", type=Path, default=SOURCE)
    parser.add_argument("--max", type=int, default=12, help="photos per series, 0 for all")
    parser.add_argument("--refresh", help="re-import this one source folder")
    args = parser.parse_args()

    if not args.source.is_dir():
        raise SystemExit(f"Source folder not found: {args.source}\nPass it with --source.")
    done = imported_sources()

    if args.refresh:
        folder = args.source / args.refresh
        if not folder.is_dir():
            raise SystemExit(f"No folder named '{args.refresh}' in {args.source}")
        import_series(folder, args.max, done.get(args.refresh))
        return

    new = [p for p in sorted(args.source.iterdir()) if p.is_dir() and p.name not in done]
    if not new:
        print("Nothing new. Use --refresh \"<folder>\" to re-import a series.")
    for folder in new:
        import_series(folder, args.max)


if __name__ == "__main__":
    main()
