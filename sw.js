const C = "pt-kjetil-v2";
self.addEventListener("install", e => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) return;
  if (u.searchParams.has("r")) { e.respondWith(fetch(e.request).then(r => { const k = new Request(u.origin + u.pathname); caches.open(C).then(c => c.put(k, r.clone())); return r; })); return; }
  const key = new Request(u.origin + u.pathname + (u.search.includes("vis=") ? "" : ""));
  e.respondWith(caches.open(C).then(c => c.match(key).then(hit => {
    const net = fetch(e.request).then(r => { if (r.ok) c.put(key, r.clone()); return r; }).catch(() => hit);
    return hit || net;
  })));
});
