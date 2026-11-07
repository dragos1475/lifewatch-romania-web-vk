// Imports the data snapshot of the static LifeWatch site (lifewatch-romania-site/) into this project.
//   node scripts/import-lw-data.mjs [path-to-static-site]
// Writes src/site/content/lw-data.json (points without boundaries, bundled with the site),
// public/data/lw-boundaries.json and public/data/lw-basemap.json (fetched by the maps at runtime)
// and copies the DEIMS and iNaturalist photos to public/img/.
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const src = path.resolve(process.argv[2] ?? "lifewatch-romania-site");
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");

function load(file, name) {
  const ctx = { window: {} };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(src, file), "utf8"), ctx);
  return ctx.window[name];
}

const data = load("data/sites.js", "LW_DATA");
const base = load("data/basemap.js", "LW_BASE");

const slugify = (s) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const boundaries = {};
const seen = new Set();
const points = data.points.map((p) => {
  const { boundary, _marker, ...rest } = p;
  if (boundary) boundaries[p.key] = boundary;
  let slug = slugify(p.ro);
  while (seen.has(slug)) slug += "-2";
  seen.add(slug);
  return { ...rest, slug };
});

const out = { generated: data.generated, catNames: data.catNames, points };
fs.writeFileSync(path.join(root, "src/site/content/lw-data.json"), JSON.stringify(out));
fs.mkdirSync(path.join(root, "public/data"), { recursive: true });
fs.writeFileSync(path.join(root, "public/data/lw-boundaries.json"), JSON.stringify(boundaries));
fs.writeFileSync(path.join(root, "public/data/lw-basemap.json"), JSON.stringify(base));

for (const dir of ["deims", "inat"]) {
  const from = path.join(src, "img", dir);
  const to = path.join(root, "public/img", dir);
  fs.mkdirSync(to, { recursive: true });
  for (const f of fs.readdirSync(from)) fs.copyFileSync(path.join(from, f), path.join(to, f));
}
console.log(`${points.length} points, ${Object.keys(boundaries).length} boundaries, generated ${data.generated}`);
