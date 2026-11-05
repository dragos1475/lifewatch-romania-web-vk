// Used only by scripts/prerender.mjs at build time.
import { renderToString } from "react-dom/server";
import { SiteApp } from "./app";
import { findSiteRoute, SITE_ROUTES, headTags } from "./routes";

export function render(key: string) {
  const route = findSiteRoute(key);
  return {
    status: route ? 200 : 404,
    head: headTags(route),
    html: renderToString(<SiteApp initialKey={key} />),
  };
}

export const routeKeys = () => SITE_ROUTES.map((r) => r.key);
