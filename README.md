# SK Tawhid Hossen — portfolio

Plain HTML + CSS + ES modules. No build step. GSAP 3.15 and Lenis 1.3.27 are loaded from jsDelivr via the import map in each page's `<head>`.

## Preview locally
```bash
npx serve@14.2.4 -l 5173 .
```
Open http://localhost:5173. Use `serve` rather than opening the file directly: the site uses root-relative paths and clean URLs (`/work/aries`).

## Structure
```
index.html                 home (all 8 sections)
work/<slug>.html           case studies (generated — see below)
css/tokens.css             palette, type, spacing, motion tokens
css/base.css               reset, type, buttons, nav/menu/cursor/progress/preloader
css/sections.css           every section + case-study layout
js/main.js                 boot order
js/lib/                    gsap setup, Lenis, frame-sequence engine, reveals, nav, cursor
js/sections/               one file per section (hero, work, about, …)
sequences/<clip>/          scroll-scrubbed WebP frames + manifest.json
assets/                    fonts (self-hosted), photo + cutout, project screenshots, OG image, favicons
raw-video/                 source clips (not deployed, gitignored)
scripts/sequences.py       rebuild frames from raw-video/
scripts/gen_cases.py       regenerate the 5 case-study pages
```

## Swap a clip
1. Replace `raw-video/hero-portrait.mp4` or `raw-video/desk-dive.mp4` (keep the name). Optionally add a `<name>-9x16.mp4` for phones; otherwise a centre crop is made.
2. `python scripts/sequences.py hero-portrait` (or `desk-dive`, or no argument for both). Needs ffmpeg and the 3d-master `extract_frames.py`; set `EXTRACT_FRAMES` if it's not at `E:\3d-master\3d-master\scripts\extract_frames.py`.
3. Check `sequences/<name>/_qa/contact-sheet.jpg`, then refresh the page.

## Edit case-study copy
Edit the `P` list in `scripts/gen_cases.py`, then `python scripts/gen_cases.py`. The pages reuse the home page's head, nav, menu and contact footer, so changes there carry over too.

## Add a contact form later
In `index.html`, find `FORM SLOT`. Remove `hidden` from `#contact-form-slot` and put the `<form>` inside it.

## Deploy (Vercel)
See the deploy steps in the hand-off notes, or: push to GitHub → Vercel → New Project → import → Framework preset **Other**, no build command, output directory `.` → Deploy. `vercel.json` sets clean URLs and cache headers, and `.vercelignore` keeps `raw-video/`, QA sheets and scripts out of the deployment.
