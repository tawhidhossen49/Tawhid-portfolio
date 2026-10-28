# BLUEPRINT — SK TAWHID HOSSEN · Portfolio

Status: **approved 2026-10-28 · built** · Mode C (hybrid) · plain HTML/CSS/ES modules · no build step

## As built (differences from the plan below)
- **Design upgrade pass** (client request 2026-10-28, run through the 3d-master rules: polish the signature first, layer text and objects, no new competing motion):
  - **Card-stack rhythm:** every section rises over the previous one on a 24px rounded edge (z-index climbs with page order).
  - **Statement:** editorial hanging indent (24%) plus two inline image pills set into the sentence (face, AYCT). The pills open as the reading line reaches them.
  - **Signature:** the focused project panel leans ±4° toward the cursor (desktop pointers only; rotation channels are separate from the scrub).
  - **Index:** hover focus — the other rows drop to 32%, the name slides, and a brass arrow slides in.
  - **About:** an outlined "Full-Stack" ghost word drifts behind the cutout (T9 × H9 layering).
  - **Services:** cards recomposed (title top-left, "Start this project" top-right, description and list on the bottom line); softer dim (.28) and scale (.95) as the next card covers.
  - **Toolkit:** heading on the same two-column grid as Services.
  - **Hero:** the orphan "Scroll" hint is replaced by a centred cue with a drawing brass line inside the meta row.
  - **Footer:** F1 bookend — a giant clipped `TAWHID` that rises letter by letter, closing the page on the word it opened with.
  - **M2:** the copy-email and primary buttons lean toward the cursor (no elastic bounce).
  - **Result:** Lighthouse mobile 92, desktop 99; accessibility, best practices and SEO all 100; CLS 0.
- **No numbered section labels** (client request 2026-10-28): the "02 — What I do"-style eyebrows, "01 / 03" project labels, "01 / 07" service numbers, process step numbers, menu numbers and case-study eyebrows are all removed. Kept: the hero line (name, role, HaveStack) and "What you get" on service cards.
- **Pin lengths:** Hero 300vh (210 on phones) · Work 360vh (260) · About 160vh (130). Work got longer so each of the 3 projects holds in focus for about 240px of scroll. The same lengths are reserved in CSS before JS runs (`css/sections.css`, top), so keep the two in sync.
- **Work timeline:** the clip plays over 0–.42; whiteout → ivory overlay at clip .29–.46; the real panels take over at .34–.42; projects run .45–1. Waiting panels sit at 14% opacity.
- **Hero:** `TAWHID` is static (no letter rise). The preloader wipe is the reveal, and the rise was pushing LCP late. The meta line is visible from the start.
- **Preloader → "The Seam"** (revision 2): remix of P5 × P3 × P6 × P11. No corner labels (removed at client request 2026-10-28). `TAWHID` rises letter by letter through a mask while its tracking settles. A low-alpha brass light pool drifts behind it (P6 rewritten: light behind the text, never a sheen on it). The brass hairline seam fills with the hero's real first-pass load, next to a `000→100%` counter. Exit: the counter fades, the seam flares, then the two obsidian halves part along it. The name rides up, the counter rides down, and the portrait settles from scale 1.08 → 1. Letters and light are CSS (play from first paint); JS drives the counter and the exit. Holds until 0.9 s after navigation (cap 1.3 s); removed at ~2.15 s. Plays **once per visit** (sessionStorage, per the client's request 2026-10-28): a new tab or later visit replays it; a refresh or a return from a case study skips it. `?intro` forces it. Off for reduced motion. Lighthouse mobile 93, CLS 0.
- **JS boots after first paint** (double rAF in the `<head>` script) so CSS, fonts and the poster load first.
- **Clips:** `desk-dive` warm-graded, both clips centre-cropped to 9:16 for portrait screens. Rebuild with `python scripts/sequences.py`.
- **QA (local, Lighthouse 12.8):** mobile home 92 / 100 / 100 / 100 · desktop home 98 / 100 / 100 / 100 · mobile case study 93 / 100 / 100 / 100. CLS 0.004. Hero frames 6.9 MB desktop / 2.8 MB mobile.

---

## 1. Context (Phase 1)

**Concept:** A full-stack developer's site that is its own best case study. It opens on his real portrait as a cinematic push into darkness, then proves itself with real, live work.

**Photo read** (`assets/Photos/tawhid.jpg`): portrait 3:4, subject centred, warm camel plaster (~`#C49A64`), hard side light with a strong shadow on the left, black suit and tee, clear glasses. Low-key and warm. It matches the palette directly.

**Clips already in `raw-video/` (preview QA, full QA after approval):**

| Clip | Spec | Verdict |
|---|---|---|
| `hero-portrait.mp4.mp4` | 1920×1080 · 60 fps · 8.15 s · HEVC | **Pass.** Face stays consistent, the push-in is smooth, the wall fades to a spotlight on black, and the last frame corner is `rgb(14,14,12)`, so the obsidian hand-off is seamless. The subject is *centred*, not left-third, so captions sit left/right of him. |
| `desk-dive.mp4.mp4` | 1920×1080 · 60 fps · 7.6 s · HEVC | **Pass with one fix.** The laptop push → screen → floating panels (they even show his portrait) → black end at `rgb(13,14,11)`. The mid-clip whiteout is a flat *cool grey*. I'll warm-grade those frames during extraction so the flash lands on Bone Ivory. |

No 9:16 versions exist. Both subjects are centred, so a centre crop works for mobile (≤5 MB).
Housekeeping on build: rename the clips to `hero-portrait.mp4` / `desk-dive.mp4`, and move `assets/Photos/` → `assets/photo/`.

**Projects (all read live, screenshots in `assets/work/`):**

| # | Project | What it actually is (one line) | Tags | Detected stack | Visual |
|---|---|---|---|---|---|
| 1 | **Amaze Youth Chess Tournament** · ayct-five.vercel.app | Official home of a national youth chess championship: format, registration, the road to the final, live countdown and a player portal. | Event · Motion · Portal | HTML, CSS, JS, GSAP (ScrollTrigger, SplitText), Lenis | ★★★★★ cinematic chrome-on-black |
| 2 | **ARIES** · amaze-ries.vercel.app | Research hub of Amaze Consortium, presenting a grassroots education study across Bangladesh. | Research · Editorial | HTML, CSS, JS | ★★★★½ refined serif editorial |
| 3 | **HaveStack** · have-stack.vercel.app | Corporate site for a Dhaka enterprise software company: practice areas, managed systems, products and delivery. | Corporate · B2B | HTML, CSS, JS | ★★★★ consistent dark photographic system |
| 4 | **Amaze Consortium** · amaze-con.vercel.app | Website for a youth-led multi-sector organisation: subsidiaries, team, academy and applications. | Organisation · Motion | HTML, CSS, JS, GSAP, Lenis | ★★★½ bold, but neon-green accent |
| 5 | **Shahedin** · 2nd-shahedin-project.vercel.app | Bangla-language platform for a YouTube educator: courses, store, videos and a member dashboard. | Creator platform · Courses · Store | HTML, CSS, JS, Supabase (auth/data) | ★★★ functional, busier |

**Featured 3:** AYCT, ARIES, HaveStack (strongest visuals; HaveStack also reinforces the employer proof). All 5 are in the index and get `/work/<slug>.html`.
Slugs: `ayct`, `aries`, `havestack`, `amaze-consortium`, `shahedin`.
Shahedin's audience numbers (900k+ etc.) are the client's own stats, not results of my work, so they are **not** used.

---

## 2. Vibe (Phase 2)

| Axis | Score | Why |
|---|---|---|
| Energy | 3 | "smooth and expensive": one peak, everything else calm |
| Light ↔ Dark | 4 | obsidian base, ivory sections for rhythm |
| Warm ↔ Cool | 1 | camel wall, brass, amber light |
| Organic ↔ Technical | 3 | engineer (grid, hairlines, numbered labels) with editorial warmth (serif italics) |
| Playful ↔ Serious | 2 | confident, no bounce, no jokes |
| Minimal ↔ Rich | 2 | few elements, lots of air |

**Archetype blend:** *Dark Gold Luxury* × *Tech Editorial*. I replaced the preset "developer portfolio" cool/acid accent with brass, and dropped glitch (T5) entirely.

**Tokens**
```
--obsidian #0F0E0C (60%)   --ivory #EFE9DF (30%)   --brass #B08D57 (10%, never on large areas, never a gradient)
--muted-dark #8C857A (5.28:1 on obsidian)   --muted-light #6B655C (4.78:1 on ivory)
--brass-deep #7A5A2E (5.22:1 on ivory; brass text on ivory always uses this)
verified: ivory/obsidian 15.98 · brass/obsidian 6.24 · brass on ivory 2.56 → decorative/large only
Display  Clash Display 500–600 (Fontshare, self-hosted woff2) — hero 14–18vw, H2 clamp(2.6rem, 6vw, 6.5rem), tracking −0.02em
Accent   Instrument Serif italic — one word per headline, brass on dark / deep brass on ivory
Body     Inter Tight 400/500 — 16px (15 mobile, 17 ≥1600), line-height 1.55
Labels   Inter Tight 500, 11–12px caps, 0.2em tracking ("01 — ABOUT")
Space    4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 · 192 ; gutter clamp(16px, 4vw, 64px); 12-col grid
Shape    1px hairlines (ivory 12% on dark, obsidian 12% on light, brass 40% for accents) · card radius 12px · buttons 999px pill
Motion   house ease expo.out · 0.9–1.2s · stagger 0.07 · Lenis lerp 0.08 · scrub 0.8 · grain B2 at 5%
```

---

## 3. Elements & section list (Phase 3)

### What I changed from your proposal, and why
1. **Work now comes before About.** In your order, About (S3, pinned) sits directly before the desk-dive pin + ribbon. That makes **two adjacent pins**, and with the ribbon it is 4–5 pins in total (rule: max 3, never adjacent). Putting real, live work second also serves the *trust within 10 s* goal: proof first, story after. This is the portfolio IA the skill recommends.
2. **The signature is the clip itself turning into the site.** I replaced the separate C2 ribbon with this. Only 3 featured projects on a curved ribbon reads sparse (C2 is built for 4–8 cards), and it would need its own pin. Instead, the desk-dive clip's floating panels **hand off to real DOM panels in the same positions**. Those panels are the 3 featured screenshots, and each one pushes forward out of the dark in turn (C5 depth-stack motion on the Z axis), with name, one-liner and "View live ↗". The video doesn't just transition *into* the work; it *becomes* the work. One pin, one memorable moment. *(Remix: website panels × assemble/unveil × scroll-scrub × full-bleed depth; sources H1 + C5 + S6 hand-off.)* If you'd still rather have the C2 ribbon, say so and I'll put it there instead.
3. **The Statement rises over the hero as an ivory card** (S7-style top radius), not a hard cut from black to ivory.

### Page
```
Vibe: E3 · Dark 4 · Warm 1 · Tech 3 · Play 2 · Rich 2 → Dark Gold Luxury × Tech Editorial
Tokens: #0F0E0C / #EFE9DF / #B08D57 · Clash Display + Instrument Serif italic + Inter Tight · r12 · expo.out 1.0s · Lenis 0.08

00 Preloader   P5 "SK TAWHID HOSSEN" letter-spacing collapse + deblur, 1px brass line = real
               progress of hero first frames; ≤2 s; skipped on repeat visits (try/catch storage)  E2
01 Hero        H1 hero-portrait scrubbed, PIN #1 300vh. Lower third: giant "TAWHID" (Clash 16vw,
     [obsidian] ivory); above it the label "SK TAWHID HOSSEN — Full-Stack Website Developer";
               bottom line "Currently at HaveStack Technologies" + brass dot. TAWHID tracks
               slightly wider and fades by 35%; captions T1 line-mask at 30/55/80% left & right
               of the subject: "Websites that look *expensive*." → "Designed and built end to
               end." → "Based in Dhaka. Working worldwide." Ends on obsidian.                     E4
02 Statement   T2 word-by-word highlight, ivory card rising over hero end (top radius 24px).
     [ivory]   Calm. Paragraph (draft below).                                                     E2
03 Work ★      SIGNATURE · PIN #2 ~260vh: desk-dive scrub (0–55%) → whiteout lands on ivory →
     [obsidian] panels → 3 real project panels at depth; each pushes forward in turn with
               T1 title + one-liner + View live ↗ / Case study (55–100%). Then unpinned:
               C6 hover-follow index of all 5 (number · name · type · stack · year-free; brass
               row hover, preview follows cursor with lerp + ≤3° tilt; on touch the row expands
               to show its thumbnail inline).                                         E5 + E3
04 About       S3 PIN #3 150vh: small obsidian card on ivory scales to fullscreen while "ABOUT"
     [ivory→obsidian] / "ME" split to the edges; inside: rembg cutout under B1 warm spotlight
               (radial, brass ≤12% alpha), story (T1), role line "Full-Stack Website Developer
               · HaveStack Technologies".                                                         E4
05 Technologies M5 slow typographic strip, two rows in opposite directions, ~40 s per loop,
     [ivory]   no velocity reaction. Clash 500 names separated by brass hairline dots.
               Calm buffer between pins/sticky sections.                                          E1
06 Services    S7 stacked sticky cards (CSS sticky, no pin): 7 ivory cards on obsidian, each
     [obsidian] "0N / 07", title, one sentence, 4-item "What you get" list; previous card scales
               to .94 and dims. No prices.                                                        E3
07 Process     S15 brass line draws across Discover → Design → Build → Launch; nodes fill as
     [ivory]   reached; one sentence each. Vertical on mobile.                                    E2
08 Contact     F2 "LET'S BUILD / SOMETHING *great*." (T10 fill on "great", ivory→brass);
     [obsidian] giant copy-email pill (copies + "Copied"), mailto link; <!-- FORM SLOT --> marked
               block; Q5 live Asia/Dhaka clock + "Available for new projects" dot; small nav;
               "© SK Tawhid Hossen".                                                              E3
Persistent: M1 12px brass ring cursor (grows to "View" over work, hidden on touch) ·
            M4 1px brass progress line · M3 nav (TAWHID left; Work · About · Services · Contact;
            blurred obsidian after 80px, hides on scroll down) · B2 grain 5%
Pins: Hero · Work · About — 3, never adjacent (Statement and the C6 index sit between them)
Energy total: 2+4+2+5+3+4+1+3+2+3 = 29 → inside Balanced budget (24–30); peak at ~35–45% of page
Curve: high (hero) → calm (statement) → PEAK (work) → build (about) → calm (tech) → steady → strong close
```

### Case-study pages `/work/<slug>.html`
Shared template: clip-path hero reveal of the full-width screenshot → title + one-line description → facts row (Role · Stack · Type · Live ↗) → "What it is" (2–3 sentences, from the site) → "My role" → key screens (desktop full-page crops + mobile shot, inner parallax) → "View live ↗" → "Next project" big link with hover image. Page transition: obsidian clip wipe. Same nav/cursor/footer.

### Copy drafts (tone check; full copy written at build)
- **Statement:** "I design and build complete websites, from the first layout to the live server. Clean code, fast pages, and a finish that makes a brand look as serious as it is."
- **About story:** "I'm Tawhid, a full-stack website developer in Dhaka, working at HaveStack Technologies. I take a website from idea to launch on my own: the design, the frontend, the backend and the deployment. What I care about is simple: a site should make a brand look premium and load fast. Everything I build is measured against those two things."
- **Section titles:** "Selected *work*." · "What I *build*." · "The *toolkit*." · "How it *works*."
- **Services** (example): *Landing pages*: "One page, one goal, built to convert." What you get: custom design · copy structure · mobile-first build · analytics + deployment.

### Assumptions to confirm (facts, not kick-off questions)
- **My role** on every project = "Design & full-stack development". Tell me if any project was partly someone else's.
- **Years** are omitted on all projects (not provided).

---

## 4. Build plan after approval
1. Tokens, fonts, base layout, grain → 2. Lenis/ScrollTrigger, reduced-motion switch, preloader → 3. Hero: real frames are already here, so extract now (the placeholder canvas is only a fallback) → 4. Statement → 5. **Work signature** (most polish time) + C6 index → 6. About (rembg cutout) → 7. Technologies, Services, Process → 8. Contact/footer, persistent details → 9. Case studies ×5 → 10. OG image, favicon, `vercel.json` → 11. QA at 375/768/1280/1920, reduced motion, contrast, Lighthouse.

Libraries (import map, jsDelivr): `gsap@3.15.0` (ScrollTrigger, SplitText, Flip) · `lenis@1.3.27` + CSS. **No Three.js**: nothing in this blueprint needs WebGL, which keeps the page lighter for the Lighthouse ≥90 target.
