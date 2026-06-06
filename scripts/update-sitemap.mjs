/**
 * scripts/update-sitemap.mjs
 *
 * Stamps every <lastmod> in public/sitemap.xml with today's ISO date.
 * Runs automatically as part of `npm run build` via the prebuild hook.
 *
 * Usage:
 *   node scripts/update-sitemap.mjs          (manual)
 *   npm run build                             (automatic via prebuild)
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sitemapPath = resolve(__dirname, '../public/sitemap.xml');

const today = new Date().toISOString().split('T')[0];

let xml = readFileSync(sitemapPath, 'utf8');
xml = xml.replace(/<lastmod>[^<]+<\/lastmod>/g, `<lastmod>${today}</lastmod>`);
writeFileSync(sitemapPath, xml, 'utf8');

console.log(`[sitemap] Updated all <lastmod> to ${today}`);
