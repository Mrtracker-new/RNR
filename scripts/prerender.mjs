/**
 * scripts/prerender.mjs
 *
 * Post-build static pre-renderer.
 *
 * Spins up a minimal HTTP file server over the `build/` folder, then uses
 * puppeteer-core (with the Chromium binary supplied by netlify-plugin-chromium
 * in CI, or the locally-installed Chrome on dev) to visit every route, waits
 * for React to render the page heading, and writes the resulting HTML back to
 * the correct static path so crawlers receive real content without JavaScript.
 *
 * Route → output file mapping:
 *   /          → build/index.html
 *   /about     → build/about/index.html
 *   /projects  → build/projects/index.html
 *   /blog      → build/blog/index.html
 *   /contact   → build/contact/index.html
 *   /404       → build/404.html          (served with a real 404 status)
 */

import { createServer } from 'node:http';
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { join, extname, dirname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BUILD_DIR = resolve(__dirname, '../build');
const PORT = 5174; // avoid conflict with vite dev server
const BASE_URL = `http://localhost:${PORT}`;

/* The untouched SPA shell, captured before any route is written. Document
   requests always boot from this shell so Helmet starts from a clean <head>
   instead of inheriting tags from an already-prerendered page. */
/* The shell's static <title> is only a placeholder for the first paint. Helmet
   writes the page title by updating the first <title> it finds, so shipping the
   placeholder into the snapshot leaves a second, wrong title behind. Serve the
   shell without one and let Helmet be the only author. */
const SHELL_HTML = readFileSync(join(BUILD_DIR, 'index.html'), 'utf8')
  .replace(/<title[^>]*>[^<]*<\/title>/, '');

/* Case-study routes. These mirror the `slug` values in src/data/projects.ts —
   src/data/projects.test.ts fails if the two lists drift apart. */
const PROJECT_SLUGS = [
  'buildwise-ai',
  'invisiovault-r',
  'bar-desktop',
  'sortify',
  'invisiovault-web',
  'yt-downloader',
  'cursorcam',
  'rnr-portfolio',
  'contact-manager',
  'linknest',
  'bar-web',
  'netplus',
  'yt-downloader-desktop',
];

const ROUTES = [
  '/',
  '/about',
  '/projects',
  '/blog',
  '/contact',
  ...PROJECT_SLUGS.map((slug) => `/projects/${slug}`),
  '/404',
];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain',
  '.xml': 'application/xml',
};

/** Resolves a request path inside BUILD_DIR, refusing anything that escapes it. */
function resolveRequestPath(urlPath) {
  let clean;
  try {
    clean = decodeURIComponent(urlPath.split('?')[0]);
  } catch {
    return null;
  }

  const candidate = resolve(BUILD_DIR, `.${clean}`);

  if (candidate !== BUILD_DIR && !candidate.startsWith(BUILD_DIR + sep)) return null;
  return candidate;
}

function startServer() {
  return new Promise((resolvePromise, reject) => {
    const srv = createServer((req, res) => {
      const requested = resolveRequestPath(req.url ?? '/');
      if (!requested) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not found');
        return;
      }

      // Every navigation (no file extension) boots the clean shell.
      if (!extname(requested)) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(SHELL_HTML);
        return;
      }

      let filePath = requested;
      let isDir = false;
      try { isDir = statSync(filePath).isDirectory(); } catch { /* not found */ }

      if (isDir) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(SHELL_HTML);
        return;
      }

      try {
        const content = readFileSync(filePath);
        const mimeType = MIME[extname(filePath)] ?? 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': mimeType });
        res.end(content);
      } catch {
        try {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(SHELL_HTML);
        } catch {
          res.writeHead(500);
          res.end('Server error');
        }
      }
    });

    srv.on('error', reject);
    srv.listen(PORT, '127.0.0.1', () => {
      console.log(`[prerender] Static server listening on ${BASE_URL}`);
      resolvePromise(srv);
    });
  });
}

function getChromePath() {
  if (process.env.CHROME_PATH) {
    console.log(`[prerender] Using CHROME_PATH: ${process.env.CHROME_PATH}`);
    return process.env.CHROME_PATH;
  }

  const candidates = [
    // Windows
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    process.env.LOCALAPPDATA
      ? join(process.env.LOCALAPPDATA, 'Google\\Chrome\\Application\\chrome.exe')
      : '',
    // macOS
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    // Linux CI
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
    '/snap/bin/chromium',
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      console.log(`[prerender] Found Chrome at: ${candidate}`);
      return candidate;
    }
  }

  throw new Error(
    '[prerender] Could not locate Chrome/Chromium. ' +
    'Set CHROME_PATH or install Google Chrome. ' +
    'On Netlify, keep netlify-plugin-chromium in netlify.toml.'
  );
}

async function launchBrowser() {
  const executablePath = getChromePath();

  try {
    return await puppeteer.launch({
      executablePath,
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-extensions',
        '--no-first-run',
      ],
    });
  } catch (error) {
    throw new Error(
      `[prerender] Chrome failed to launch from ${executablePath}: ${error.message}`
    );
  }
}

/* react-helmet-async only removes head tags carrying data-rh, so the snapshot
   must label the tags it owns. Without this, hydration appends a second copy
   of every meta tag next to the prerendered one. */
const HELMET_META_NAMES = new Set([
  'description', 'keywords', 'author', 'robots',
  'twitter:card', 'twitter:site', 'twitter:creator', 'twitter:url',
  'twitter:title', 'twitter:description', 'twitter:image', 'twitter:image:alt',
]);

function markHelmetTags(html) {
  const headStart = html.indexOf('<head>');
  const headEnd = html.indexOf('</head>');
  if (headStart === -1 || headEnd === -1) return html;

  const rawHead = html.slice(headStart, headEnd);

  /* Crawlers take the first <title> they meet, so any extra title left in the
     head would shadow the page's own. Keep the first, drop the rest. */
  let keptTitle = false;
  const headWithoutStrayTitles = rawHead.replace(/<title[^>]*>[^<]*<\/title>/g, (tag) => {
    if (keptTitle) return '';
    keptTitle = true;
    return tag;
  });

  const head = headWithoutStrayTitles
    .replace(/<meta (name|property)="([^"]+)"/g, (match, attr, key) => {
      const managed = key.startsWith('og:') || key.startsWith('article:') || HELMET_META_NAMES.has(key);
      return managed ? `<meta data-rh="true" ${attr}="${key}"` : match;
    })
    .replace(/<link (rel="(?:canonical|alternate)")/g, '<link data-rh="true" $1')
    .replace(/<script (type="application\/ld\+json")/g, '<script data-rh="true" $1');

  return html.slice(0, headStart) + head + html.slice(headEnd);
}

async function renderRoute(browser, route) {
  const page = await browser.newPage();

  try {
    await page.setUserAgent(
      'Mozilla/5.0 (compatible; Prerenderer/1.0; +https://rolan-rnr.netlify.app)'
    );
    await page.setViewport({ width: 1280, height: 800 });

    // Crawlers don't need pixels: skip image/font/media payloads.
    await page.setRequestInterception(true);
    page.on('request', req => {
      const type = req.resourceType();
      if (['image', 'font', 'media'].includes(type)) req.abort();
      else req.continue();
    });

    await page.goto(`${BASE_URL}${route}`, { waitUntil: 'networkidle0', timeout: 45_000 });

    // Every page must render its heading before the snapshot is taken.
    await page.waitForSelector('#main-content h1', { timeout: 10_000 });

    // The blog resolves asynchronously; wait for a settled state so a snapshot
    // never contains skeletons. The error state is deliberate and allowed.
    if (route === '/blog') {
      await page.waitForSelector('[data-blog-state="ready"], [data-blog-state="error"]', {
        timeout: 15_000,
      });
    }

    // Let entrance animations finish writing their final values.
    await new Promise(r => setTimeout(r, 600));

    // styled-components v6 injects rules through CSSOM in production, so the
    // text node of <style data-styled> is empty until we read it back.
    const inlinedRules = await page.evaluate(() => {
      let total = 0;
      document.querySelectorAll('style[data-styled]').forEach(tag => {
        if (tag.textContent && tag.textContent.trim().length > 0) return;
        const sheet = tag.sheet;
        if (!sheet) return;
        let css = '';
        try {
          for (const rule of sheet.cssRules) css += rule.cssText;
        } catch {
          return;
        }
        tag.textContent = css;
        total += css.length;
      });
      return total;
    });

    const html = await page.content();

    const heading = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    if (!heading || heading[1].replace(/<[^>]*>/g, '').trim().length === 0) {
      throw new Error(`Route ${route} rendered without an <h1> — refusing to write an empty page`);
    }

    return { html: markHelmetTags(html), inlinedRules };
  } finally {
    await page.close();
  }
}

async function main() {
  console.log('\n[prerender] ═══════════════════════════════════════════════');
  console.log('[prerender] Starting production pre-render…');
  console.log('[prerender] ═══════════════════════════════════════════════\n');

  let server;
  let browser;

  try {
    server = await startServer();
    browser = await launchBrowser();

    for (const route of ROUTES) {
      console.log(`[prerender] → Rendering ${route}…`);
      const { html, inlinedRules } = await renderRoute(browser, route);
      console.log(`[prerender]   inlined ${inlinedRules} chars of styled CSS`);

      let outFile;
      if (route === '/404') {
        outFile = join(BUILD_DIR, '404.html');
      } else {
        const relRoute = route === '/' ? '' : route.replace(/^\//, '');
        const outDir = join(BUILD_DIR, relRoute);
        mkdirSync(outDir, { recursive: true });
        outFile = join(outDir, 'index.html');
      }

      writeFileSync(outFile, html, 'utf8');
      console.log(`[prerender] ✓ ${route.padEnd(12)} → ${outFile.replace(BUILD_DIR, 'build')}`);
    }

    console.log('\n[prerender] Pre-render complete. All routes saved.\n');
  } finally {
    if (browser) await browser.close();
    if (server) server.close();
  }
}

main().catch(err => {
  console.error('\n[prerender] Fatal:', err.message ?? err);
  process.exit(1);
});
