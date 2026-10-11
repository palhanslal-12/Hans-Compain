const CACHE_NAME = 'hans-compain-pwa-v3';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  // Network-first pass-through so we never cache auth proxy white pages or break Vite modules,
  // while satisfying Chrome's PWA installability requirement.
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
