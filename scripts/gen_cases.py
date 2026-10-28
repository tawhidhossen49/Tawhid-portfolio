"""Generates /work/<slug>.html case-study pages, reusing the home page head, nav, menu and contact footer.

  python scripts/gen_cases.py      (edit the P list below to change copy, then re-run)
"""
import re, sys, html
from pathlib import Path

ROOT = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).resolve().parent.parent
home = (ROOT / 'index.html').read_text(encoding='utf-8')

# reuse exact blocks from the home page so the chrome stays in sync
head_assets = re.search(r'(  <link rel="preload".*?  </script>)\n</head>', home, re.S).group(1)
symbols = re.search(r'(  <svg width="0".*?</svg>)', home, re.S).group(1)
chrome = re.search(r'(  <div class="progress".*?</div>\n  </div>\n)', home, re.S).group(1)  # progress, cursor, nav, menu
contact = re.search(r'(    <!-- 08 · Contact.*?</section>\n)', home, re.S).group(1)

P = [
  dict(slug='ayct', n='01', name='Amaze Youth Chess Tournament', short='AYCT', type='Event website &amp; portal',
       url='https://ayct-five.vercel.app', stack='HTML, CSS, JavaScript, GSAP (ScrollTrigger, SplitText), Lenis, Vercel',
       lede='The official home of a national youth chess championship — format, registration, a live countdown and a player portal.',
       what='The Amaze Youth Chess Tournament is an annual championship for Bangladeshi students under 30. The site explains the whole format — an open Selection Round on Lichess, eight groups of four and a knockout road to the final — takes registrations, counts down to the first move, and leads players into a portal where every game is played live.',
       role='Design and full-stack development, end to end: the chrome-on-black visual system, scroll-driven motion with GSAP and Lenis, the build, and deployment on Vercel.',
       shots=['Opening scene — “Become legendary.”', 'Groups — eight groups, four seats each', 'The portal — one portal, four roles'],
       alt='Amaze Youth Chess Tournament homepage: chrome chess pieces on black with a live countdown'),
  dict(slug='aries', n='02', name='ARIES', short='ARIES', type='Research &amp; editorial',
       url='https://amaze-ries.vercel.app', stack='HTML, CSS, JavaScript, Vercel',
       lede='The research hub of Amaze Consortium, presenting a grassroots education study across Bangladesh.',
       what='ARIES — the Amaze Research, Innovation &amp; Exploration Society — is the research hub of Amaze Consortium. The site presents its pilot study on what students and teachers believe education is for, through three research lenses, the gaps the existing literature has not closed, and a clear path for members to join the work.',
       role='Design and full-stack development, end to end: an editorial serif system on deep green and warm paper, the page structure for long-form research content, the build, and deployment on Vercel.',
       shots=['Focus areas — three lenses on one question', 'Research gaps — numbered, sourced entries', 'Join the network'],
       alt="ARIES homepage: serif headline 'Grassroots data, gathered rigorously' on deep green"),
  dict(slug='havestack', n='03', name='HaveStack', short='HaveStack', type='Corporate · B2B',
       url='https://have-stack.vercel.app', stack='HTML, CSS, JavaScript, Vercel',
       lede='Corporate site for a Dhaka enterprise software company — practice areas, managed systems, products and how engagements run.',
       what='HaveStack Technologies is an enterprise software practice in Dhaka that builds, integrates and maintains the systems institutions depend on. The site sets out how the company takes on work, its five practice areas, the systems it keeps under management, its own products, the sectors it serves and how an engagement runs from discovery to operations. It is also where I work.',
       role='Design and full-stack development, end to end: a restrained dark, photographic system with a single signal accent, the information architecture for a B2B audience, the build, and deployment on Vercel.',
       shots=['Products — software the practice runs itself', 'Sectors — where these systems run', 'Delivery — how an engagement runs'],
       alt="HaveStack homepage: 'Build your ideas' over a dark office scene"),
  dict(slug='amaze-consortium', n='04', name='Amaze Consortium', short='Amaze Consortium', type='Organisation',
       url='https://amaze-con.vercel.app', stack='HTML, CSS, JavaScript, GSAP (ScrollTrigger), Lenis, Vercel',
       lede='Website for a youth-led multi-sector organisation — subsidiaries, leadership, academy and applications.',
       what='Amaze Consortium is a youth-led, multi-sector organisation that brings independently run subsidiaries under one strategic vision. The site introduces the consortium and how it is structured, its subsidiaries, founder, executive members and advisors, and the ways to get involved — internships, donations and partnerships.',
       role='Design and full-stack development, end to end: a bold black-and-paper type system, scroll motion with GSAP and Lenis, the build, and deployment on Vercel.',
       shots=['Overview — the consortium in numbers', 'Subsidiaries — one vision, independent ventures', 'Contact — “let’s connect.”'],
       alt="Amaze Consortium homepage: 'building minds, ideas & the future.' in bold type on black"),
  dict(slug='shahedin', n='05', name='Shahedin', short='Shahedin', type='Creator platform',
       url='https://2nd-shahedin-project.vercel.app', stack='HTML, CSS, JavaScript, Supabase, Vercel',
       lede='A Bangla-language platform for a YouTube educator — courses, a store, featured videos and a member dashboard.',
       what='Shahedin is the personal platform of a Bangla-language YouTube educator who teaches geopolitics, history, economics and soft skills. The site brings together featured videos, paid courses, a product store and his story, with sign-in and a member dashboard backed by Supabase.',
       role='Design and full-stack development, end to end: a Bangla-first layout and type, course and store pages, Supabase-backed accounts and content, and deployment on Vercel.',
       shots=['Featured videos', 'Featured course', 'The story — from a village to an audience'],
       alt='Shahedin homepage: Bangla headline beside a portrait of the educator'),
]

ARROW = '<svg class="i-arrow" aria-hidden="true"><use href="#i-arrow"/></svg>'

for i, p in enumerate(P):
    nxt = P[(i + 1) % len(P)]
    shots = ''.join(f'''
          <figure class="cs-shot">
            <div class="cs-shot__frame" data-parallax><img src="/assets/work/{p['slug']}/screen-{k + 1}.webp" alt="{html.escape(p['short'])} — {html.escape(re.sub(r'<.*?>', '', cap))}" width="1440" height="900" loading="lazy" decoding="async"></div>
            <figcaption>{cap}</figcaption>
          </figure>''' for k, cap in enumerate(p['shots'][1:], start=1))
    page = f'''<!doctype html>
<html lang="en" class="no-js">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>{html.unescape(p['name'])} — Case study · SK Tawhid Hossen</title>
  <meta name="description" content="{html.unescape(p['lede'])} Designed and built by SK Tawhid Hossen, full-stack website developer in Dhaka.">
  <meta name="theme-color" content="#0F0E0C">

  <meta property="og:type" content="article">
  <meta property="og:title" content="{html.unescape(p['name'])} — Case study · SK Tawhid Hossen">
  <meta property="og:description" content="{html.unescape(p['lede'])}">
  <meta property="og:image" content="/assets/work/{p['slug']}/cover.webp">
  <meta name="twitter:card" content="summary_large_image">

  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
  <link rel="icon" href="/assets/favicon-32.png" sizes="32x32" type="image/png">
  <link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">

  <script>
    (function (d) {{
      var h = d.documentElement;
      h.classList.remove('no-js');
      h.classList.add('js', 'pl-skip');
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) h.classList.add('is-reduced');
      setTimeout(function () {{ if (!h.classList.contains('is-booted')) {{ h.classList.remove('js'); h.classList.add('no-js'); }} }}, 6000);
    }})(document);
  </script>

{head_assets}
</head>
<body class="case">
{symbols}

  <a class="skip" href="#main">Skip to content</a>

{chrome}
  <main id="main">

    <section class="cs-hero theme-dark" aria-labelledby="cs-title">
      <div class="wrap">
        <a class="link cs-back" href="/#work">{ARROW} All work</a>
        <h1 class="cs-title" id="cs-title" data-reveal="lines">{p['name']}</h1>
        <p class="cs-lede" data-reveal="up">{p['lede']}</p>
      </div>
      <figure class="cs-cover wrap">
        <div class="cs-cover__frame" data-reveal="clip"><img src="/assets/work/{p['slug']}/cover.webp" alt="{p['alt']}" width="1440" height="900" fetchpriority="high" decoding="async"></div>
      </figure>
    </section>

    <section class="cs-facts theme-dark" aria-label="Project facts">
      <dl class="wrap">
        <div><dt>Role</dt><dd>Design &amp; full-stack development</dd></div>
        <div><dt>Stack</dt><dd>{p['stack']}</dd></div>
        <div><dt>Type</dt><dd>{p['type']}</dd></div>
        <div><dt>Live</dt><dd><a class="link" href="{p['url']}" target="_blank" rel="noopener">{p['url'].replace('https://', '')} {ARROW}</a></dd></div>
      </dl>
    </section>

    <section class="cs-body theme-light">
      <div class="wrap">
        <div class="cs-row">
          <h2 class="cs-h">What it is</h2>
          <p class="lead" data-reveal="up">{p['what']}</p>
        </div>
        <div class="cs-row">
          <h2 class="cs-h">My role</h2>
          <p class="body" data-reveal="up">{p['role']}</p>
        </div>
      </div>
    </section>

    <section class="cs-screens theme-dark" aria-labelledby="screens-title">
      <div class="wrap">
        <h2 class="cs-h" id="screens-title">Key screens</h2>
        <div class="cs-screens__grid">
          <div class="cs-pair">
            <figure class="cs-shot cs-phone">
              <div class="cs-shot__frame"><img src="/assets/work/{p['slug']}/mobile.webp" alt="{html.escape(p['short'])} on a phone" width="600" height="1298" loading="lazy" decoding="async"></div>
              <figcaption>Mobile, 390px</figcaption>
            </figure>
            <figure class="cs-shot">
              <div class="cs-shot__frame" data-parallax><img src="/assets/work/{p['slug']}/screen-1.webp" alt="{html.escape(p['short'])} — {html.escape(p['shots'][0])}" width="1440" height="900" loading="lazy" decoding="async"></div>
              <figcaption>{p['shots'][0]}</figcaption>
            </figure>
          </div>{shots}
        </div>
        <div class="cs-live">
          <a class="btn btn--solid" href="{p['url']}" target="_blank" rel="noopener">View live {ARROW}</a>
          <a class="link" href="/#work">Back to all work</a>
        </div>
      </div>
    </section>

    <section class="cs-next theme-light" aria-label="Next project">
      <div class="wrap">
        <a class="next" href="/work/{nxt['slug']}.html" data-cursor="Next">
          <span class="cs-h">Next project</span>
          <span class="next__name">{nxt['name']} {ARROW}</span>
          <span class="next__img" aria-hidden="true"><img src="/assets/work/{nxt['slug']}/cover-960.webp" alt="" width="960" height="600" loading="lazy" decoding="async"></span>
        </a>
      </div>
    </section>

{contact}
  </main>
</body>
</html>
'''
    (ROOT / 'work' / f"{p['slug']}.html").write_text(page, encoding='utf-8')
    print('wrote', p['slug'])
