# corneliucroitoru.com

Personal site: writing, projects, photography. Astro 7, static, deployed to GitHub Pages on every push to `main` (`.github/workflows/deploy.yml`). Domain `corneliucroitoru.com` via `public/CNAME`.

Drafts, the publication calendar and the purpose/rules live in the private repo `~/projects/publications`. This repo holds only what is published.

## Routines

**Add photos.** New trip = new subfolder in the iCloud folder (`SOURCE` in `scripts/import_photos.py`, the old manbehindlens.com export folder), named like the others (`Porto - Portugal`).

```bash
npm run photos                          # imports only folders not on the site yet
npm run photos -- --refresh "Japon"     # re-imports one series; hand-edited title/description kept
npm run photos -- --max 0               # all photos instead of 12 per series
git add -A && git commit && git push    # deploys
```

- Each series is `src/content/photos/<slug>/index.md` + `01.jpg…`. Camera, lens, focal, aperture, shutter, ISO and date come from the original's EXIF and are shown under each photo. Only what the file records is shown; nothing is inferred.
- Published JPGs carry no metadata (GPS stripped). Never copy originals into the repo by hand.
- To drop one photo: delete its entry under `photos:` and the file. The build fails if an entry points to a missing file; a file with no entry is just unused.
- To choose a series cover: set `cover:` to another file of the series.
- Folder names become titles through `TITLES` in the script; add an entry there for a new odd name, or edit `title:` in `index.md` after import.

**Add an article.** `src/content/writing/<slug>.md` with `title`, `description` (one or two sentences, used as the excerpt), `date`, `tags`, `cover` (`/covers/<slug>.png`, 1000×420, in `public/covers/`), and `devto` once cross-posted. The dev.to copy sets `canonical_url: https://corneliucroitoru.com/writing/<slug>/`. `draft: true` hides it. Images go in `public/img/`.

**Articles published elsewhere** (AWS Blog, Medium…) go in `src/data/external.ts`; they link out.

**Home page photo:** `hero` in `src/site.ts` (series slug + position + caption).

## Run

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # dist/
```

## Rules

- Light only, two faces: Instrument Sans (UI) and Source Serif 4 (titles, reading). Tokens in `src/styles/global.css`.
- Photos are served through Astro's image pipeline at webp quality `PHOTO_QUALITY` (`src/lib/content.ts`). Don't add width variants without checking `du -sh dist` (GitHub Pages limit: 1 GB).
- No client-side JavaScript. No analytics without asking.
