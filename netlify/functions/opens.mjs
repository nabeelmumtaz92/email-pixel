// Owner-only opens report: GET /opens?key=... -> JSON of all hits.
import { getStore } from "@netlify/blobs";

const REPORT_KEY = "x9dbv4hm9o3Ad-gZJhLbhYG1xtMW5r0V";

export default async (req) => {
  const url = new URL(req.url);
  if (url.searchParams.get("key") !== REPORT_KEY) {
    return new Response("forbidden", { status: 403 });
  }
  const store = getStore("email-opens");
  const { blobs } = await store.list({ prefix: "hits/" });
  const hits = [];
  for (const b of blobs) {
    const v = await store.get(b.key, { type: "json" });
    const parts = b.key.split("/");
    hits.push({ token: parts[1], ts: Number(parts[2]), ...(v || {}) });
  }
  return Response.json({ count: hits.length, hits });
};

export const config = { path: "/opens" };
