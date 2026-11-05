// Research infrastructure: the four stations on the atlas next to a list that highlights them.
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { STATIONS } from "../content/stations";
import { ORG } from "../content/org";
import { Link } from "../router";
import { Atlas, ATLAS_H, ATLAS_W, AtlasLegend } from "../components/atlas";
import { CreditedPhoto } from "../components/blocks";
import { Container, PageIntro } from "../components/primitives";

export default function InfrastructurePage() {
  const [focus, setFocus] = useState<string | null>(null);
  return (
    <>
      <PageIntro
        eyebrow="Infrastructură"
        title="Stații de cercetare"
        lede={`Patru stații de teren ale ${ORG.hostGenitive}. Găzduiesc echipe de cercetare, practica de teren a studenților și echipamente de monitorizare.`}
      />
      <Container className="grid gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="self-start rounded-[18px] border border-border bg-surface p-1.5 shadow-card lg:col-span-6 2xl:col-span-5">
          <div className="relative overflow-hidden rounded-xl border border-border bg-surface-2/60" style={{ aspectRatio: `${ATLAS_W} / ${ATLAS_H}` }}>
            <div aria-hidden className="dot-grid absolute inset-0 opacity-70" />
            <Atlas className="absolute inset-0" focusStation={focus ?? undefined} />
          </div>
          <div className="px-2.5 pt-2 pb-1">
            <AtlasLegend />
          </div>
        </div>
        <ul className="grid content-start border-t border-border lg:col-span-6 2xl:col-span-7" onMouseLeave={() => setFocus(null)}>
          {STATIONS.map((s) => (
            <li key={s.slug} className="border-b border-border">
              <Link
                to={`infrastructura/${s.slug}`}
                onMouseEnter={() => setFocus(s.slug)}
                onFocus={() => setFocus(s.slug)}
                onBlur={() => setFocus(null)}
                className="group grid grid-cols-[88px_minmax(0,1fr)_auto] items-center gap-4 py-3 sm:grid-cols-[120px_minmax(0,1fr)_auto]"
              >
                <CreditedPhoto photo={s.photo} alt={`${s.photo.location}, imagine pentru ${s.name}`} sizes="120px" credit="none" className="aspect-[4/3] rounded-lg border border-border" />
                <span className="grid gap-1">
                  <span className="flex flex-wrap items-baseline gap-x-2">
                    <span className="text-[16px] font-semibold tracking-tight transition-colors group-hover:text-accent">{s.name}</span>
                    <span className="tabular text-[12px] text-subtle">din {s.founded} · {s.county}</span>
                  </span>
                  <span className="text-[13px] text-muted">{s.setting}</span>
                  <span className="hidden flex-wrap gap-1 pt-0.5 sm:flex">
                    {s.focus.map((f) => (
                      <span key={f} className="rounded border border-border bg-surface-2 px-1.5 py-px text-[11.5px] text-muted">{f}</span>
                    ))}
                  </span>
                </span>
                <ArrowRight className="size-4 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-accent" strokeWidth={1.75} />
              </Link>
            </li>
          ))}
          <li className="pt-4">
            <div className="grid gap-1.5 rounded-xl border border-border bg-surface p-3.5 shadow-card">
              <p className="text-[14px] font-semibold tracking-tight">Stații și platforme LTSER</p>
              <p className="text-[13.5px] leading-relaxed text-muted">
                Brăila coordonează monitorizarea Insulelor Brăilei, Sfântu Gheorghe lucrează în Delta Dunării, iar centrul de date de la Sinaia deservește platformele Bucegi-Piatra Craiului, Neajlov și Insulele Brăilei.
              </p>
              <Link to="platforme" className="group inline-flex w-fit items-center gap-1.5 text-[13.5px] font-medium">
                Platforme LTSER
                <ArrowRight className="size-3.5 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-accent" strokeWidth={1.75} />
              </Link>
            </div>
          </li>
        </ul>
      </Container>
    </>
  );
}
