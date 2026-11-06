// Home: identity, research stations, the explorer, LTSER platforms, data access and networks.
// Editorial layout pairs research imagery with clear paths into the data and infrastructure.
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
import { LivingTree } from "../components/living-tree";
import { Container, Eyebrow, Figures, Reveal, SectionHeader, SPRING } from "../components/primitives";

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse at 15% 0%, var(--accent-soft), transparent 48%)" }} />
      <Container className="relative grid gap-6 pt-7 pb-6 sm:gap-8 sm:pt-10 sm:pb-8 lg:grid-cols-12 lg:items-center lg:gap-10 xl:pt-12 xl:pb-10">
        <div className="grid content-start gap-4 lg:col-span-6 xl:gap-5">
          <p className="flex w-fit items-center gap-2.5 text-[11px] font-semibold tracking-[0.13em] text-accent uppercase">
            <span aria-hidden className="size-1.5 rounded-full bg-brand-orange" />
            Infrastructură națională de cercetare
          </p>
          <div className="grid gap-3">
            <h1 className="max-w-[22ch] font-display text-[40px] leading-[1] font-medium tracking-[-0.045em] text-balance sm:text-[54px] xl:text-[58px] 2xl:text-[66px]">
              Observăm natura.
              <span className="mt-1 block italic text-accent">Înțelegem schimbarea.</span>
            </h1>
            <p className="max-w-[58ch] text-[15.5px] leading-[1.7] text-pretty text-muted sm:text-[16.5px]">
              LifeWatch România conectează cercetarea de teren, monitorizarea pe termen lung și analiza datelor pentru a înțelege biodiversitatea și ecosistemele.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild variant="primary" size="lg" className="h-11 px-5 text-[14px]">
              <a href={explorerHref()}>
                Explorează datele
                <ArrowUpRight className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.75} />
              </a>
            </Button>
            <Link to="infrastructura" className="group inline-flex h-11 items-center gap-2 rounded-lg px-4 text-[14px] font-medium text-foreground transition-colors hover:bg-accent-soft hover:text-accent">
              Descoperă infrastructura
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" strokeWidth={1.75} />
            </Link>
          </div>
          <div className="flex items-center gap-3 border-t border-border pt-3 text-[12px] text-subtle">
            <span aria-hidden className="h-px w-8 bg-brand-orange" />
            <span>O infrastructură a {ORG.host}</span>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="rounded-[20px] border border-border bg-surface p-1.5 shadow-card">
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 px-2 pt-0.5 pb-1.5">
              <p className="text-[12.5px] font-medium">Stații de cercetare și platforme LTSER</p>
              <ServiceStatus className="border-0 bg-transparent px-0 py-0 shadow-none backdrop-blur-none" />
            </div>
            <div className="grid gap-1.5 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
              <LivingTree className="h-[170px] sm:h-auto" />
              <div className="grid content-start gap-2">
                <div className="relative overflow-hidden rounded-[14px] border border-border bg-surface-2/60" style={{ aspectRatio: `${ATLAS_W} / ${ATLAS_H}` }}>
                  <div aria-hidden className="dot-grid absolute inset-0 opacity-70" />
                  <Atlas className="absolute inset-0" showNetworks={false} />
                </div>
                <div className="px-1.5 pb-1">
                  <AtlasLegend showNetworks={false} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function StationCard({ station }: { station: Station }) {
  return (
    <Link to={`infrastructura/${station.slug}`} className="group grid grid-cols-[104px_minmax(0,1fr)] gap-3 overflow-hidden rounded-[18px] border border-border bg-surface p-2 shadow-card transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-accent/35 hover:shadow-float sm:flex sm:flex-col sm:gap-0 sm:rounded-[22px]">
      <CreditedPhoto photo={station.photo} alt={`${station.photo.location}, imagine pentru ${station.name}`} sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 104px" credit="label" creditClassName="hidden sm:block" className="min-h-[104px] rounded-[10px] sm:aspect-[16/9] sm:min-h-0 sm:rounded-[14px]" />
      <div className="grid content-start gap-1 py-1 pr-1 sm:gap-1.5 sm:px-2.5 sm:pt-3 sm:pb-2.5">
        <p className="text-[10.5px] font-medium tracking-[0.08em] text-subtle uppercase sm:text-[11px]">Din {station.founded} · {station.county}</p>
        <h3 className="flex items-start gap-2 font-display text-[17px] leading-tight font-medium tracking-[-0.025em] sm:text-[20px]">
          {station.name}
          <ArrowRight className="mt-1 size-3.5 shrink-0 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-accent" strokeWidth={1.75} />
        </h3>
        <p className="line-clamp-3 text-[13px] leading-[1.6] text-muted">{station.summary}</p>
        <span className="hidden items-center gap-1.5 text-[12px] font-semibold text-accent sm:inline-flex">
          Explorează stația
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" strokeWidth={1.75} />
        </span>
      </div>
    </Link>
  );
}

function Stations() {
  return (
    <Container className="grid gap-4 py-8 sm:gap-5 sm:py-10">
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
    <Container className="py-2 sm:py-4">
      <Reveal>
        <div className="relative isolate overflow-hidden rounded-[28px] border border-white/10 bg-panel text-panel-foreground shadow-float">
          <div aria-hidden className="pointer-events-none absolute inset-0 opacity-35" style={{ background: "radial-gradient(ellipse at 90% 0%, rgb(255 255 255 / 0.12), transparent 42%)" }} />
          <div className="relative grid gap-6 p-5 sm:p-7 lg:grid-cols-12 lg:gap-10">
            <div className="grid content-start gap-3.5 lg:col-span-5">
              <div className="flex items-baseline gap-3">
                <span className="tabular text-[12px] text-white/50">02</span>
                <Eyebrow className="text-brand-sand">Date</Eyebrow>
              </div>
              <h2 className="font-display text-[30px] leading-[1.08] font-medium tracking-[-0.03em] sm:text-[36px]">Exploratorul LTSER</h2>
              <p className="text-[15px] leading-[1.65] text-white/70">
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
    <Container className="grid gap-4 py-8 sm:gap-5 sm:py-10">
      <SectionHeader
        index="03"
        eyebrow="Platforme LTSER"
        title="Platforme LTSER"
        lede="Platforme de cercetare socio-ecologică pe termen lung documentate în explorator."
        aside={<ArrowLink to="platforme">Despre platforme</ArrowLink>}
      />
      <Reveal className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
        {PLATFORMS.map((p) => (
          <Link key={p.slug} to={`platforme/${p.slug}`} className="group grid grid-cols-[104px_minmax(0,1fr)] gap-3 overflow-hidden rounded-[18px] border border-border bg-surface p-2 shadow-card transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-accent/35 hover:shadow-float sm:block sm:rounded-[22px] sm:p-0">
            <div className="relative min-h-[84px] overflow-hidden rounded-[10px] sm:aspect-[2/1] sm:min-h-0 sm:rounded-none">
              <CreditedPhoto photo={p.photo} alt={`${p.name}, ${p.photo.location}`} sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 104px" credit="label" creditClassName="hidden sm:block" className="absolute inset-0" />
              <div aria-hidden className="pointer-events-none absolute inset-0 hidden bg-gradient-to-t from-zinc-950/85 via-zinc-950/15 to-transparent sm:block" />
              <span aria-hidden className="absolute top-3 right-3 hidden size-9 place-items-center rounded-full border border-white/25 bg-zinc-950/20 text-white backdrop-blur transition-colors group-hover:bg-white group-hover:text-foreground sm:grid">
                <ArrowUpRight className="size-4" strokeWidth={1.75} />
              </span>
              <div className="absolute inset-x-0 bottom-0 hidden gap-1 p-5 pr-12 text-white sm:grid">
                <p className="text-[10px] font-semibold tracking-[0.14em] text-white/75 uppercase">{p.kind}</p>
                <h3 className="font-display text-[22px] leading-[1.12] font-medium tracking-[-0.025em] lg:text-[24px]">{p.name}</h3>
              </div>
            </div>
            <div className="grid content-center gap-0.5 py-1 pr-1 sm:hidden">
              <p className="text-[10px] font-semibold tracking-[0.12em] text-subtle uppercase">{p.kind}</p>
              <h3 className="font-display text-[17px] leading-tight font-medium tracking-[-0.025em]">{p.name}</h3>
              <p className="text-[12px] text-muted">{p.region} · <span className="tabular font-medium text-accent">{p.figures[0].value}</span></p>
            </div>
            <div className="hidden items-center justify-between gap-3 border-t border-border px-5 py-2.5 sm:flex">
              <span className="truncate text-[12px] text-muted">{p.region}</span>
              <span className="tabular shrink-0 text-[12px] font-medium text-accent">{p.figures[0].value}</span>
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
    <Container className="grid gap-8 pt-2 pb-8 sm:pb-10 lg:grid-cols-2 lg:gap-12">
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
                <a href={i.url} target="_blank" rel="noreferrer" className="group grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 gap-y-0.5 py-2.5 sm:grid-cols-[150px_minmax(0,1fr)_auto]">
                  <span className="col-start-1 row-start-1 text-[14px] font-semibold tracking-tight">{i.name}</span>
                  <span className="col-start-1 row-start-2 text-[13.5px] leading-relaxed text-muted sm:col-start-2 sm:row-start-1">{i.role}</span>
                  <ArrowUpRight className="col-start-2 row-start-1 size-3.5 self-center sm:col-start-3 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" strokeWidth={1.75} />
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
      <Container className="pb-4 sm:pb-6">
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
      <Container>
        <Reveal>
          <div className="flex flex-col gap-4 rounded-[22px] border border-accent/15 bg-accent-soft p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="grid max-w-[62ch] gap-2">
              <Eyebrow>Colaborare și cercetare</Eyebrow>
              <h2 className="font-display text-[24px] leading-tight font-medium tracking-[-0.03em] text-balance sm:text-[28px]">Conectăm datele, oamenii și locurile care protejează natura.</h2>
              <p className="text-[14px] leading-relaxed text-muted">Află cum infrastructura LifeWatch România poate susține cercetarea și colaborările interdisciplinare.</p>
            </div>
            <Button asChild variant="primary" size="lg" className="h-11 shrink-0 px-5 text-[14px]">
              <Link to="contact">
                Contactează echipa
                <ArrowRight strokeWidth={1.75} />
              </Link>
            </Button>
          </div>
        </Reveal>
      </Container>
    </>
  );
}
