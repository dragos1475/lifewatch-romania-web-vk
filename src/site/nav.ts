// Primary navigation and the explorer's modules, shared by the header, footer and search.
import { Database, RadioTower, Satellite, Users, type LucideIcon } from "lucide-react";

export interface NavItem {
  key: string;
  label: string;
  match: string[];
}

export const NAV: NavItem[] = [
  { key: "despre", label: "Despre", match: ["despre"] },
  { key: "infrastructura", label: "Infrastructură", match: ["infrastructura"] },
  { key: "platforme", label: "Platforme LTSER", match: ["platforme"] },
  { key: "date", label: "Date și servicii", match: ["date", "servicii"] },
  { key: "retea", label: "Rețea", match: ["retea", "proiecte"] },
  { key: "contact", label: "Contact", match: ["contact", "intrebari-frecvente"] },
];

export const activeNav = (key: string) => NAV.find((n) => n.match.includes(key.split("/")[0]))?.key ?? null;

export interface ExplorerModule {
  id: string;
  title: string;
  body: string;
  path: string;
  icon: LucideIcon;
}

export const EXPLORER_MODULES: ExplorerModule[] = [
  { id: "rs", title: "Teledetecție", body: "Hărți lunare SSM, NDVI și FAPAR, serii pe punct sau pe unitate administrativă.", path: "teledetectie/national", icon: Satellite },
  { id: "net", title: "Rețele de stații", body: "Valori orare, zilnice și semi-orare pe hartă, grafice cu două axe și metadatele instrumentelor.", path: "retele/meteo", icon: RadioTower },
  { id: "platform", title: "Platforma de date", body: "Măsurători brute pentru fiecare stație, până la patru variabile comparate pe ferestre de cel mult 7 zile.", path: "platforma/statii", icon: Database },
  { id: "social", title: "Indicatori sociali", body: "Populația după domiciliu, pe sex și vârstă, și emigrația definitivă pentru 208 unități administrative.", path: "social", icon: Users },
];
