import { defineConfig, loadEnv, type ProxyOptions } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

/**
 * The browser only talks to this origin. `/lifewatch-api` and `/ltser-api` are forwarded to the
 * real services (same layout as deploy/nginx.conf.example), so neither API needs CORS.
 * Override the targets with LIFEWATCH_API_URL and LTSER_API_URL in `.env.local`.
 */
function apiProxy(prefix: string, target: string): ProxyOptions {
  return {
    target,
    changeOrigin: true,
    rewrite: (path) => path.slice(prefix.length) || "/",
    configure: (proxy) => {
      proxy.on("error", (error, _req, res) => {
        if ("writeHead" in res && !res.headersSent) {
          res.writeHead(502, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ detail: `Upstream ${target} is unreachable: ${error.message}` }));
        }
      });
    },
  };
}

export default defineConfig(({ mode, isSsrBuild }) => {
  const env = loadEnv(mode, process.cwd(), "");
  // Local runs listen on 127.0.0.1 only. A hosted workspace (v0, Codespaces, a container) sets PORT
  // and reaches the server through its own domain, so then listen on all interfaces and accept that
  // host. HOST overrides the address explicitly.
  const hosted = Boolean(env.PORT) && !env.HOST;
  const host = env.HOST || (hosted ? "0.0.0.0" : "127.0.0.1");
  const allowedHosts = host === "127.0.0.1" || host === "localhost" ? undefined : true;
  const root = (file: string) => fileURLToPath(new URL(file, import.meta.url));
  const proxy = {
    "/lifewatch-api": apiProxy("/lifewatch-api", env.LIFEWATCH_API_URL || "http://127.0.0.1:8000"),
    "/ltser-api": apiProxy("/ltser-api", env.LTSER_API_URL || "http://127.0.0.1:8001/api/v1"),
  };
  return {
    // Absolute base: the public site has nested paths (/infrastructura/braila/) and the explorer
    // lives at /explorator/. Set BASE_PATH (e.g. "/lifewatch/") to serve everything from a sub-path.
    base: env.BASE_PATH || "/",
    // The JSX runtime in src/site/i18n wraps React's and translates text on English pages.
    plugins: [react({ jsxImportSource: "@/site/i18n" }), tailwindcss()],
    resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
    server: { host, port: Number(env.PORT) || 5173, allowedHosts, proxy },
    preview: { host, port: Number(env.PORT) || 4173, allowedHosts, proxy },
    build: {
      target: "es2022",
      sourcemap: !isSsrBuild,
      // Two pages share one design system: the public site (prerendered by scripts/prerender.mjs)
      // and the explorer. The SSR build only bundles the site renderer.
      rollupOptions: isSsrBuild
        ? {}
        : {
            input: { site: root("index.html"), explorer: root("explorator/index.html") },
            output: {
              // React is shared by both pages; charts and maps are explorer-only. Everything else is
              // split automatically, so the site does not download explorer-only widgets.
              manualChunks(id: string) {
                // Small helpers that recharts also uses stay with React, or the site would pull in the charts chunk.
                if (/node_modules\/(react|react-dom|scheduler|react-is|clsx|use-sync-external-store)\//.test(id)) return "react";
                if (/node_modules\/(recharts|d3-[a-z-]+|victory-vendor|es-toolkit|immer|reselect|@reduxjs|redux)\//.test(id)) return "charts";
                if (/node_modules\/leaflet\//.test(id)) return "map";
                return undefined;
              },
            },
          },
    },
  };
});
