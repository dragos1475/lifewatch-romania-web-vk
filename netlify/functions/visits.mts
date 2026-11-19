// Visit counter for the welcome page, shared by every copy of the site (Netlify, Lovable, Vercel).
// POST /api/visits adds one visit and returns the new total; GET returns the total without counting.
// The total lives in Netlify Blobs; conditional writes keep simultaneous visits from overwriting each other.
import { getStore } from "@netlify/blobs";

/** Visits counted before this counter existed; the first visit it records shows this number. */
export const START = 16214;
const KEY = "welcome";

interface CounterStore {
  getWithMetadata(key: string, options: { type: "json" }): Promise<{ data: unknown; etag?: string } | null>;
  setJSON(key: string, data: unknown, options: { onlyIfNew: true } | { onlyIfMatch: string }): Promise<{ modified: boolean }>;
}

const countOf = (data: unknown) => {
  const n = (data as { count?: unknown } | null)?.count;
  return typeof n === "number" && Number.isFinite(n) ? n : START - 1;
};

/** Adds one visit; retries when another visit wrote first. */
export async function addVisit(store: CounterStore, tries = 10): Promise<number> {
  for (let i = 0; i < tries; i++) {
    const current = await store.getWithMetadata(KEY, { type: "json" });
    if (!current) {
      if ((await store.setJSON(KEY, { count: START }, { onlyIfNew: true })).modified) return START;
      continue;
    }
    const next = countOf(current.data) + 1;
    if (current.etag && (await store.setJSON(KEY, { count: next }, { onlyIfMatch: current.etag })).modified) return next;
  }
  throw new Error("visit counter is busy");
}

export async function readVisits(store: CounterStore): Promise<number> {
  const current = await store.getWithMetadata(KEY, { type: "json" });
  return current ? countOf(current.data) : START;
}

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Cache-Control": "no-store",
};

export default async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers });
  if (req.method !== "GET" && req.method !== "POST") return new Response("Method not allowed", { status: 405, headers });
  const store = getStore({ name: "visits", consistency: "strong" }) as unknown as CounterStore;
  try {
    const count = req.method === "POST" ? await addVisit(store) : await readVisits(store);
    return Response.json({ count }, { headers });
  } catch {
    return Response.json({ error: "unavailable" }, { status: 503, headers });
  }
};

export const config = { path: "/api/visits" };
