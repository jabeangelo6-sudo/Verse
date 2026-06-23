const CACHE = "verse-v1";
const PRECACHE = ["/", "/explore", "/notifications", "/offline"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE).catch(() => {})));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);

  // Skip non-GET and chrome-extension requests
  if (e.request.method !== "GET" || !url.protocol.startsWith("http")) return;

  // Network-first for API and auth calls
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/_next/")) {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request).then((r) => r ?? Response.error()))
    );
    return;
  }

  // Cache-first for everything else
  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached;
      return fetch(e.request)
        .then((res) => {
          if (res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE).then((c) => c.put(e.request, clone));
          }
          return res;
        })
        .catch(() => caches.match("/") ?? Response.error());
    })
  );
});
