/**
 * scripts/generate-sitemap.mjs
 *
 * Writes build/sitemap.xml as a build artifact. Each <lastmod> comes from the
 * last commit that touched that page's source file, so the dates describe real
 * changes instead of resetting to "today" on every deploy.
 *
 * If git history is unavailable (shallow clone, source archive) the lastmod
 * element is omitted rather than invented.
 */

import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const BUILD_DIR = join(ROOT, 'build');
const SITE_URL = 'https://rolan-rnr.netlify.app';

/* Case-study slugs mirror src/data/projects.ts; a unit test fails if they drift. */
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

const PAGES = [
  { path: '/',        file: 'src/pages/Home.tsx',     changefreq: 'weekly',  priority: '1.0' },
  { path: '/about',   file: 'src/pages/About.tsx',    changefreq: 'monthly', priority: '0.8' },
  { path: '/projects', file: 'src/pages/Projects.tsx', changefreq: 'weekly',  priority: '0.9' },
  { path: '/blog',    file: 'src/pages/Blog.tsx',     changefreq: 'weekly',  priority: '0.9' },
  { path: '/contact', file: 'src/pages/Contact.tsx',  changefreq: 'monthly', priority: '0.7' },
  ...PROJECT_SLUGS.map((slug, index) => ({
    path: `/projects/${slug}`,
    file: 'src/data/projects.ts',
    changefreq: 'monthly',
    // The first slug is the flagship project, so it outranks the rest.
    priority: index === 0 ? '0.8' : '0.6',
  })),
];

function lastModified(file) {
  try {
    const date = execFileSync('git', ['log', '-1', '--format=%cs', '--', file], {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : null;
  } catch {
    return null;
  }
}

const urls = PAGES.map(({ path, file, changefreq, priority }) => {
  const modified = lastModified(file);
  return [
    '  <url>',
    `    <loc>${SITE_URL}${path === '/' ? '/' : path}</loc>`,
    modified ? `    <lastmod>${modified}</lastmod>` : null,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ].filter(Boolean).join('\n');
}).join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

mkdirSync(BUILD_DIR, { recursive: true });
writeFileSync(join(BUILD_DIR, 'sitemap.xml'), xml, 'utf8');

console.log(`[sitemap] Wrote build/sitemap.xml (${PAGES.length} URLs)`);
