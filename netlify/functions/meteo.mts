// Point forecast for the "Vremea" (weather) tab of the site sheets, shared by every copy of the site (Netlify,
// Lovable, Vercel). GET /api/meteo?lat=45.35&lon=25.55 returns the ALARO-4 forecast of ANM for that point,
// read from the model files of the ANM open data portal (src/site/meteo/alaro.ts). Browsers cannot read those
// files themselves (the portal sends no CORS headers for them). Netlify keeps each answer in its cache for half an
// hour and serves the stale one while it refreshes, so most visits do not reach ANM.
import { pointForecast } from "../../src/site/meteo/alaro";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

export default async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers });
  if (req.method !== "GET") return new Response("Method not allowed", { status: 405, headers });
  const q = new URL(req.url).searchParams;
  const lat = Number(q.get("lat")),
    lon = Number(q.get("lon"));
  // Romania and its borders; the model grid is larger, but the site only asks for places here.
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || lat < 43.5 || lat > 48.5 || lon < 20 || lon > 30)
    return Response.json({ error: "lat and lon must lie in Romania" }, { status: 400, headers });
  try {
    const forecast = await pointForecast(Math.round(lat * 1000) / 1000, Math.round(lon * 1000) / 1000);
    return Response.json(forecast, {
      headers: {
        ...headers,
        "Cache-Control": "public, max-age=600",
        "Netlify-CDN-Cache-Control": "public, durable, max-age=1800, stale-while-revalidate=21600",
        "Netlify-Vary": "query=lat|lon",
      },
    });
  } catch {
    return Response.json({ error: "unavailable" }, { status: 502, headers: { ...headers, "Cache-Control": "no-store" } });
  }
};

export const config = { path: "/api/meteo" };
