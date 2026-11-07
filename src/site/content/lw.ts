// The data snapshot of the LifeWatch România network: research stations, LTSER platforms, LTER
// sites, ICOS stations and eLTER weather stations, collected from DEIMS-SDR, NASA POWER,
// iNaturalist, GBIF, ICOS Carbon Portal and the EEA Natura 2000 service.
// Refresh with: node scripts/import-lw-data.mjs <path to the static site>.
import raw from "./lw-data.json";

export type Cat = "statiune" | "ltser" | "lter" | "icos" | "icos-cat" | "meteo";

export interface LwImage {
  src: string;
  thumb?: string;
  alt: string;
  credit?: string;
}
export interface LwSpecies {
  name: string;
  common?: string | null;
  count: number;
  group?: string;
  taxon: number;
  status?: string | null;
  img?: string;
  credit?: string;
}
export interface LwClimate {
  t: number[];
  tmin?: number[];
  tmax?: number[];
  p: number[];
  rad?: number[];
  src?: string;
}
export interface LwN2k {
  code: string;
  name: string;
  type: "SCI" | "SPA" | string;
  ha: number;
}
export interface LwPoint {
  key: string;
  id: string;
  slug: string;
  cat: Cat;
  name: string;
  ro: string;
  short?: string;
  lat: number;
  lon: number;
  approx?: boolean;
  ours: boolean;
  founded?: number;
  unit?: string;
  setting?: string;
  role?: string;
  text?: string;
  link?: string;
  relatedIds?: string[];
  images?: LwImage[];
  power?: LwClimate;
  /** Analysis box: south, west, north, east. */
  aoi: [number, number, number, number];
  inat?: { obs: number; species: number; groups: { g: string; n: number }[]; top: LwSpecies[]; date?: string } | null;
  gbif?: { occ: number; date?: string } | null;
  n2k?: LwN2k[] | null;
  fullName?: string;
  deims?: string;
  abstract?: string | null;
  established?: number | null;
  status?: string | null;
  siteType?: string | null;
  networks?: { name: string; code: string | null }[];
  projects?: string[];
  managers?: string[];
  orgs?: string[];
  elev?: { min: number | null; max: number | null; avg: number | null } | null;
  area_ha?: number | null;
  biogeo?: string | null;
  biome?: string | null;
  ecosystems?: string[];
  eunis?: string[];
  hydrology?: string | null;
  geology?: string | null;
  soils?: string | null;
  vegetation?: string | null;
  observed?: string[];
  design?: { obs: string | null; exp: string | null } | null;
  access?: { allYear?: boolean; type?: string; power?: boolean } | null;
  infraNotes?: string | null;
  infraItems?: string[];
  clim?: { t: number[]; p: number[]; period?: string } | null;
}

const DATA = raw as unknown as { generated: string; points: LwPoint[] };

export const LW_GENERATED = DATA.generated;
export const LW_POINTS: LwPoint[] = DATA.points;
export const lwByKey = (key: string) => LW_POINTS.find((p) => p.key === key) ?? null;
export const lwById = (id: string) => LW_POINTS.find((p) => p.id === id) ?? null;
export const lwBySlug = (slug: string) => LW_POINTS.find((p) => p.slug === slug) ?? null;

/** "2026-11-07" as "7 noiembrie 2026". */
export const formatDay = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("ro-RO", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
export const SNAPSHOT_LABEL = `Instantaneu din ${formatDay(LW_GENERATED)}`;

export interface CatMeta {
  label: string;
  one: string;
  color: string;
  shape: "square" | "circle" | "triangle" | "diamond";
}
export const CAT_ORDER: Cat[] = ["statiune", "ltser", "lter", "icos", "icos-cat", "meteo"];
export const CAT: Record<Cat, CatMeta> = {
  statiune: { label: "Stațiuni de cercetare UB", one: "Stațiune de cercetare", color: "#0E2A3B", shape: "square" },
  ltser: { label: "Platforme LTSER", one: "Platformă LTSER", color: "#2F7D4F", shape: "circle" },
  lter: { label: "Situri LTER", one: "Sit LTER", color: "#C96F12", shape: "circle" },
  icos: { label: "Stații de flux ICOS (RCSES)", one: "Stație de flux ecosistemic ICOS", color: "#1F6E8C", shape: "triangle" },
  "icos-cat": { label: "Catalog ICOS Carbon Portal", one: "Stație din catalogul ICOS", color: "#5C9DB8", shape: "triangle" },
  meteo: { label: "Stații meteo eLTER", one: "Stație meteo eLTER", color: "#7B4F96", shape: "diamond" },
};

/** Public URL of a file in public/ (photos are stored as "img/deims/…"). */
export const asset = (path: string) => (/^https?:/.test(path) ? path : `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`);

/** Route key of the data sheet of a point. */
export const sheetKey = (p: LwPoint) => `situri/${p.slug}`;

/** Our station page for a research station point. */
export const STATION_SLUG: Record<string, string> = { "st-sinaia": "sinaia", "st-braila": "braila", "st-orsova": "orsova", "st-sfg": "sfantu-gheorghe" };
export const STATION_POINT: Record<string, string> = { sinaia: "s-sinaia", braila: "s-braila", orsova: "s-orsova", "sfantu-gheorghe": "s-sfg" };
/** Our platform pages and the DEIMS records behind them. */
export const PLATFORM_POINT: Record<string, string> = {
  "delta-dunarii": "s-cdf8ba96",
  "insulele-brailei": "s-d4854af8",
  neajlov: "s-a6af4965",
  "bucegi-piatra-craiului": "s-4050c5c8",
  "rodna-calimani": "s-9350a1d0",
  retezat: "s-41d84799",
};

export const siteCode = (p: LwPoint) => p.networks?.find((n) => n.code)?.code ?? null;
export const relatedOf = (p: LwPoint) => (p.relatedIds ?? []).map(lwById).filter((x): x is LwPoint => Boolean(x));

export const fmt = (n: number | null | undefined, digits = 0) =>
  n == null || Number.isNaN(n) ? "–" : Number(n).toLocaleString("ro-RO", { maximumFractionDigits: digits });

/** First photo of a point, or the photo of its most observed species. */
export function photoOf(p: LwPoint): LwImage | null {
  if (p.images?.length) return p.images[0];
  const t = p.inat?.top.find((x) => x.img);
  return t?.img ? { src: t.img, thumb: t.img, alt: t.common || t.name, credit: t.credit } : null;
}

const speciesImage = (t: LwSpecies): LwImage => ({ src: t.img!, thumb: t.img, alt: t.common ? `${t.common} (${t.name})` : t.name, credit: t.credit });

/** Gallery of a station: its photos, those of related sites (up to 8), then six species photos. */
export function stationGallery(p: LwPoint): LwImage[] {
  const imgs = [...(p.images ?? [])];
  for (const r of relatedOf(p)) for (const im of r.images ?? []) if (imgs.length < 8 && !imgs.some((x) => x.src === im.src)) imgs.push(im);
  for (const t of (p.inat?.top ?? []).filter((x) => x.img).slice(0, 6)) imgs.push(speciesImage(t));
  return imgs;
}

/** Gallery of a site sheet: its photos, filled up to eight with species photos. */
export function sheetGallery(p: LwPoint): LwImage[] {
  const imgs = [...(p.images ?? [])];
  for (const t of (p.inat?.top ?? []).filter((x) => x.img).slice(0, 8 - Math.min(imgs.length, 4))) imgs.push(speciesImage(t));
  return imgs;
}

export const meanOf = (xs: number[]) => xs.reduce((s, v) => s + v, 0) / xs.length;

/** Query string of the analysis box for iNaturalist. */
export const bboxQuery = (p: LwPoint) => `nelat=${p.aoi[2]}&nelng=${p.aoi[3]}&swlat=${p.aoi[0]}&swlng=${p.aoi[1]}`;
export const inatUrl = (p: LwPoint) => `https://www.inaturalist.org/observations?${bboxQuery(p)}&verifiable=true`;
export function gbifUrl(p: LwPoint) {
  const [s, w, n, e] = p.aoi;
  const poly = `POLYGON((${[[w, s], [e, s], [e, n], [w, n], [w, s]].map((c) => `${c[0]} ${c[1]}`).join(",")}))`;
  return `https://www.gbif.org/occurrence/search?geometry=${encodeURIComponent(poly)}`;
}
