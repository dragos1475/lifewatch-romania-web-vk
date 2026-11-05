// Site chrome: sticky header with section navigation, ⌘K search, mobile sheet and footer.
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Menu, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { LogoMark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, SheetContent } from "@/components/ui/dialog";
import { Kbd } from "@/components/ui/misc";
import { ORG, INFRASTRUCTURES } from "../content/org";
import { STATIONS } from "../content/stations";
import { activeNav, NAV } from "../nav";
import { explorerHref, Link, useRouter } from "../router";
import { Container, SPRING } from "./primitives";
import { SiteSearch } from "./site-search";
import { ThemeButton, ThemeChoice } from "./theme-switch";
import { useSearchShortcut, useShortcutLabel } from "./use-mod-key";

function Wordmark({ size = "md" }: { size?: "md" | "lg" }) {
  return (
    <Link to="" className="flex shrink-0 items-center gap-3 rounded-lg py-1" aria-label="LifeWatch România, Universitatea din București, pagina principală">
      <LogoMark className={size === "lg" ? "size-12" : "size-10"} />
      <span className="grid gap-0.5 leading-tight">
        <span className={cn("font-semibold tracking-tight", size === "lg" ? "text-[22px]" : "text-[18px]")}>LifeWatch România</span>
        <span className={cn("font-medium text-muted", size === "lg" ? "text-[15px]" : "text-[13px]")}>Universitatea din București</span>
      </span>
    </Link>
  );
}

function MobileNav({ current, onNavigate, onSearch }: { current: string | null; onNavigate: () => void; onSearch: () => void }) {
  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto px-4 py-5">
      <Wordmark />
      <button type="button" onClick={onSearch} className="flex h-9 items-center gap-2 rounded-lg border border-border bg-surface px-3 text-[13px] text-subtle shadow-card">
        <Search className="size-3.5" strokeWidth={1.75} />
        Caută în site
      </button>
      <nav aria-label="Navigare principală" className="grid gap-0.5">
        {NAV.map((n) => (
          <Link key={n.key} to={n.key} onClick={onNavigate} aria-current={current === n.key ? "page" : undefined} className="flex h-10 items-center rounded-lg px-2.5 text-[15px] text-muted aria-[current=page]:bg-surface aria-[current=page]:font-medium aria-[current=page]:text-foreground aria-[current=page]:shadow-card">
            {n.label}
          </Link>
        ))}
      </nav>
      <div className="grid gap-1 border-t border-border pt-4">
        <p className="px-2.5 pb-1 text-[11px] font-medium text-subtle">Stații de cercetare</p>
        {STATIONS.map((s) => (
          <Link key={s.slug} to={`infrastructura/${s.slug}`} onClick={onNavigate} className="flex h-9 items-center justify-between rounded-lg px-2.5 text-[14px] text-muted hover:text-foreground">
            {s.short}
            <span className="tabular text-[11px] text-subtle">{s.founded}</span>
          </Link>
        ))}
      </div>
      <div className="mt-auto grid gap-3">
        <ThemeChoice fill />
      <Button asChild variant="primary" size="lg">
        <a href={explorerHref()}>
          Deschide exploratorul
          <ArrowUpRight strokeWidth={1.75} />
        </a>
      </Button>
      </div>
    </div>
  );
}

function Header({ onSearch }: { onSearch: () => void }) {
  const { key } = useRouter();
  const current = activeNav(key);
  const shortcut = useShortcutLabel();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={cn("sticky top-0 z-[1000] border-b transition-[background-color,border-color] duration-200", scrolled ? "border-border bg-background/80 backdrop-blur-md" : "border-transparent bg-background")}>
      <div aria-hidden className="flex h-[3px]">
        <span className="flex-[5] bg-brand-navy" />
        <span className="flex-[2] bg-brand-orange" />
        <span className="flex-[3] bg-brand-green" />
        <span className="flex-[2] bg-brand-teal" />
        <span className="flex-1 bg-brand-sand" />
      </div>
      <Container className="flex h-[76px] items-center gap-4">
        <Wordmark />
        <nav aria-label="Navigare principală" className="ml-4 hidden items-center gap-0.5 xl:flex">
          {NAV.map((n) => {
            const active = current === n.key;
            return (
              <Link key={n.key} to={n.key} aria-current={active ? "page" : undefined} className="relative rounded-lg px-3 py-1.5 text-[13px] text-muted transition-colors hover:text-foreground aria-[current=page]:text-foreground">
                {active ? <motion.span layoutId="site-nav" transition={SPRING} className="absolute inset-0 rounded-lg bg-surface shadow-card ring-1 ring-border" /> : null}
                <span className="relative">{n.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={onSearch}
            className="hidden h-8 w-[200px] items-center gap-2 rounded-lg border border-border bg-surface px-2.5 text-[13px] text-subtle shadow-card transition-colors hover:border-border-strong hover:text-muted md:flex"
          >
            <Search className="size-3.5" strokeWidth={1.75} />
            <span className="flex-1 text-left">Caută</span>
            <Kbd>{shortcut}</Kbd>
          </button>
          <button type="button" onClick={onSearch} aria-label="Caută în site" className="grid size-9 place-items-center rounded-lg text-muted hover:bg-surface-2 hover:text-foreground md:hidden">
            <Search className="size-4" strokeWidth={1.75} />
          </button>
          <ThemeButton />
          <Button asChild variant="primary" size="md" className="hidden sm:inline-flex">
            <a href={explorerHref()}>
              Explorator
              <ArrowUpRight className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.75} />
            </a>
          </Button>
          <Dialog open={menu} onOpenChange={setMenu}>
            <DialogTrigger asChild>
              <button type="button" aria-label="Meniu" className="grid size-9 place-items-center rounded-lg text-muted hover:bg-surface-2 hover:text-foreground xl:hidden">
                <Menu className="size-4" strokeWidth={1.75} />
              </button>
            </DialogTrigger>
            <SheetContent title="Navigare">
              <MobileNav current={current} onNavigate={() => setMenu(false)} onSearch={() => { setMenu(false); onSearch(); }} />
            </SheetContent>
          </Dialog>
        </div>
      </Container>
    </header>
  );
}

const FOOTER_COLUMNS: { title: string; links: { label: string; to?: string; hash?: string; href?: string }[] }[] = [
  {
    title: "Organizație",
    links: [
      { label: "Despre", to: "despre" },
      { label: "Rețea și comunitate", to: "retea" },
      { label: "Proiecte", to: "proiecte" },
      { label: "Contact", to: "contact" },
    ],
  },
  {
    title: "Infrastructură",
    links: [{ label: "Toate stațiile", to: "infrastructura" }, ...STATIONS.map((s) => ({ label: s.short, to: `infrastructura/${s.slug}` })), { label: "Platforme LTSER", to: "platforme" }],
  },
  {
    title: "Date",
    links: [
      { label: "Exploratorul LTSER", href: explorerHref() },
      { label: "Catalog de date", to: "date" },
      { label: "API de acces", to: "date/api" },
      { label: "Documentație", to: "date/documentatie" },
      { label: "Servicii", to: "servicii" },
    ],
  },
  {
    title: "Ajutor",
    links: [
      { label: "Întrebări frecvente", to: "intrebari-frecvente" },
      { label: "Fotografii și surse", to: "despre", hash: "fotografii" },
    ],
  },
];

function Footer() {
  return (
    <footer className="mt-14 border-t border-border bg-surface/50">
      <Container className="grid gap-8 py-8 lg:grid-cols-12">
        <div className="grid content-start gap-3 lg:col-span-4">
          <Wordmark size="lg" />
          <p className="max-w-[40ch] text-[14px] leading-relaxed text-muted">
            Infrastructură națională de cercetare pentru biodiversitate și ecosisteme a {ORG.hostGenitive}.
          </p>
          <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-[12px] text-subtle">
            {INFRASTRUCTURES.map((i) => (
              <li key={i.id}>
                <a href={i.url} target="_blank" rel="noreferrer" className="hover:text-foreground">
                  {i.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title} className="grid content-start gap-3">
              <p className="text-[12px] font-medium text-subtle">{col.title}</p>
              <ul className="grid gap-1.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.to !== undefined ? (
                      <Link to={l.to} hash={l.hash} className="text-[14px] text-muted transition-colors hover:text-foreground">
                        {l.label}
                      </Link>
                    ) : (
                      <a href={l.href} className="text-[14px] text-muted transition-colors hover:text-foreground">
                        {l.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
      <div className="border-t border-border">
        <Container className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-3 text-[12px] text-subtle">
          <p>{ORG.name} · {ORG.host}</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <p>Fotografii de pe Unsplash, folosite conform licenței Unsplash.</p>
            <ThemeChoice />
          </div>
        </Container>
      </div>
    </footer>
  );
}

export function SiteLayout({ children }: { children: ReactNode }) {
  const [search, setSearch] = useState(false);
  const toggle = useCallback(() => setSearch((v) => !v), []);
  useSearchShortcut(toggle);
  return (
    <div className="flex min-h-dvh flex-col text-[15px]">
      <a href="#continut" className="sr-only z-[2000] rounded-lg bg-foreground px-3 py-2 text-background focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
        Sari la conținut
      </a>
      <Header onSearch={() => setSearch(true)} />
      <main id="continut" tabIndex={-1} className="relative flex-1 focus:outline-none">
        {children}
      </main>
      <Footer />
      <SiteSearch open={search} onOpenChange={setSearch} />
    </div>
  );
}
