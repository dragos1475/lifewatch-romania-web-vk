// Layout primitives for the public site: container, section header, reveal, facts, external link.
import type { ReactNode } from "react";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const SPRING = { type: "spring", stiffness: 300, damping: 30 } as const;

/** The five logo colours, used in order for numbered sections and categories. */
export const BRAND_TONES = ["bg-brand-green", "bg-brand-orange", "bg-brand-teal", "bg-brand-sand", "bg-brand-navy"] as const;
export const toneFor = (index?: string) => BRAND_TONES[((Number.parseInt(index ?? "1", 10) || 1) - 1) % BRAND_TONES.length];

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  // Fluid up to 1920px; the side padding grows with the screen instead of a narrow fixed column.
  return <div className={cn("mx-auto w-full max-w-[1920px] px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20", className)}>{children}</div>;
}

/** Fades content in once it scrolls into view. The noscript style in index.html keeps it visible without JS. */
export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      data-reveal
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ ...SPRING, delay }}
    >
      {children}
    </motion.div>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("text-[13px] font-medium text-accent", className)}>{children}</p>;
}

/** Compact section header: marker, index and eyebrow above the title, optional link on the right. */
export function SectionHeader({ index, eyebrow, title, lede, aside, id }: { index?: string; eyebrow: string; title: ReactNode; lede?: ReactNode; aside?: ReactNode; id?: string }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-2 border-t border-border pt-4">
      <div className="grid max-w-[80ch] gap-1">
        <div className="flex items-center gap-2">
          <span aria-hidden className={cn("size-2 shrink-0 rounded-[2px]", toneFor(index))} />
          {index ? <span className="tabular text-[12px] text-subtle">{index}</span> : null}
          <Eyebrow className="text-[12px]">{eyebrow}</Eyebrow>
        </div>
        <h2 id={id} className="scroll-mt-24 text-[22px] leading-tight font-semibold tracking-[-0.02em] text-balance sm:text-[26px]">{title}</h2>
        {lede ? <p className="text-[14px] leading-relaxed text-pretty text-muted">{lede}</p> : null}
      </div>
      {aside ? <div className="pb-0.5">{aside}</div> : null}
    </div>
  );
}

/** Page opening used by every inner page. */
export function PageIntro({ eyebrow, title, lede, children, crumbs }: { eyebrow: string; title: ReactNode; lede?: ReactNode; children?: ReactNode; crumbs?: ReactNode }) {
  return (
    <Container className="pt-6 pb-8 sm:pt-8">
      {crumbs}
      <div className="grid gap-5 lg:grid-cols-12 lg:items-end">
        <div className="grid min-w-0 content-start gap-2.5 lg:col-span-8">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="text-[32px] leading-[1.05] font-semibold tracking-[-0.03em] text-balance sm:text-[42px]">{title}</h1>
          {lede ? <p className="max-w-[75ch] text-[16px] leading-[1.6] text-pretty text-muted">{lede}</p> : null}
        </div>
        {children ? <div className="min-w-0 lg:col-span-4">{children}</div> : null}
      </div>
    </Container>
  );
}

/** Key numbers separated by hairlines; the 1px gap shows the border colour through. */
export function Figures({ items, className }: { items: { value: string; label: string }[]; className?: string }) {
  return (
    <dl className={cn("grid grid-cols-2 gap-px border-y border-border bg-border md:grid-cols-4", className)}>
      {items.map((f, i) => (
        <div key={f.label} className={cn("grid content-start gap-0.5 bg-background py-3 pr-4", i % 2 === 1 ? "pl-5" : "md:pl-5", i === 0 && "md:pl-0")}>
          <dt className="order-2 text-[13px] leading-snug text-muted">{f.label}</dt>
          <dd className="tabular order-1 text-[22px] font-medium tracking-tight sm:text-[24px]">{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function ExternalLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className={cn("group inline-flex items-center gap-1 text-foreground underline decoration-border-strong underline-offset-4 transition-colors hover:decoration-accent", className)}>
      {children}
      <ArrowUpRight className="size-3.5 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" strokeWidth={1.75} />
    </a>
  );
}

export function BulletList({ items, columns = 1 }: { items: string[]; columns?: 1 | 2 }) {
  return (
    <ul className={cn("grid border-t border-border", columns === 2 && "md:grid-cols-2 md:gap-x-8")}>
      {items.map((item) => (
        <li key={item} className="flex gap-3 border-b border-border py-2 text-[15px] leading-relaxed text-foreground">
          <span aria-hidden className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-brand-green" />
          <span className="text-pretty">{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function Crumbs({ items }: { items: { label: string; node?: ReactNode }[] }) {
  return (
    <nav aria-label="Navigare ierarhică" className="mb-4">
      <ol className="flex flex-wrap items-center gap-1.5 text-[13px] text-subtle">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-1.5">
            {i > 0 ? <span aria-hidden className="text-border-strong">/</span> : null}
            {item.node ?? <span aria-current="page" className="text-muted">{item.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
