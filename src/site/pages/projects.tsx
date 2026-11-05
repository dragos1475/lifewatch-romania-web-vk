// European research projects of the team.
import { ArrowUpRight } from "lucide-react";
import { PROJECTS, PROJECTS_SOURCE } from "../content/projects";
import { Link } from "../router";
import { Container, Crumbs, ExternalLink, PageIntro } from "../components/primitives";

export default function ProjectsPage() {
  return (
    <>
      <PageIntro
        eyebrow="Rețea și comunitate"
        title="Proiecte europene"
        lede="Cinci proiecte Horizon despre biodiversitate, zone umede și știința pentru decizie, la care contribuie echipele infrastructurii."
        crumbs={<Crumbs items={[{ label: "Rețea", node: <Link to="retea" className="hover:text-foreground">Rețea și comunitate</Link> }, { label: "Proiecte" }]} />}
      >
        <ExternalLink href={PROJECTS_SOURCE} className="text-[14px]">Lista proiectelor RCSES</ExternalLink>
      </PageIntro>
      <Container>
        <ol className="grid border-t border-border">
          {PROJECTS.map((p, i) => (
              <li key={p.acronym} className="border-b border-border">
                <a href={p.url} target="_blank" rel="noreferrer" className="group grid gap-2 py-4 md:grid-cols-12 md:gap-6">
                  <span className="tabular text-[13px] text-subtle md:col-span-1">{String(i + 1).padStart(2, "0")}</span>
                  <span className="grid content-start gap-1 md:col-span-4">
                    <span className="tabular text-[19px] font-medium tracking-tight transition-colors group-hover:text-accent">{p.acronym}</span>
                    <span className="text-[13px] text-subtle">{p.theme}{p.note ? ` · ${p.note}` : ""}</span>
                  </span>
                  <span className="max-w-[90ch] text-[14.5px] leading-relaxed text-muted md:col-span-6">{p.summary}</span>
                  <span className="hidden justify-self-end md:col-span-1 md:block">
                    <ArrowUpRight className="size-4 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" strokeWidth={1.75} />
                  </span>
                </a>
              </li>
          ))}
        </ol>
      </Container>
    </>
  );
}
