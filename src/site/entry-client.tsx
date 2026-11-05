import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "@/index.css";
import { SiteApp } from "./app";
import { toKey } from "./router";
import { findSiteRoute } from "./routes";

const container = document.getElementById("site")!;
const path = toKey(window.location.pathname);
// Unknown paths use the key of the prerendered 404.html.
const key = findSiteRoute(path) ? path : "__404__";
const app = (
  <StrictMode>
    <SiteApp initialKey={key} />
  </StrictMode>
);

// Hydrate only markup prerendered for this page. The dev server, or a server that falls back to
// another page's HTML, gets a fresh render instead of a hydration mismatch.
if (container.firstElementChild && container.dataset.key === key) {
  hydrateRoot(container, app);
} else {
  container.replaceChildren();
  createRoot(container).render(app);
}
