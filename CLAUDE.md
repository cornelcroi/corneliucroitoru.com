# CorneliuCroitoru.com

Personal site: writing, projects, photography. Astro 7, static, deployed to GitHub Pages on every push to `main` (`.github/workflows/deploy.yml`). Domain `corneliucroitoru.com` via `public/CNAME`.

Drafts, the publication calendar and the purpose/rules live in the private repo `~/projects/publications`. This repo holds only what is published.

## Routines

**Add photos.** New trip = new subfolder in the iCloud folder (`SOURCE` in `scripts/import_photos.py`, the old photo site export folder), named like the others (`Porto - Portugal`).

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

**Add an article.** `src/content/writing/<slug>.md` with `title`, `description` (one or two sentences, used as the excerpt), `date`, `tags`, `cover` (`/covers/<slug>.png`, 1000×420 rendered at 2×, in `public/covers/`; made in `~/projects/publications/covers/` with the Night plate, like every article image), and `devto` once cross-posted. The dev.to copy sets `canonical_url: https://corneliucroitoru.com/writing/<slug>/`. `series` (e.g. `"Building Back From My Trip"`) links the article to the others of its series, and to its product on the Projects page when the entry in `src/data/projects.ts` names the same series. `draft: true` hides it from the live site (local dev still shows it, with a "Draft" label); The home page shows the three most recent articles, newest first. Images go in `public/img/`.

**Publish a draft.** On the day: GitHub → Actions → Deploy to GitHub Pages → Run workflow, with the article's slug (the date is optional: today by default, never in the future). It removes `draft: true`, sets the date, commits and deploys. Nothing runs by itself. `node scripts/publishing.mjs status` prints what is live and draft (the same table shows in each run's summary). The rule lives in `isLive()` in `src/lib/content.ts`, the only place articles are listed from.

**Articles published elsewhere** (AWS Blog, Medium…) go in `src/data/external.ts`; they link out. Set `project` (on an article there or a talk in `src/data/talks.ts`) to list it under that project on the Projects page, in "Written and said about it"; the name must match the project's `name`.

**Home page photo:** `hero` in `src/site.ts` (series slug + position + caption).

**Share images:** `sh scripts/make_share_images.sh` after changing the hero photo, the role, or adding an article cover (it fits each cover into 1200x630 for link previews). Check the result with `npm run build && python3 scripts/preview_share.py`.

## Run

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # dist/
```

If the dev server shows a page without its styles or misses a front-matter change, its cache is stale: `npx astro dev stop && rm -rf .astro node_modules/.astro && npx astro dev`. `npm run build` is always the truth.

## Rules

- Light only, two faces: Instrument Sans (UI) and Source Serif 4 (titles, reading). Tokens in `src/styles/global.css`.
- Photos are served through Astro's image pipeline at webp quality `PHOTO_QUALITY` (`src/lib/content.ts`). Don't add width variants without checking `du -sh dist` (GitHub Pages limit: 1 GB).
- No client-side JavaScript. No analytics without asking. One exception, chosen by the owner (2026-10-04): YouTube embeds, always from `youtube-nocookie.com`, `loading="lazy"`, inside a `.video-embed` div. Short videos are self-hosted MP4s in `public/video/`.
- The domain, wherever it is displayed (covers, share images, headings, text), is written **CorneliuCroitoru.com**, and likewise **BackFromMyTrip.com** (streetlensapp.com stays lowercase). Lowercase only in URLs, `CNAME` and code.
