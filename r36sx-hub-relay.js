// R36SX Hub relay: lets the hub page download GitHub release files.
// It only forwards release downloads from the repos listed below.
const ALLOWED = /^https:\/\/github\.com\/tzubertowski\/(TreeFrogUI|TreeFrogUI-installer|H\.OS_stock_backup|mini-scraper-cfw)\/releases\/download\//;
const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, HEAD, OPTIONS",
  "access-control-allow-headers": "range",
  "access-control-expose-headers": "content-length, content-range"
};
export default {
  async fetch(request) {
    if (request.method === "OPTIONS") return new Response(null, { headers: CORS });
    const target = new URL(request.url).searchParams.get("url") || "";
    if (!ALLOWED.test(target)) return new Response("Not allowed", { status: 403, headers: CORS });
    const range = request.headers.get("range");
    const upstream = await fetch(target, { redirect: "follow", headers: range ? { range } : {} });
    const headers = new Headers(upstream.headers);
    for (const k in CORS) headers.set(k, CORS[k]);
    return new Response(upstream.body, { status: upstream.status, headers });
  }
};
