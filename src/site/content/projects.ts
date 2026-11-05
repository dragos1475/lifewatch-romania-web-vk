// European projects listed on lifewatch.ro (Proiecte). Wording is original.
export interface Project {
  acronym: string;
  name: string;
  theme: string;
  summary: string;
  url: string;
  note?: string;
}

export const PROJECTS: Project[] = [
  {
    acronym: "MARCO-BOLO",
    name: "Marco Bolo",
    theme: "Observarea biodiversității marine",
    summary: "Leagă inițiativele existente de monitorizare costieră și marină, perfecționează metodele de lucru și dezvoltă tehnologii noi pentru observarea biodiversității.",
    url: "https://marcobolo-project.eu/",
  },
  {
    acronym: "RESTORE4Cs",
    name: "Restore4Cs",
    theme: "Zone umede costiere și climă",
    summary: "Evaluează cum influențează restaurarea zonelor umede costiere din Europa atenuarea schimbărilor climatice și serviciile ecosistemice, cu metode standardizate de prioritizare.",
    url: "https://restore4cs.eu/",
  },
  {
    acronym: "Restore4Life",
    name: "Restore4Life",
    theme: "Restaurare în bazinul Dunării",
    summary: "Arată beneficiile socio-economice ale restaurării zonelor umede de apă dulce și costiere din bazinul Dunării, prin infrastructură albastră și verde pentru reziliență climatică.",
    url: "https://restore4life.eu/",
  },
  {
    acronym: "BioAgora",
    name: "BioAgora",
    theme: "Știință pentru decizie",
    summary: "Apropie cercetarea biodiversității de procesul decizional, prin dialog între cercetători, deținători de cunoaștere și decidenți, și construiește un serviciu științific pentru biodiversitate.",
    url: "https://bioagora.eu/",
    note: "Horizon Europe",
  },
  {
    acronym: "SELINA",
    name: "Selina",
    theme: "Servicii ecosistemice",
    summary: "Oferă repere bazate pe dovezi pentru protejarea, restaurarea și folosirea durabilă a mediului și propune standarde de cooperare internațională privind ecosistemele și biodiversitatea.",
    url: "https://project-selina.eu/",
    note: "circa 50 de parteneri din 31 de țări",
  },
];

export const PROJECTS_SOURCE = "https://rcses.unibuc.ro/projects/";
