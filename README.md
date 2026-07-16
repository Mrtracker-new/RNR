<div align="center">

# 🚀 RNR — Rolan's Digital HQ

**A portfolio that actually has a personality. Wild concept, right?**

[![Live Demo](https://img.shields.io/badge/🌐_See_It_Live-rolan--rnr.netlify.app-FF2D20?style=for-the-badge&logo=netlify&logoColor=white)](https://rolan-rnr.netlify.app/)
[![GitHub](https://img.shields.io/badge/📦_Source_Code-GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Mrtracker-new/RNR)

<br />

[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite_6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Styled Components](https://img.shields.io/badge/styled--components-DB7093?style=for-the-badge&logo=styled-components&logoColor=white)](https://styled-components.com/)
[![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://www.netlify.com/)

</div>

---

## 👋 So, what even is this?

This is my personal portfolio — built from scratch, no templates, no "I'm passionate about synergising innovative solutions" energy.

Just clean UI, smooth page transitions, real projects with actual case studies, and a live blog powered by the Dev.to API. It's my corner of the internet. Come hang.

---

## ⚡ Performance — here's the receipts

| Metric | Result |
|--------|--------|
| 🏎️ Lighthouse Performance | **94+** |
| 📦 JavaScript (gzipped) | **~160 KB total, split across 20+ chunks** — you only download what the page needs |
| 🗜️ Compression | **Gzip + Brotli** pre-generated at build time |
| 🧩 Code Splitting | **Every page + heavy component lazy-loads** (11 lazy components, 5 vendor chunks) |
| 🕸️ Prerendering | **Every route ships as real static HTML** — crawlers never see an empty shell |
| ♿ Accessibility | **Focus traps, `:focus-visible` rings, skip links, ARIA dialogs, reduced-motion support** |
| 🔒 Security Headers | **Strict CSP, HSTS preload, X-Frame-Options: DENY, Permissions-Policy, Referrer-Policy** |

Everything lazy-loads. `console.log` is stripped in production. Source maps are off. Your data plan and your inspector are both safe. 😅

---

## 🛠️ Tech Stack

| Tool | Why I picked it |
|------|----------------|
| **React 19** | Bleeding edge. I like living dangerously. |
| **TypeScript 5.7** | Because `undefined is not a function` ruins lives. |
| **Vite 6 + Terser** | Fastest build tool I've used. Minifies like a champ. |
| **Styled Components v6** | CSS-in-JS. Judge me. I regret nothing. |
| **Framer Motion 12** | The secret behind all the *whoosh* effects. |
| **React Router v7** | Handles URL routing cleanly. |
| **React Helmet Async** | Per-page SEO meta tags + JSON-LD structured data. |
| **Puppeteer (build-time only)** | Prerenders every route to static HTML after each build. |
| **Dev.to API** | Live blog posts, no API key needed. 🎉 |

---

## 🗂️ What's inside

```
src/
├── pages/                    # The main "rooms" of the site
│   ├── Home.tsx              # Hero section, first impressions matter
│   ├── About.tsx             # The lore, the origin story
│   ├── Projects.tsx          # Trophy cabinet — page logic only
│   ├── projects/             # ...its styled-components, icons & case-study modal
│   ├── Blog.tsx              # Thoughts, fetched live from Dev.to
│   ├── Contact.tsx           # Slide into my DMs (professionally)
│   └── NotFound.tsx          # 404 — you wandered off, buddy
│
├── components/               # Reusable pieces
│   ├── Navbar.tsx            # Responsive nav with focus-trapped mobile menu
│   ├── Footer.tsx            # The bottom (still important)
│   ├── SEO.tsx               # Meta tags, OG/Twitter cards, JSON-LD schemas
│   ├── DecryptText.tsx       # The Matrix-y text scramble effect
│   ├── LoadingSpinner.tsx    # Full-screen loader while chunks arrive
│   ├── ErrorBoundary.tsx     # Catches crashes so the whole app doesn't explode
│   ├── ExitIntentPopup.tsx   # Gently begs you not to leave 😂
│   ├── ResumeDownload.tsx    # One-click CV grab
│   ├── BlogCard.tsx          # Cards for each Dev.to article
│   ├── Breadcrumb.tsx        # Tells you where you are
│   ├── FAQSchema.tsx         # FAQPage JSON-LD for rich results
│   ├── ScrollToTop.tsx       # Resets scroll on route change
│   └── layout/primitives.tsx # Shared SectionHeading / MicroLabel / TechPill
│
├── data/
│   └── projects.ts           # All project data lives here (edit this to add projects)
│
├── hooks/
│   ├── useFocusTrap.ts       # Tab-cycling, Esc-to-close, focus restore for dialogs
│   ├── useMediaQuery.ts      # Resize-reactive CSS media query subscription
│   └── useViewTransition.ts  # View Transition API wrapper (Framer Motion fallback)
│
├── utils/
│   ├── devto.ts              # Dev.to fetch + memory/localStorage cache (SWR-style)
│   ├── performance.ts        # ScrollOptimizer & perf helpers
│   └── routes.ts             # Typed route constants
│
├── styles/
│   ├── critical.css          # Design tokens, resets, global focus styles
│   ├── GlobalStyle.ts        # Shared layout primitives (Container, Button, Badge)
│   └── surfaces.ts           # Glassmorphism surface mixins
│
├── assets/                   # Static assets (AVIF images, icons, resume)
├── App.tsx                   # Root: routing, lazy loading, transitions
└── index.tsx                 # Entry point — where it all starts

scripts/
├── update-sitemap.mjs        # Prebuild: keeps sitemap lastmod dates fresh
└── prerender.mjs             # Postbuild: Puppeteer visits every route → static HTML
```

---

## 🏗️ Build setup (the nerdy bits)

`npm run build` is actually a three-stage pipeline:

1. **Prebuild** — `update-sitemap.mjs` refreshes the sitemap's `lastmod` dates
2. **Build** — `tsc -b` type-checks, then Vite bundles with:
   - **Terser** minification — 2 passes, `console.log` dropped, dead code gone
   - **Gzip + Brotli** compression via `vite-plugin-compression`
   - **Manual vendor splitting** — react, motion, router, styled, and helmet each get their own chunk
   - **Tree shaking** — Framer Motion and Styled Components side-effects excluded
3. **Postbuild** — `prerender.mjs` spins up a local server over `build/`, drives headless Chrome through every route, and writes the fully-rendered HTML back to static paths. Crawlers get real content with zero JavaScript. (In Netlify CI, `netlify-plugin-chromium` supplies the browser.)

Security headers live in `netlify.toml` — strict CSP, HSTS preload, X-Frame-Options, Permissions-Policy — the full stack.

---

## 🚀 Run it yourself

**You'll need:** Node.js v18+ and the urge to poke around someone else's code.

```bash
# 1. Grab the code
git clone https://github.com/Mrtracker-new/RNR.git
cd RNR

# 2. Install dependencies (get a coffee ☕ — it takes a sec)
npm install

# 3. Fire it up
npm run dev
```

Open `http://localhost:5173` and you're in.

```bash
npm run build    # Sitemap update → type check → Vite bundle → prerender all routes
npm run preview  # Preview the production build locally before deploying
```

> **Heads up:** the prerender step needs a Chrome install. It auto-detects the usual
> locations on Windows/macOS/Linux, or you can point it somewhere with the
> `CHROME_PATH` env var. `npm run dev` doesn't need any of this.

### 🔐 Environment setup

```bash
cp .env.example .env.local
```

Only one variable you actually need: `VITE_DEVTO_USERNAME` — set it to your Dev.to handle and the blog page is live. Everything else in `.env.example` is optional or build-time only.

---

## 📬 Let's connect

- 🌍 **Portfolio** → [rolan-rnr.netlify.app](https://rolan-rnr.netlify.app/)
- 💻 **GitHub** → [@Mrtracker-new](https://github.com/Mrtracker-new)
- 📝 **Blog** → [dev.to/rolan_r_n_r](https://dev.to/rolan_r_n_r)
- 📧 **Email** → [rolanlobo901@gmail.com](mailto:rolanlobo901@gmail.com)
- 📍 **Based in** → India 🇮🇳

---

<div align="center">

*Made with ❤️, an embarrassing amount of ☕, and way too many `console.log`s — which are now gone in prod, RIP.*

**— Rolan**

⭐ If you liked it, a star goes a long way!

</div>
