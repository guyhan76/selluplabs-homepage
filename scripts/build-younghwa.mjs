import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Independent Cloudflare Pages output; leaves the existing homepage build alone.
const root = fileURLToPath(new URL('../', import.meta.url));
const source = path.join(root, 'public/younghwa');
const output = path.join(root, 'dist-younghwa');
const configuredUrl = process.env.YOUNGHWA_SITE_URL;
if (!configuredUrl) {
  throw new Error('Set YOUNGHWA_SITE_URL to the production origin, e.g. https://younghwa-package.pages.dev');
}
const site = new URL(configuredUrl);
if (site.protocol !== 'https:' || site.pathname !== '/' || site.search || site.hash || site.username || site.password || site.port) {
  throw new Error('YOUNGHWA_SITE_URL must be an HTTPS origin without a path, query, port or credentials.');
}
const base = `${site.origin}/`;
const previousBase = 'https://selluplabs-homepage.selluplabs.workers.dev/younghwa/';
// Validate inputs before replacing the generated directory.
const originalHtml = await readFile(path.join(source, 'index.html'), 'utf8');
if (!originalHtml.includes(previousBase)) throw new Error('Review the source canonical URL before building.');
const html = originalHtml.replaceAll(previousBase, base);
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(source, output, { recursive: true });
await writeFile(path.join(output, 'index.html'), html);
await writeFile(path.join(output, 'robots.txt'), `User-agent: *\nDisallow:\nSitemap: ${base}sitemap.xml\n`);
await writeFile(path.join(output, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${base}</loc></url></urlset>\n`);
// An actual 404 prevents Pages' implicit SPA fallback for missing assets/paths.
await writeFile(path.join(output, '404.html'), '<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>페이지를 찾을 수 없습니다 | 영화패키지</title><h1>페이지를 찾을 수 없습니다.</h1><p><a href="/">영화패키지 홈으로 이동</a></p></html>');
console.log(`Younghwa Pages build ready: ${output}\nProduction URL: ${base}`);
