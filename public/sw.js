const CACHE_NAME = 'hans-compain-v4';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.png',
  '/favicon.ico',
  '/favicon-32x32.png',
  '/favicon-16x16.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Clearing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // 1. Network-First for index.html, root, and manifest to prevent stale hashed asset 404 trap
  if (
    event.request.mode === 'navigate' ||
    url.pathname === '/' ||
    url.pathname === '/index.html' ||
    url.pathname === '/manifest.json'
  ) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // Offline fallback
          return caches.match(event.request).then(cached => {
            if (cached) return cached;
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html');
            }
          });
        })
    );
    return;
  }

  // 2. Skip API routes or Firebase Firestore calls
  if (url.pathname.includes('/api/') || url.hostname.includes('firestore') || url.hostname.includes('googleapis')) {
    return; // Let the browser handle live network requests
  }

  // 3. Cache-First (with on-the-fly caching) for all static assets (js, css, images)
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        // Return cached asset immediately, but let's revalidate in the background if it's not a hashed asset
        const isHashed = url.pathname.includes('/assets/');
        if (!isHashed) {
          fetch(event.request).then(networkResponse => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, networkResponse);
              });
            }
          }).catch(() => {});
        }
        return cachedResponse;
      }

      return fetch(event.request).then(networkResponse => {
        if (!networkResponse || networkResponse.status !== 200) {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // Fail gracefully
      });
    })
  );
});
