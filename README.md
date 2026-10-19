<div align="center">

# RNR — Rolan's Digital HQ

**A portfolio that actually has a personality. Wild concept, right?**

[![Live Demo](https://img.shields.io/badge/See_It_Live-rolan--rnr.netlify.app-FF2D20?style=for-the-badge&logo=netlify&logoColor=white)](https://rolan-rnr.netlify.app/)
[![GitHub](https://img.shields.io/badge/Source_Code-GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/rolan-r-n-r/RNR)

<br />

[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite_6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Styled Components](https://img.shields.io/badge/styled--components-DB7093?style=for-the-badge&logo=styled-components&logoColor=white)](https://styled-components.com/)
[![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://www.netlify.com/)

</div>

---

## So, what even is this?

This is my personal portfolio — built from scratch, no templates, no "I'm passionate about synergising innovative solutions" energy.

Clean UI, real projects with actual case studies, and a live blog powered by the Dev.to API.

---

## Performance & quality

Facts only, checked against the build in this repo (last verified 18 Oct 2026):

| Area | What the build actually does |
|------|------------------------------|
| Code splitting | Every page and the heavy components lazy-load; React, router, motion, styled-components and Helmet each get a vendor chunk |
| Compression | Gzip **and** Brotli files are pre-generated at build time |
| Prerendering | `/`, `/about`, `/projects`, `/blog`, `/contact` and every case study at `/projects/<slug>` ship as real static HTML, plus a prerendered `404.html` |
| Images | AVIF banners with 400w/800w variants and `srcset`; the hero portrait has six widths |
| Accessibility | Skip link, focus traps with background `inert`, route-change focus, `:focus-visible` rings, reduced-motion support, WCAG AA text contrast |
| Security headers | CSP without inline scripts, HSTS, `X-Frame-Options: DENY`, CORP/COOP, Permissions-Policy |

### Lighthouse

Measured against the production build on this machine (`npm run preview`, Lighthouse v13.5.0, 19 Oct 2026):

| Page | Preset | Performance | Accessibility | Best Practices | SEO |
|------|--------|-------------|---------------|----------------|-----|
| `/` | Desktop | **98** | **100** | **100** | **100** |
| `/` | Mobile | 82 | **100** | **100** | **100** |
| `/projects` | Desktop | **98** | **100** | **100** | **100** |

---

## Tech Stack

| Tool | Why I picked it |
|------|----------------|
| **React 19** | Bleeding edge. I like living dangerously. |
| **TypeScript 5.7** | Because `undefined is not a function` ruins lives. |
| **Vite 6 + Terser** | Fast builds, aggressive minification. |
| **Styled Components v6** | CSS-in-JS. Judge me. I regret nothing. |
| **Framer Motion 12** | The secret behind all the *whoosh* effects. |
| **React Router v7** | URL routing without ceremony. |
| **React Helmet Async** | The only owner of per-page meta tags and JSON-LD. |
| **Puppeteer (build-time only)** | Prerenders every route to static HTML. |
| **Dev.to API** | Live blog posts, no API key needed. |

---

## What's inside

```
src/
├── pages/                    # The main "rooms" of the site
│   ├── Home.tsx              # Hero, stats, selected work, latest writing
│   ├── About.tsx             # Timeline, skills, focus areas
│   ├── Projects.tsx          # Filters, featured rows, project table
│   ├── projects/             # Styled components + case-study modal
│   ├── Blog.tsx              # Posts fetched from Dev.to
│   ├── Contact.tsx           # Form, details, socials, visible FAQ
│   └── NotFound.tsx          # 404
│
├── components/               # Reusable pieces
│   ├── Navbar.tsx            # Focus-trapped, portaled mobile menu
│   ├── Footer.tsx            # Nav, socials, copy-email
│   ├── SEO.tsx               # Meta tags, OG/Twitter cards, JSON-LD
│   ├── Breadcrumb.tsx        # BreadcrumbList for known sub-pages only
│   ├── FAQSchema.tsx         # FAQPage markup backed by visible content
│   ├── DecryptText.tsx       # Text scramble with an sr-only real label
│   ├── LoadingSpinner.tsx    # Full-screen loader while chunks arrive
│   ├── ErrorBoundary.tsx     # Route + app error fallbacks
│   ├── ExitIntentPopup.tsx   # Suppressed on /contact and over dialogs
│   ├── ResumeDownload.tsx    # Hover/focus/Escape resume preview
│   ├── BlogCard.tsx          # Dev.to article rows
│   ├── ScrollToTop.tsx       # Scroll reset + focus handoff
│   ├── icons.tsx             # Shared SVG glyphs
│   └── layout/primitives.tsx # SectionHeading / MicroLabel / TechPill
│
├── data/
│   ├── projects.ts           # All project data (edit this to add projects)
│   └── faq.ts                # One FAQ list for UI + structured data
│
├── hooks/
│   ├── useFocusTrap.ts       # Tab cycling, Esc to close, focus restore
│   ├── useScrollLock.ts      # Reference-counted page scroll lock
│   ├── useBackgroundInert.ts # Inert background while a dialog is open
│   ├── useDevtoPosts.ts      # Shared Dev.to cache subscription
│   └── useMediaQuery.ts      # Resize-reactive media query
│
├── utils/
│   ├── devto.ts              # Dev.to fetch + validated memory/localStorage cache
│   ├── site.ts               # URL, email, socials, nav, shared copy
│   └── routes.ts             # Typed route constants
│
├── styles/
│   ├── critical.css          # Tokens, resets, global focus styles
│   ├── GlobalStyle.ts        # Container, Button, Badge
│   └── surfaces.ts           # Surface mixins
│
├── assets/                   # Project images (plus generated 400w/800w variants)
├── App.tsx                   # Routing, lazy loading, shell
└── index.tsx                 # Entry point
```

---

## Build pipeline

`npm run build` does three things:

1. **Type check** — `tsc -b`
2. **Bundle** — Vite + Terser, gzip/Brotli compression, manual vendor chunks
3. **Postbuild**:
   - `generate-sitemap.mjs` writes `build/sitemap.xml`, taking each `lastmod` from the last git commit that touched that page
   - `prerender.mjs` serves the clean SPA shell, visits every route, waits for the rendered `<h1>` (and for the blog to settle), inlines styled-components CSS, and writes static HTML — including `404.html`
   - `verify-build.mjs` then asserts every written document is crawlable: exactly one title, description, canonical and robots tag, one `<h1>` on each page, a `noindex` and canonical-free `404.html`, a sitemap that lists every indexable URL, and a present social card. A regression fails the build.

Security headers and the 404 rule live in `netlify.toml`. There is no second `_headers` / `_redirects` file to drift out of sync.

### Checks

```bash
npm run lint     # ESLint (flat config)
npm test         # Vitest: project data, site config, date formatting
npm run build    # type check → bundle → sitemap + prerender
```

CI runs the same three commands on every push to `master` and every pull request.

---

## Run it yourself

**You'll need:** Node.js 20+ and the urge to poke around someone else's code.

```bash
git clone https://github.com/rolan-r-n-r/RNR.git
cd RNR

npm install
npm run dev
```

Open `http://localhost:5173` and you're in.

```bash
npm run preview  # preview the production build locally
```

> **Heads up:** the prerender step needs Chrome. It auto-detects the usual
> locations on Windows/macOS/Linux, or you can point it somewhere with the
> `CHROME_PATH` env var. `npm run dev` doesn't need any of this.

### Environment setup

```bash
cp .env.example .env.local
```

Only one variable matters: `VITE_DEVTO_USERNAME`. Set it to your Dev.to handle and the blog page is live. Production values belong in the Netlify dashboard.

---

## Let's connect

- **Portfolio** — [rolan-rnr.netlify.app](https://rolan-rnr.netlify.app/)
- **GitHub** — [@rolan-r-n-r](https://github.com/rolan-r-n-r)
- **Blog** — [dev.to/rolan_r_n_r](https://dev.to/rolan_r_n_r)
- **Email** — [rolanlobo901@gmail.com](mailto:rolanlobo901@gmail.com)
- **Based in** — India

---

<div align="center">

*Made with care, an embarrassing amount of coffee, and way too many `console.log`s — which are now gone in prod, RIP.*

**— Rolan**

If you liked it, a star goes a long way.

</div>
