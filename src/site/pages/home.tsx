// Home: identity, research stations, the explorer, LTSER platforms, data access and networks.
// Laid out to keep scrolling short: every section is one compact row.
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { NETWORKS, RS_INDICATORS, SOCIAL_INDICATORS } from "@/lib/catalog";
import { BREWER, rampPalette } from "@/lib/palettes";
import { ORG, INFRASTRUCTURES } from "../content/org";
import { STATIONS, type Station } from "../content/stations";
import { PLATFORMS } from "../content/platforms";
import { PROJECTS } from "../content/projects";
import { EXPLORER_MODULES } from "../nav";
import { explorerHref, Link } from "../router";
import { Atlas, ATLAS_H, ATLAS_W, AtlasLegend } from "../components/atlas";
import { ArrowLink, CodeBlock, CreditedPhoto, ServiceStatus } from "../components/blocks";
import { Container, Eyebrow, Figures, Reveal, SectionHeader, SPRING } from "../components/primitives";

function Hero() {
  return (
    <Container className="pt-6 pb-5 sm:pt-8">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
        <div className="grid content-start gap-4 lg:col-span-6 2xl:col-span-7">
          <p className="text-[13px] font-medium text-accent">Infrastructură națională de cercetare e-Science</p>
          <h1 className="grid gap-1.5">
            <span className="text-[44px] leading-[0.95] font-semibold tracking-[-0.045em] sm:text-[64px] xl:text-[76px] 2xl:text-[88px]">
              <span className="text-accent">LifeWatch</span> România
            </span>
            <span className="text-[22px] leading-[1.1] font-medium tracking-[-0.02em] text-muted sm:text-[30px] xl:text-[34px] 2xl:text-[38px]">Universitatea din București</span>
          </h1>
          <p className="max-w-[64ch] text-[16px] leading-[1.6] text-pretty text-muted">
            Infrastructură de cercetare pentru biodiversitate și ecosisteme. Cuprinde patru stații de cercetare, șase platforme LTSER documentate în explorator și centrul de date de la Sinaia. Contribuie la LifeWatch ERIC, eLTER, ICOS și DANUBIUS-RI.
          </p>
          <div className="flex flex-wrap gap-2.5">
            <Button asChild variant="primary" size="lg" className="h-10 px-5 text-[14px]">
              <a href={explorerHref()}>
                Exploratorul LTSER
                <ArrowUpRight className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.75} />
              </a>
            </Button>
            <Button asChild size="lg" className="h-10 px-5 text-[14px]">
              <Link to="infrastructura">
                Stații de cercetare
                <ArrowRight className="transition-transform group-hover:translate-x-0.5" strokeWidth={1.75} />
              </Link>
            </Button>
          </div>
          <dl className="grid max-w-[640px] gap-px overflow-hidden rounded-xl border border-border bg-border text-[14px]">
            {[
              ["Instituție gazdă", ORG.host],
              ["Domeniu", "Biodiversitate, ecosisteme, cercetare socio-ecologică"],
              ["Infrastructuri europene", "LifeWatch ERIC, eLTER, ICOS, DANUBIUS-RI"],
            ].map(([k, v]) => (
              <div key={k} className="grid grid-cols-[112px_minmax(0,1fr)] gap-3 bg-surface px-3.5 py-2 sm:grid-cols-[160px_minmax(0,1fr)]">
                <dt className="text-subtle">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="lg:col-span-6 2xl:col-span-5">
          <div className="rounded-[18px] border border-border bg-surface p-1.5 shadow-card">
            <div className="relative overflow-hidden rounded-xl border border-border bg-surface-2/60" style={{ aspectRatio: `${ATLAS_W} / ${ATLAS_H}` }}>
              <div aria-hidden className="dot-grid absolute inset-0 opacity-70" />
              <Atlas className="absolute inset-0" />
              <ServiceStatus className="absolute top-2.5 right-2.5 max-w-[calc(100%-20px)]" />
            </div>
            <div className="px-2.5 pt-2 pb-1">
              <AtlasLegend />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

function StationCard({ station }: { station: Station }) {
  return (
    <Link to={`infrastructura/${station.slug}`} className="group grid grid-cols-[96px_minmax(0,1fr)] gap-3 overflow-hidden rounded-2xl border border-border bg-surface p-1.5 shadow-card transition-colors hover:border-border-strong sm:flex sm:flex-col sm:gap-0">
      <CreditedPhoto photo={station.photo} alt={`${station.photo.location}, imagine pentru ${station.name}`} sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100px" credit="label" className="aspect-square rounded-[10px] sm:aspect-[16/9] [&>span:last-child]:hidden sm:[&>span:last-child]:block" />
      <div className="grid content-center gap-0.5 py-1 pr-2 sm:gap-1 sm:px-2.5 sm:pt-2.5 sm:pb-1.5">
        <p className="tabular text-[12px] text-subtle">din {station.founded} · județul {station.county}</p>
        <h3 className="flex items-center gap-1.5 text-[15px] font-semibold tracking-tight sm:text-[16px]">
          {station.name}
          <ArrowRight className="size-3.5 shrink-0 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-accent" strokeWidth={1.75} />
        </h3>
        <p className="line-clamp-2 text-[13px] leading-relaxed text-muted sm:line-clamp-3 sm:text-[13.5px]">{station.summary}</p>
      </div>
    </Link>
  );
}

function Stations() {
  return (
    <Container className="grid gap-4 py-6">
      <SectionHeader
        index="01"
        eyebrow="Infrastructură"
        title="Stații de cercetare"
        lede="Patru stații de teren ale Universității din București: Sinaia (1922), Brăila (1955), Orșova (1964) și Sfântu Gheorghe (2002)."
        aside={<ArrowLink to="infrastructura">Toate stațiile</ArrowLink>}
      />
      <Reveal className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {STATIONS.map((s) => (
          <StationCard key={s.slug} station={s} />
        ))}
      </Reveal>
    </Container>
  );
}

function ModulePreview({ id }: { id: string }) {
  if (id === "rs") {
    // Same colour ramps as the explorer's map legends (src/lib/palettes.ts).
    const ramps: Record<string, readonly string[]> = { ssm: rampPalette(BREWER.RdYlBu10, 11), ndvi: BREWER.RdYlGn11.slice(1), fapar: BREWER.RdYlGn11.slice(1) };
    return (
      <div className="grid gap-3">
        {RS_INDICATORS.map((r) => (
          <div key={r.id} className="grid gap-1.5">
            <div className="flex items-baseline justify-between text-[12px]">
              <span className="font-medium text-white">{r.short}</span>
              <span className="text-white/65">{r.ro}</span>
            </div>
            <div className="h-2 rounded-full" style={{ background: `linear-gradient(90deg, ${ramps[r.id].join(", ")})` }} />
          </div>
        ))}
        <p className="pt-1 text-[12px] text-white/65">Hărți lunare, serii pe punct și export GeoTIFF.</p>
      </div>
    );
  }
  if (id === "net") {
    const counts: Record<string, number> = { ws: 20, ec: 5, cu: 10, ra: 5, co: 5, bu: 1 };
    const max = 20;
    return (
      <ul className="grid gap-2">
        {NETWORKS.map((n) => (
          <li key={n.id} className="grid grid-cols-[minmax(0,1fr)_120px_28px] items-center gap-3 text-[12px]">
            <span className="truncate text-white/80">{n.ro}</span>
            <span className="h-1.5 overflow-hidden rounded-full bg-white/10">
              <motion.span className="block h-full rounded-full" style={{ background: n.color }} initial={{ width: 0 }} animate={{ width: `${(counts[n.id] / max) * 100}%` }} transition={SPRING} />
            </span>
            <span className="tabular text-right text-white">{counts[n.id]}</span>
          </li>
        ))}
      </ul>
    );
  }
  if (id === "platform") {
    return (
      <div className="grid gap-2 font-mono text-[12px] leading-relaxed">
        <p className="text-white/65">GET /stations/1/measurements</p>
        <p className="text-white/80">
          ?variables=<span className="text-brand-sand">air_temperature</span>
        </p>
        <p className="text-white/80">
          &amp;since=<span className="text-brand-sand">2026-10-01T00:00:00Z</span>
        </p>
        <p className="text-white/80">
          &amp;until=<span className="text-brand-sand">2026-10-02T00:00:00Z</span>
        </p>
        <p className="pt-1 font-sans text-white/65">25 de stații, ferestre de cel mult 7 zile, până la 50.000 de rânduri.</p>
      </div>
    );
  }
  const years = SOCIAL_INDICATORS.flatMap((s) => s.years);
  const lo = Math.min(...years);
  const hi = Math.max(...years);
  return (
    <div className="grid gap-3">
      {SOCIAL_INDICATORS.map((s) => {
        const a = Math.min(...s.years);
        const b = Math.max(...s.years);
        return (
          <div key={s.id} className="grid gap-1.5">
            <div className="flex justify-between text-[12px]">
              <span className="text-white">{s.ro}</span>
              <span className="tabular text-white/65">{a}–{b}</span>
            </div>
            <div className="relative h-1.5 rounded-full bg-white/10">
              <span className="absolute inset-y-0 rounded-full bg-brand-green" style={{ left: `${((a - lo) / (hi - lo)) * 100}%`, right: `${((hi - b) / (hi - lo)) * 100}%` }} />
            </div>
          </div>
        );
      })}
      <p className="pt-1 text-[12px] text-white/65">208 unități administrative din cele șase zone LTSER.</p>
    </div>
  );
}

function Explorer() {
  const [active, setActive] = useState(EXPLORER_MODULES[0].id);
  const current = EXPLORER_MODULES.find((m) => m.id === active)!;
  return (
    <Container className="py-6">
      <Reveal>
        <div className="overflow-hidden rounded-[22px] border border-transparent bg-panel text-panel-foreground dark:border-border">
          <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-12 lg:gap-10">
            <div className="grid content-start gap-3.5 lg:col-span-5">
              <div className="flex items-baseline gap-3">
                <span className="tabular text-[12px] text-white/50">02</span>
                <Eyebrow className="text-brand-sand">Date</Eyebrow>
              </div>
              <h2 className="text-[24px] leading-tight font-semibold tracking-[-0.02em] sm:text-[28px]">Exploratorul LTSER</h2>
              <p className="text-[14px] leading-relaxed text-white/65">
                Aplicație web pentru consultarea datelor: teledetecție, rețele de stații, măsurători brute și indicatori sociali pentru cele șase platforme LTSER. Datele provin din serviciile API ale infrastructurii.
              </p>
              <div className="flex flex-wrap gap-2.5">
                <Button asChild size="lg" className="h-10 border-transparent bg-white px-5 text-[14px] text-[#1d3567] hover:border-transparent hover:bg-white/90">
                  <a href={explorerHref(current.path)}>
                    Deschide {current.title.toLowerCase()}
                    <ArrowUpRight strokeWidth={1.75} />
                  </a>
                </Button>
                <Link to="date" className="inline-flex h-10 items-center gap-1.5 rounded-lg px-4 text-[14px] font-medium text-white/80 transition-colors hover:bg-white/5 hover:text-white">
                  Catalogul de date
                  <ArrowRight className="size-3.5" strokeWidth={1.75} />
                </Link>
              </div>
            </div>

            <div className="grid content-start gap-3 lg:col-span-7">
              <div role="tablist" aria-label="Module" className="grid grid-cols-2 gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1 sm:grid-cols-4">
                {EXPLORER_MODULES.map((m) => {
                  const on = m.id === active;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      role="tab"
                      aria-selected={on}
                      onClick={() => setActive(m.id)}
                      className={cn("relative flex h-9 items-center justify-center gap-1.5 rounded-lg text-[13px] transition-colors", on ? "text-white" : "text-white/65 hover:text-white")}
                    >
                      {on ? <motion.span layoutId="home-module" transition={SPRING} className="absolute inset-0 rounded-lg bg-white/10 ring-1 ring-white/10" /> : null}
                      <m.icon className="relative size-3.5" strokeWidth={1.75} />
                      <span className="relative">{m.title}</span>
                    </button>
                  );
                })}
              </div>
              <div role="tabpanel" className="relative min-h-[212px] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div key={active} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={SPRING} className="grid gap-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="grid gap-1">
                        <p className="text-[15px] font-medium">{current.title}</p>
                        <p className="max-w-[52ch] text-[13px] leading-relaxed text-white/65">{current.body}</p>
                      </div>
                      <a href={explorerHref(current.path)} aria-label={`Deschide ${current.title}`} className="grid size-8 shrink-0 place-items-center rounded-lg border border-white/10 text-white/80 transition-colors hover:bg-white/10 hover:text-white">
                        <ArrowUpRight className="size-3.5" strokeWidth={1.75} />
                      </a>
                    </div>
                    <ModulePreview id={active} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </Container>
  );
}

function Platforms() {
  return (
    <Container className="grid gap-4 py-6">
      <SectionHeader
        index="03"
        eyebrow="Platforme LTSER"
        title="Platforme LTSER"
        lede="Platforme de cercetare socio-ecologică pe termen lung documentate în explorator."
        aside={<ArrowLink to="platforme">Despre platforme</ArrowLink>}
      />
      <Reveal className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {PLATFORMS.map((p) => (
          <Link key={p.slug} to={`platforme/${p.slug}`} className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-surface shadow-card xl:aspect-[4/5]">
            <CreditedPhoto photo={p.photo} alt={`${p.name}, ${p.photo.location}`} sizes="(min-width: 1280px) 17vw, (min-width: 768px) 33vw, 50vw" credit="none" className="absolute inset-0" />
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950/85 via-zinc-950/15 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 grid gap-0.5 p-3 text-white">
              <p className="text-[11px] text-white/70">{p.kind}</p>
              <h3 className="flex items-center gap-1 text-[14px] leading-snug font-semibold tracking-tight">
                {p.name}
                <ArrowRight className="size-3 shrink-0 opacity-0 transition-[opacity,transform] group-hover:translate-x-0.5 group-hover:opacity-100" strokeWidth={1.75} />
              </h3>
              <p className="tabular text-[11px] text-white/75">{p.figures[0].value} · {p.figures[0].label}</p>
            </div>
          </Link>
        ))}
      </Reveal>
    </Container>
  );
}

function DataAndNetwork() {
  // Backslash-newline inside double quotes is a line continuation, so the command runs as shown.
  const example = `curl "https://<domeniu>/lifewatch-api\\
/stations/1/measurements\\
?variables=air_temperature\\
&since=2026-10-01T00:00:00Z\\
&until=2026-10-02T00:00:00Z"`;
  const links = [
    ["date/api", "Referința API", "Rute, parametri și exemple"],
    ["date/documentatie", "Documentație", "Fus orar, pas de timp, limite, formate"],
    ["date", "Catalog de date", "Seturile de date, pe teme"],
  ];
  return (
    <Container className="grid gap-8 py-6 lg:grid-cols-2 lg:gap-10">
      <section className="grid content-start gap-4">
        <SectionHeader index="04" eyebrow="Date" title="Acces la date" lede="Măsurătorile brute ale celor 25 de stații, prin API-ul LifeWatch: cereri HTTP GET, răspunsuri JSON." />
        <Reveal className="grid gap-4 xl:grid-cols-2">
          <ul className="grid content-start border-t border-border">
            {links.map(([to, title, body]) => (
              <li key={to} className="border-b border-border">
                <Link to={to} className="group flex items-center justify-between gap-4 py-2.5">
                  <span className="grid">
                    <span className="text-[14px] font-medium">{title}</span>
                    <span className="text-[13px] text-muted">{body}</span>
                  </span>
                  <ArrowRight className="size-4 shrink-0 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-accent" strokeWidth={1.75} />
                </Link>
              </li>
            ))}
          </ul>
          <CodeBlock code={example} label="Temperatura aerului, 24 de ore" />
        </Reveal>
      </section>
      <section className="grid content-start gap-4">
        <SectionHeader index="05" eyebrow="Rețea" title="Infrastructuri europene de cercetare" aside={<ArrowLink to="retea">Rețea și comunitate</ArrowLink>} />
        <Reveal className="grid gap-4">
          <ul className="grid border-t border-border">
            {INFRASTRUCTURES.map((i) => (
              <li key={i.id} className="border-b border-border">
                <a href={i.url} target="_blank" rel="noreferrer" className="group grid grid-cols-[120px_minmax(0,1fr)_auto] items-baseline gap-4 py-2.5 sm:grid-cols-[150px_minmax(0,1fr)_auto]">
                  <span className="text-[14px] font-semibold tracking-tight">{i.name}</span>
                  <span className="text-[13.5px] leading-relaxed text-muted">{i.role}</span>
                  <ArrowUpRight className="size-3.5 self-center text-subtle transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" strokeWidth={1.75} />
                </a>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[13px]">
            <span className="mr-1 text-subtle">Proiecte europene</span>
            {PROJECTS.map((p) => (
              <a key={p.acronym} href={p.url} target="_blank" rel="noreferrer" className="tabular rounded-md border border-border px-2 py-0.5 text-muted transition-colors hover:border-border-strong hover:text-foreground">
                {p.acronym}
              </a>
            ))}
            <ArrowLink to="proiecte" className="ml-1 text-[13px]">Toate</ArrowLink>
          </div>
        </Reveal>
      </section>
    </Container>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <Container>
        <Figures
          items={[
            { value: "1922", label: "înființarea stațiunii Sinaia" },
            { value: "4", label: "stații de cercetare" },
            { value: "6", label: "platforme LTSER în explorator" },
            { value: "46", label: "amplasamente în șase rețele" },
          ]}
        />
      </Container>
      <Stations />
      <Explorer />
      <Platforms />
      <DataAndNetwork />
    </>
  );
}
