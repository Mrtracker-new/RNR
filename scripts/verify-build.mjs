/**
 * scripts/verify-build.mjs
 *
 * Asserts the artefacts produced by `vite build` + `generate-sitemap` +
 * `prerender` are actually correct, so a regression fails the build instead of
 * shipping. Checks the head of every prerendered route (one of each meta tag,
 * no leftover duplicates), the 404 document's robots/canonical contract, the
 * sitemap contents, and the social card asset.
 *
 * Run: node scripts/verify-build.mjs   (wired into postbuild)
 */

import { readFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BUILD_DIR = resolve(__dirname, '../build');
const SITE = 'https://rolan-rnr.netlify.app';

/* Case-study slugs mirror src/data/projects.ts and prerender.mjs. */
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

/** route → [output file, expected canonical path] */
const PAGES = [
  ['/', 'index.html', '/'],
  ['/about', 'about/index.html', '/about'],
  ['/projects', 'projects/index.html', '/projects'],
  ['/blog', 'blog/index.html', '/blog'],
  ['/contact', 'contact/index.html', '/contact'],
  ...PROJECT_SLUGS.map((slug) => [
    `/projects/${slug}`,
    `projects/${slug}/index.html`,
    `/projects/${slug}`,
  ]),
];

const failures = [];
const fail = (message) => failures.push(message);

const count = (haystack, pattern) => (haystack.match(pattern) ?? []).length;
const attr = (html, pattern) => (html.match(pattern) ?? [])[1];

function read(relative) {
  const file = join(BUILD_DIR, relative);
  if (!existsSync(file)) {
    fail(`missing build output: build/${relative}`);
    return '';
  }
  return readFileSync(file, 'utf8');
}

/* ── Crawlable pages ─────────────────────────────────────────────────────── */

for (const [route, file, canonicalPath] of PAGES) {
  const html = read(file);
  if (!html) continue;

  const where = `build/${file} (${route})`;

  const titles = count(html, /<title[^>]*>/g);
  if (titles !== 1) fail(`${where}: expected exactly 1 <title>, found ${titles}`);
  const title = attr(html, /<title[^>]*>([^<]*)<\/title>/);
  if (!title || !title.trim()) fail(`${where}: empty <title>`);

  const h1s = count(html, /<h1[\s>]/g);
  if (h1s !== 1) fail(`${where}: expected exactly 1 <h1>, found ${h1s}`);

  for (const [label, pattern] of [
    ['<meta name="description">', /<meta[^>]*\sname="description"/g],
    ['<meta name="robots">', /<meta[^>]*\sname="robots"/g],
    ['<link rel="canonical">', /<link[^>]*\srel="canonical"/g],
    ['og:title', /property="og:title"/g],
    ['og:image', /property="og:image"/g],
    ['og:url', /property="og:url"/g],
    ['twitter:card', /name="twitter:card"/g],
    ['<meta name="viewport">', /<meta[^>]*\sname="viewport"/g],
  ]) {
    const seen = count(html, pattern);
    if (seen !== 1) fail(`${where}: expected exactly 1 ${label}, found ${seen}`);
  }

  const canonical = attr(html, /<link[^>]*\srel="canonical"[^>]*\shref="([^"]+)"/);
  if (canonical !== `${SITE}${canonicalPath}`) {
    fail(`${where}: canonical is "${canonical}", expected "${SITE}${canonicalPath}"`);
  }

  const robots = attr(html, /<meta[^>]*\sname="robots"[^>]*\scontent="([^"]+)"/);
  if (!robots?.includes('index')) fail(`${where}: robots is "${robots}", expected an indexable directive`);
  if (robots?.includes('noindex')) fail(`${where}: robots must not contain noindex`);

  if (!/<div id="root">\s*<[a-z]/i.test(html)) fail(`${where}: #root is empty — React render was not captured`);
}

/* ── 404 document ────────────────────────────────────────────────────────── */

const notFound = read('404.html');
if (notFound) {
  const h1s = count(notFound, /<h1[\s>]/g);
  if (h1s !== 1) fail(`build/404.html: expected exactly 1 <h1>, found ${h1s}`);

  if (count(notFound, /<link[^>]*\srel="canonical"/g) !== 0) {
    fail('build/404.html: must not emit a canonical URL');
  }

  const robots = attr(notFound, /<meta[^>]*\sname="robots"[^>]*\scontent="([^"]+)"/);
  if (!robots?.includes('noindex')) fail(`build/404.html: robots is "${robots}", expected noindex`);

  if (count(notFound, /BreadcrumbList/g) !== 0) {
    fail('build/404.html: must not emit a BreadcrumbList');
  }
}

/* ── Sitemap ─────────────────────────────────────────────────────────────── */

const sitemap = read('sitemap.xml');
if (sitemap) {
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

  if (locs.length !== PAGES.length) {
    fail(`build/sitemap.xml: expected ${PAGES.length} URLs, found ${locs.length}`);
  }
  for (const [, , canonicalPath] of PAGES) {
    const expected = `${SITE}${canonicalPath}`;
    if (!locs.includes(expected)) fail(`build/sitemap.xml: missing ${expected}`);
  }
  if (locs.some((loc) => loc.includes('404'))) fail('build/sitemap.xml: must not list the 404 page');
  if (count(sitemap, /<lastmod>/g) !== locs.length) {
    fail('build/sitemap.xml: every <url> needs a <lastmod>');
  }
}

/* ── Social card ─────────────────────────────────────────────────────────── */

if (!existsSync(join(BUILD_DIR, 'Social_card.jpg'))) {
  fail('build/Social_card.jpg is missing — og:image would 404');
}

/* ── Report ──────────────────────────────────────────────────────────────── */

if (failures.length > 0) {
  console.error('\n[verify] ✗ Build output failed verification:\n');
  for (const failure of failures) console.error(`  - ${failure}`);
  console.error('');
  process.exit(1);
}

console.log(`[verify] ✓ ${PAGES.length + 1} documents, sitemap and social card verified`);
