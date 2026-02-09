const CACHE_NAME = 'testoloji-v2';
const STATIC_ASSETS = [
    '/',
    '/manifest.json',
    '/images/logo2.png',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
];

// Resources that are updated frequently but should be available offline
const DYNAMIC_CACHE = 'testoloji-dynamic-v1';

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME && cacheName !== DYNAMIC_CACHE) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') return;

    // IMPORTANT: Skip non-http/https requests (like chrome-extension://)
    const url = new URL(event.request.url);
    if (!['http:', 'https:'].includes(url.protocol)) return;

    // Skip API calls to ensure fresh data and prevent unexpected caching
    if (url.pathname.startsWith('/api/') || url.pathname.includes('_next/data')) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                // Return cached version but refresh in background (Stale-While-Revalidate)
                fetch(event.request).then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        caches.open(DYNAMIC_CACHE).then((cache) => {
                            cache.put(event.request, networkResponse);
                        });
                    }
                });
                return cachedResponse;
            }

            return fetch(event.request).then((networkResponse) => {
                if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                    return networkResponse;
                }

                const responseToCache = networkResponse.clone();
                caches.open(DYNAMIC_CACHE).then((cache) => {
                    cache.put(event.request, responseToCache);
                });

                return networkResponse;
            }).catch(() => {
                // Offline fallback for navigation
                if (event.request.mode === 'navigate') {
                    return caches.match('/');
                }
            });
        })
    );
});
