// Writes one static HTML file per site page, plus 404.html and sitemap.xml.
// Runs after `vite build` (client) and `vite build --ssr src/site/entry-server.tsx --outDir dist-ssr`.
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const ssrDir = join(root, "dist-ssr");
const { render, routeKeys, prepare, missingEnglish } = await import(pathToFileURL(join(ssrDir, "entry-server.js")).href);
await prepare();

const template = await readFile(join(dist, "index.html"), "utf8");
// data-key tells the browser which page the markup belongs to, so it only hydrates matching markup.
const fill = (key, { head, html, lang }) =>
  template
    .replace('<html lang="ro">', `<html lang="${lang}">`)
    .replace(/<title>[^<]*<\/title><!--ssr-head-->/, head)
    .replace('<div id="site"><!--ssr-html--></div>', `<div id="site" data-key="${key}">${html}</div>`);

const keys = routeKeys();
for (const key of keys) {
  const page = render(key);
  const file = join(dist, key, "index.html");
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, fill(key, page));
}
await writeFile(join(dist, "404.html"), fill("__404__", render("__404__")));

const origin = (process.env.SITE_ORIGIN || "").replace(/\/+$/, "");
const base = process.env.BASE_PATH || "/";
if (origin) {
  const urls = keys.map((k) => `  <url><loc>${origin}${base}${k ? `${k}/` : ""}</loc></url>`).join("\n");
  await writeFile(join(dist, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
}
await rm(ssrDir, { recursive: true, force: true });
// Untranslated Romanian text on English pages: listed with I18N_MISSING=<file>, counted otherwise.
const missing = missingEnglish();
if (process.env.I18N_MISSING) await writeFile(process.env.I18N_MISSING, JSON.stringify(missing, null, 1));
if (missing.length) console.log(`${missing.length} Romanian strings have no English version yet`);
console.log(`prerendered ${keys.length} pages${origin ? " and sitemap.xml" : ""}`);
