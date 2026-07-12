/**
 * scripts/prerender.mjs
 *
 * Post-build static pre-renderer.
 *
 * Spins up a minimal HTTP file server over the `build/` folder, then uses
 * puppeteer-core (with the Chromium binary supplied by netlify-plugin-chromium
 * in CI, or the locally-installed Chrome on dev) to visit every route, waits
 * for React to fully render, and writes the resulting HTML back to the correct
 * static path so crawlers like Bingbot receive real content without JavaScript.
 *
 * Route → output file mapping:
 *   /          → build/index.html          (overwrites empty SPA shell)
 *   /about     → build/about/index.html
 *   /projects  → build/projects/index.html
 *   /blog      → build/blog/index.html
 *   /contact   → build/contact/index.html
 *
 * Usage:
 *   node scripts/prerender.mjs        (manual)
 *   npm run build                     (automatic via postbuild hook)
 */

import { createServer }                      from 'node:http';
import { readFileSync, writeFileSync,
         mkdirSync, existsSync, statSync }   from 'node:fs';
import { join, extname, dirname }            from 'node:path';
import { fileURLToPath }                     from 'node:url';
import puppeteer                             from 'puppeteer-core';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BUILD_DIR = join(__dirname, '../build');
const PORT      = 5174; // avoid conflict with vite dev server
const BASE_URL  = `http://localhost:${PORT}`;

/* ─── Routes to pre-render ────────────────────────────────────────────────── */
const ROUTES = ['/', '/about', '/projects', '/blog', '/contact'];

/* ─── MIME types ──────────────────────────────────────────────────────────── */
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.json': 'application/json',
  '.png':  'image/png',
  '.ico':  'image/x-icon',
  '.svg':  'image/svg+xml',
  '.avif': 'image/avif',
  '.webp': 'image/webp',
  '.woff2':'font/woff2',
  '.txt':  'text/plain',
  '.xml':  'application/xml',
};

/* ─── Lightweight static file server ─────────────────────────────────────── */
function startServer() {
  return new Promise((resolve, reject) => {
    const srv = createServer((req, res) => {
      // Strip query string
      let urlPath = req.url.split('?')[0];

      // Resolve file path
      let filePath = join(BUILD_DIR, urlPath);

      // If it's a directory or has no extension, serve index.html (SPA fallback)
      let isDir = false;
      try { isDir = statSync(filePath).isDirectory(); } catch { /* not found */ }

      if (isDir || !extname(filePath)) {
        filePath = join(BUILD_DIR, 'index.html');
      }

      // Try to read and serve the file
      try {
        const content  = readFileSync(filePath);
        const mimeType = MIME[extname(filePath)] ?? 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': mimeType });
        res.end(content);
      } catch {
        // 404 → fall back to SPA index
        try {
          const content = readFileSync(join(BUILD_DIR, 'index.html'));
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(content);
        } catch {
          res.writeHead(500);
          res.end('Server error');
        }
      }
    });

    srv.on('error', reject);
    srv.listen(PORT, '127.0.0.1', () => {
      console.log(`[prerender] Static server listening on ${BASE_URL}`);
      resolve(srv);
    });
  });
}

/* ─── Resolve Chrome / Chromium binary ───────────────────────────────────── */
function getChromePath() {
  // netlify-plugin-chromium sets this during Netlify CI builds
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

  for (const p of candidates) {
    if (existsSync(p)) {
      console.log(`[prerender] Found Chrome at: ${p}`);
      return p;
    }
  }

  throw new Error(
    '[prerender] Could not locate Chrome/Chromium. ' +
    'Set CHROME_PATH env var or install Google Chrome.\n' +
    'On Netlify, add the netlify-plugin-chromium plugin to netlify.toml.'
  );
}

/* ─── Main ────────────────────────────────────────────────────────────────── */
async function main() {
  console.log('\n[prerender] ═══════════════════════════════════════════════');
  console.log('[prerender] Starting production pre-render…');
  console.log('[prerender] ═══════════════════════════════════════════════\n');

  let server;
  let browser;

  try {
    server = await startServer();

    browser = await puppeteer.launch({
      executablePath: getChromePath(),
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-extensions',
        '--no-first-run',
        '--single-process',
      ],
    });

    for (const route of ROUTES) {
      const url  = `${BASE_URL}${route}`;
      const page = await browser.newPage();

      // Set a realistic user-agent so any UA detection works
      await page.setUserAgent(
        'Mozilla/5.0 (compatible; Prerenderer/1.0; +https://rolan-rnr.netlify.app)'
      );

      // Viewport
      await page.setViewport({ width: 1280, height: 800 });

      // Speed: abort image/font/media requests (crawlers don't need them)
      await page.setRequestInterception(true);
      page.on('request', (req) => {
        const type = req.resourceType();
        if (['image', 'font', 'media'].includes(type)) req.abort();
        else req.continue();
      });

      console.log(`[prerender] → Rendering ${route}…`);

      await page.goto(url, { waitUntil: 'networkidle0', timeout: 45_000 });

      // Allow framer-motion entrance animations to settle
      await new Promise(r => setTimeout(r, 1500));

      // ── Serialize styled-components CSS into the DOM ──────────────────────
      // In production, styled-components v6 runs in "speedy" mode and injects
      // rules via CSSStyleSheet.insertRule() straight into the CSSOM. Those
      // rules live in sheet.cssRules and are NOT reflected in the <style>
      // element's text node, so page.content() would emit an EMPTY
      // <style data-styled> tag — shipping prerendered markup with no component
      // CSS (the FOUC / flash of unstyled content on first paint).
      //
      // Read the rules back out of the CSSOM and write them into the tag's
      // textContent so the serialized HTML carries the real CSS and paints
      // fully styled before any JS executes.
      const inlinedRules = await page.evaluate(() => {
        let total = 0;
        document.querySelectorAll('style[data-styled]').forEach((tag) => {
          // Skip if the tag already has its CSS as text (dev/non-speedy path)
          if (tag.textContent && tag.textContent.trim().length > 0) return;
          const sheet = tag.sheet;
          if (!sheet) return;
          let css = '';
          try {
            for (const rule of sheet.cssRules) css += rule.cssText;
          } catch {
            // Cross-origin sheet — not ours, ignore
            return;
          }
          tag.textContent = css;
          total += css.length;
        });
        return total;
      });
      console.log(`[prerender]   inlined ${inlinedRules} chars of styled CSS`);

      // Get the fully rendered HTML
      const html = await page.content();
      await page.close();

      // Determine output file path
      const relRoute = route === '/' ? '' : route.replace(/^\//, '');
      const outDir   = join(BUILD_DIR, relRoute);
      const outFile  = join(outDir, 'index.html');

      mkdirSync(outDir, { recursive: true });
      writeFileSync(outFile, html, 'utf8');

      const display = `build/${relRoute ? relRoute + '/' : ''}index.html`;
      console.log(`[prerender] ✓ ${route.padEnd(12)} → ${display}`);
    }

    console.log('\n[prerender] ✅ Pre-render complete. All routes saved.\n');

  } finally {
    if (browser) await browser.close();
    if (server)  server.close();
  }
}

main().catch((err) => {
  console.error('\n[prerender] ❌ Fatal:', err.message ?? err);
  process.exit(1);
});
