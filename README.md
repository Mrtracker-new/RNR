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

Just clean UI, smooth page transitions, real projects, and a live blog powered by the Dev.to API. It's my corner of the internet. Come hang.

---

## ⚡ Performance — here's the receipts

| Metric | Result |
|--------|--------|
| 🏎️ Lighthouse Performance | **94+** |
| 📦 Bundle (gzipped) | **~123 KB** |
| 🗜️ Compression | **Gzip + Brotli** |
| 🧩 Code Splitting | **5 lazy chunks** |
| ♿ Accessibility | **Skip links + ARIA roles** |
| 🔒 Security Headers | **CSP, HSTS, X-Frame-Options...** |

Everything lazy-loads. `console.log` is stripped in production. Source maps are off. Your data plan and your inspector are both safe. 😅

---

## 🛠️ Tech Stack

| Tool | Why I picked it |
|------|----------------|
| **React 19** | Bleeding edge. I like living dangerously. |
| **TypeScript** | Because `undefined is not a function` ruins lives. |
| **Vite 6 + Terser** | Fastest build tool I've used. Minifies like a champ. |
| **Styled Components v6** | CSS-in-JS. Judge me. I regret nothing. |
| **Framer Motion 12** | The secret behind all the *whoosh* effects. |
| **React Router v7** | Handles URL routing cleanly. |
| **React Helmet Async** | Per-page SEO meta tags. |
| **Dev.to API** | Live blog posts, no API key needed. 🎉 |

---

## 🗂️ What's inside

```
src/
├── pages/                  # The main "rooms" of the site
│   ├── Home.tsx            # Hero section, first impressions matter
│   ├── About.tsx           # The lore, the origin story
│   ├── Projects.tsx        # Trophy cabinet (biggest file, most love)
│   ├── Blog.tsx            # Thoughts, fetched live from Dev.to
│   ├── Contact.tsx         # Slide into my DMs (professionally)
│   └── NotFound.tsx        # 404 — you wandered off, buddy
│
├── components/             # Reusable pieces
│   ├── Navbar.tsx          # Responsive, animated navigation
│   ├── Footer.tsx          # The bottom (still important)
│   ├── SEO.tsx             # Meta tags, OG data, per-page titles
│   ├── LoadingSpinner.tsx  # Full-screen loader while chunks arrive
│   ├── ErrorBoundary.tsx   # Catches crashes so the whole app doesn't explode
│   ├── ExitIntentPopup.tsx # Gently begs you not to leave 😂
│   ├── ResumeDownload.tsx  # One-click CV grab
│   ├── BlogCard.tsx        # Cards for each Dev.to article
│   ├── Breadcrumb.tsx      # Tells you where you are
│   ├── FAQSchema.tsx       # Structured JSON-LD data for SEO
│   └── ScrollToTop.tsx     # Resets scroll on route change
│
├── data/
│   └── projects.ts         # All project data lives here (edit this to add projects)
│
├── hooks/
│   └── useViewTransition.ts  # View Transition API wrapper (Framer Motion fallback)
│
├── utils/
│   ├── devto.ts            # Dev.to REST API fetch logic
│   ├── performance.ts      # ScrollOptimizer & perf helpers
│   └── routes.ts           # Typed route constants
│
├── styles/                 # Global styles & design tokens
├── assets/                 # Static assets (images, icons, resume)
├── App.tsx                 # Root: routing, lazy loading, transitions
└── index.tsx               # Entry point — where it all starts
│
scripts/
└── update-sitemap.mjs      # Runs before every build to keep sitemap fresh
```

---

## 🏗️ Build setup (the nerdy bits)

The Vite config is properly tuned for production:

- **Terser** minification — 2 passes, `console.log` dropped, dead code gone
- **Gzip + Brotli** compression via `vite-plugin-compression`
- **Manual code splitting** — vendor, motion, router, styled, and helmet each get their own chunk
- **Tree shaking** — Framer Motion and Styled Components side-effects excluded
- **Pre-build hook** — sitemap auto-updates before every `npm run build`

Security headers are set in `netlify.toml` — CSP, HSTS, X-Frame-Options, Permissions-Policy — the full stack.

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
npm run build    # Sitemap update → TypeScript check → Vite production bundle
npm run preview  # Preview the production build locally before deploying
```

### 🔐 Environment setup

```bash
cp .env.example .env
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
