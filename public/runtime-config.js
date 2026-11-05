// Deployment configuration, read at runtime. This is the only file to edit when deploying;
// it is copied to the build output unchanged.
//
// mode: "auto"  probes GET /health and falls back to demo data if the service is unreachable
//       "live"  always calls the service and shows its errors
//       "demo"  never calls the service, uses locally generated demonstration data
// Append ?mod=demo or ?mod=live to the page address to override the mode for one visit.
//
// The API addresses are paths on the page's own origin. A reverse proxy forwards them to the
// services (Vite in development, deploy/nginx.conf.example in production), so no CORS is needed.
window.LTSER_CONFIG = {
  lifewatchApi: "/lifewatch-api",
  lifewatchMode: "auto",
  ltserApi: "/ltser-api",
  ltserMode: "auto",
  mediaBaseUrl: null,
  requestTimeoutMs: 20000,
  probeTimeoutMs: 2500,
  basemaps: {
    light: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
    lightLabels: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
    dark: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
    darkLabels: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
    imagery: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  },
};
