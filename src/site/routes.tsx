// Route table of the public site. Every entry is prerendered to /<key>/index.html.
import type { ComponentType } from "react";
import { photoSrc } from "@/lib/photos";
import { HERO_PHOTO } from "@/lib/photos";
import { STATIONS } from "./content/stations";
import { PLATFORMS } from "./content/platforms";
import HomePage from "./pages/home";
import AboutPage from "./pages/about";
import InfrastructurePage from "./pages/infrastructure";
import { StationPage } from "./pages/station";
import PlatformsPage from "./pages/platforms";
import { PlatformPage } from "./pages/platform";
import DataPage from "./pages/data";
import ApiPage from "./pages/api";
import DocsPage from "./pages/docs";
import ServicesPage from "./pages/services";
import NetworkPage from "./pages/network";
import ProjectsPage from "./pages/projects";
import FaqPage from "./pages/faq";
import ContactPage from "./pages/contact";

export interface SiteRoute {
  key: string;
  title: string;
  description: string;
  Page: ComponentType;
  image?: string;
  searchable?: boolean;
}

const page = (key: string, title: string, description: string, Page: ComponentType, image?: string): SiteRoute => ({ key, title, description, Page, image, searchable: true });

export const SITE_ROUTES: SiteRoute[] = [
  page("", "Acasă", "Infrastructura națională de cercetare e-Science pentru biodiversitate și ecosisteme: stații de teren, platforme LTSER și date deschise.", HomePage, photoSrc(HERO_PHOTO, 1200)),
  page("despre", "Despre", "Misiunea, obiectivele și istoricul LifeWatch România, infrastructură de cercetare a Universității din București.", AboutPage),
  page("infrastructura", "Infrastructură", "Cele patru stații de cercetare: Brăila, Sfântu Gheorghe, Sinaia și Orșova.", InfrastructurePage),
  ...STATIONS.map((s) => ({
    key: `infrastructura/${s.slug}`,
    title: s.name,
    description: s.summary,
    Page: () => <StationPage station={s} />,
    image: photoSrc(s.photo, 1200),
    searchable: false,
  })),
  page("platforme", "Platforme LTER și LTSER", "Cercetarea socio-ecologică pe termen lung în România și cele șase platforme documentate în explorator.", PlatformsPage),
  ...PLATFORMS.map((p) => ({
    key: `platforme/${p.slug}`,
    title: p.name,
    description: p.summary,
    Page: () => <PlatformPage platform={p} />,
    image: photoSrc(p.photo, 1200),
    searchable: false,
  })),
  page("date", "Catalog de date", "Seturile de date ale infrastructurii: teledetecție, rețele de stații, măsurători brute, indicatori sociali și limite.", DataPage),
  page("date/api", "API de acces la date", "Rutele API-ului LifeWatch pentru stații, variabile și serii de timp, cu exemple de cereri și răspunsuri.", ApiPage),
  page("date/documentatie", "Documentație", "Fus orar, pas de timp, limite, valori lipsă și formatele de export ale datelor.", DocsPage),
  page("servicii", "Servicii", "Instrumente web, centrul de date de la Sinaia și formare pentru cercetare.", ServicesPage),
  page("retea", "Rețea și comunitate", "ILTER, LTER-Europe, eLTER și infrastructurile europene de cercetare în care contribuie LifeWatch România.", NetworkPage),
  page("proiecte", "Proiecte", "Proiectele europene Horizon la care contribuie echipele infrastructurii.", ProjectsPage),
  page("intrebari-frecvente", "Întrebări frecvente", "Răspunsuri despre infrastructură, platformele LTSER, accesul la date și explorator.", FaqPage),
  page("contact", "Contact", "Adresele și telefoanele stațiilor de cercetare LifeWatch România.", ContactPage),
];

export const findSiteRoute = (key: string) => SITE_ROUTES.find((r) => r.key === key) ?? null;

export const documentTitle = (route: SiteRoute | null) => (!route ? "Pagina nu există · LifeWatch România" : route.key ? `${route.title} · LifeWatch România` : "LifeWatch România · Universitatea din București");
export const NOT_FOUND_DESCRIPTION = "Pagina căutată nu există pe site-ul LifeWatch România.";

const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Title, description and Open Graph tags for a prerendered page. */
export function headTags(route: SiteRoute | null) {
  const title = escapeHtml(documentTitle(route));
  const description = escapeHtml(route?.description ?? NOT_FOUND_DESCRIPTION);
  const tags = [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="ro_RO" />`,
    `<meta property="og:site_name" content="LifeWatch România" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
  ];
  if (route?.image) tags.push(`<meta property="og:image" content="${escapeHtml(route.image)}" />`, `<meta name="twitter:card" content="summary_large_image" />`);
  if (!route) tags.push(`<meta name="robots" content="noindex" />`);
  return tags.join("\n    ");
}
