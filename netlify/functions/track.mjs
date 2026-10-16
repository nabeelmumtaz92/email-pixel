// Tracking pixel: GET /t/<token>.gif -> log hit to Netlify Blobs, return 1x1 GIF.
import { getStore } from "@netlify/blobs";

const GIF = Uint8Array.from(
  atob("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"),
  (c) => c.charCodeAt(0),
);

export default async (req, context) => {
  const token = (context.params.token || "").replace(/\.gif$/, "");
  if (token) {
    try {
      const store = getStore("email-opens");
      await store.setJSON(`hits/${token}/${Date.now()}`, {
        ua: req.headers.get("user-agent") || "",
        at: new Date().toISOString(),
      });
    } catch (_) { /* still serve the pixel */ }
  }
  return new Response(GIF, {
    headers: {
      "content-type": "image/gif",
      "cache-control": "no-store, no-cache, must-revalidate, private",
      "pragma": "no-cache",
      "expires": "0",
    },
  });
};

export const config = { path: "/t/:token" };
