// Service worker: network-first for pages so visitors always get the latest
// version, cache-first for Next.js build assets (content-hashed, never change),
// and cached pages as an offline fallback.
//
// Bump CACHE_VERSION to discard every previously cached response.
const CACHE_VERSION = 'v2';
const PAGE_CACHE = `hh-pages-${CACHE_VERSION}`;
const ASSET_CACHE = `hh-assets-${CACHE_VERSION}`;
const PRECACHE_URLS = ['/', '/about'];
const MAX_PAGE_ENTRIES = 60;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(PAGE_CACHE).then((cache) =>
      // Cache each URL independently so one failure doesn't abort the install
      Promise.allSettled(PRECACHE_URLS.map((url) => cache.add(url)))
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  const current = new Set([PAGE_CACHE, ASSET_CACHE]);
  event.waitUntil(
    caches
      .keys()
      .then((names) => Promise.all(names.filter((name) => !current.has(name)).map((name) => caches.delete(name))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  // Leave cross-origin requests (images, analytics, forms) to the browser
  if (url.origin !== self.location.origin) return;

  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(cacheFirst(request));
  } else {
    event.respondWith(networkFirst(request));
  }
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(ASSET_CACHE);
    cache.put(request, response.clone());
  }
  return response;
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(PAGE_CACHE);
      await cache.put(request, response.clone());
      trimCache(cache, MAX_PAGE_ENTRIES);
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) return cached;
    if (request.mode === 'navigate') return offlinePage();
    throw error;
  }
}

async function trimCache(cache, maxEntries) {
  const keys = await cache.keys();
  // Keys are in insertion order; drop the oldest beyond the limit
  await Promise.all(keys.slice(0, Math.max(0, keys.length - maxEntries)).map((key) => cache.delete(key)));
}

function offlinePage() {
  return new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Offline | Hobbyist's Hideaway</title></head>
<body style="font-family:system-ui,sans-serif;display:grid;place-items:center;min-height:100vh;margin:0;padding:16px;background:#f5f3fb;color:#1f1f29;text-align:center">
<div><h1 style="font-size:1.5rem">You're offline</h1><p>This page hasn't been saved for offline reading yet. Reconnect and try again.</p><p><a href="/" style="color:#6d55b1">Go to the home page</a></p></div>
</body></html>`,
    { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  );
}
