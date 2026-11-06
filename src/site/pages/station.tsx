// One research station: text on the left, a sticky sidebar with photo, facts, links and contents.
import type { ReactNode } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { STATIONS, type Station } from "../content/stations";
import { PLATFORMS } from "../content/platforms";
import { explorerHref, Link } from "../router";
import { CopyValue, CreditedPhoto } from "../components/blocks";
import { BulletList, Container, Crumbs, Eyebrow, ExternalLink } from "../components/primitives";
import { ModuleList } from "../components/modules";
import { Toc } from "../components/toc";

const osm = ([lon, lat]: [number, number]) => `https://www.openstreetmap.org/?mlat=${lat.toFixed(4)}&mlon=${lon.toFixed(4)}#map=13/${lat.toFixed(4)}/${lon.toFixed(4)}`;

function Sidebar({ station, toc }: { station: Station; toc: { id: string; title: string }[] }) {
  const rows: { label: string; value: ReactNode }[] = [
    { label: "Coordonare", value: station.operator },
    ...station.facts.map((f) => ({ label: f.label, value: f.value })),
    { label: "Adresă", value: <CopyValue value={station.address} label="Adresa" /> },
    { label: "Telefon", value: <a href={station.phoneHref} className="tabular hover:text-accent">{station.phone}</a> },
  ];
  if (station.website) rows.push({ label: "Site web", value: <ExternalLink href={station.website}>{station.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}</ExternalLink> });
  return (
    <div className="grid gap-5 lg:sticky lg:top-24">
      <div className="rounded-[18px] border border-border bg-surface p-1.5 shadow-card">
        <CreditedPhoto photo={station.photo} alt={`${station.photo.location}, imagine pentru ${station.name}`} sizes="(min-width: 1024px) 30vw, 100vw" priority className="aspect-[16/9] rounded-xl" />
        <dl className="grid px-3 pt-1">
          {rows.map((r) => (
            <div key={r.label} className="grid grid-cols-[96px_minmax(0,1fr)] gap-3 border-b border-border py-2 last:border-b-0">
              <dt className="text-[13px] text-subtle">{r.label}</dt>
              <dd className="text-[13.5px] leading-snug text-foreground">{r.value}</dd>
            </div>
          ))}
        </dl>
        <div className="flex flex-wrap gap-2 px-3 pt-1 pb-2.5">
          <Button asChild size="md">
            <a href={osm(station.lonLat)} target="_blank" rel="noreferrer">
              <MapPin strokeWidth={1.75} />
              Hartă
            </a>
          </Button>
          {station.explorer[0] ? (
            <Button asChild variant="primary" size="md">
              <a href={explorerHref(station.explorer[0].path, station.explorer[0].query)}>
                Date în explorator
                <ArrowUpRight strokeWidth={1.75} />
              </a>
            </Button>
          ) : null}
        </div>
      </div>
      <div className="hidden lg:block">
        <Toc items={toc} layoutId={`toc-${station.slug}`} />
      </div>
    </div>
  );
}

export function StationPage({ station }: { station: Station }) {
  const index = STATIONS.findIndex((s) => s.slug === station.slug);
  const prev = STATIONS[(index - 1 + STATIONS.length) % STATIONS.length];
  const next = STATIONS[(index + 1) % STATIONS.length];
  const platforms = PLATFORMS.filter((p) => station.platforms.includes(p.slug));
  const toc = [...station.sections.map((s) => ({ id: s.id, title: s.title })), { id: "date", title: "Date în explorator" }];

  return (
    <Container className="pt-6 sm:pt-8">
      <Crumbs items={[{ label: "Infrastructură", node: <Link to="infrastructura" className="hover:text-foreground">Infrastructură</Link> }, { label: station.short }]} />
      <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
        <div className="grid min-w-0 content-start gap-6 lg:col-span-8">
          <header className="grid gap-2.5">
            <Eyebrow>Stație de cercetare · din {station.founded}</Eyebrow>
            <h1 className="text-[32px] leading-[1.05] font-semibold tracking-[-0.03em] text-balance sm:text-[42px]">{station.name}</h1>
            <p className="text-[13px] text-subtle">{station.setting} · județul {station.county}</p>
            <p className="max-w-[75ch] text-[16px] leading-[1.6] text-pretty text-muted">{station.summary}</p>
            <ul className="flex flex-wrap gap-1.5 pt-1">
              {station.focus.map((f) => (
                <li key={f} className="rounded-md border border-border bg-surface px-2 py-0.5 text-[12.5px] text-muted">{f}</li>
              ))}
            </ul>
          </header>

          {station.sections.map((section) => (
            <section key={section.id} aria-labelledby={section.id} className="grid gap-3">
              <h2 id={section.id} className="scroll-mt-24 text-[20px] leading-tight font-semibold tracking-[-0.015em] sm:text-[22px]">{section.title}</h2>
              {section.lede ? <p className="max-w-[80ch] text-[15px] leading-[1.7] text-pretty text-muted">{section.lede}</p> : null}
              {section.items ? <BulletList items={section.items} columns={section.items.length > 3 ? 2 : 1} /> : null}
              {section.modules ? <ModuleList modules={section.modules} /> : null}
            </section>
          ))}

          <section aria-labelledby="date" className="grid gap-3">
            <h2 id="date" className="scroll-mt-24 text-[20px] leading-tight font-semibold tracking-[-0.015em] sm:text-[22px]">Date în explorator</h2>
            <ul className="grid border-t border-border sm:grid-cols-2 sm:gap-x-8">
              {station.explorer.map((e) => (
                <li key={e.label} className="border-b border-border">
                  <a href={explorerHref(e.path, e.query)} className="group flex items-center justify-between gap-4 py-2.5 text-[14.5px]">
                    {e.label}
                    <ArrowUpRight className="size-4 shrink-0 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" strokeWidth={1.75} />
                  </a>
                </li>
              ))}
              {platforms.map((p) => (
                <li key={p.slug} className="border-b border-border">
                  <Link to={`platforme/${p.slug}`} className="group flex items-center justify-between gap-4 py-2.5 text-[14.5px]">
                    Platforma LTSER {p.name}
                    <ArrowRight className="size-4 shrink-0 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-accent" strokeWidth={1.75} />
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <nav aria-label="Alte stații" className="grid gap-2 border-t border-border pt-4 sm:grid-cols-2">
            <Link to={`infrastructura/${prev.slug}`} className="group grid gap-0.5 rounded-xl p-3 transition-colors hover:bg-surface-2/60">
              <span className="inline-flex items-center gap-1.5 text-[12px] text-subtle">
                <ArrowLeft className="size-3 transition-transform group-hover:-translate-x-0.5" strokeWidth={1.75} />
                Stația anterioară
              </span>
              <span className="text-[15px] font-semibold tracking-tight">{prev.name}</span>
            </Link>
            <Link to={`infrastructura/${next.slug}`} className="group grid gap-0.5 rounded-xl p-3 text-right transition-colors hover:bg-surface-2/60">
              <span className="inline-flex items-center justify-end gap-1.5 text-[12px] text-subtle">
                Stația următoare
                <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" strokeWidth={1.75} />
              </span>
              <span className="text-[15px] font-semibold tracking-tight">{next.name}</span>
            </Link>
          </nav>
        </div>
        <aside className="lg:col-span-4 lg:row-start-1 lg:col-start-9">
          <Sidebar station={station} toc={toc} />
        </aside>
      </div>
    </Container>
  );
}
