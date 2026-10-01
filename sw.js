const CACHE_NAME = 'sparkydraw-v1.3';

const PRECACHE_ASSETS = [
    './',
    'index.html',
    'app.css',
    'app.js',
    'i18n.js',
    'favicon.svg',
    'manifest.webmanifest',
    'icons/icon-192.png',
    'icons/icon-512.png',
    'icons/icon-full-logo-512.png',
    'icons/icon-maskable-512.png',
    'icons/apple-touch-icon.png'
];

// Install: precache app shell
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(PRECACHE_ASSETS);
        }).then(() => self.skipWaiting())
    );
});

// Activate: clean up outdated caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((name) => {
                    if (name !== CACHE_NAME) {
                        return caches.delete(name);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch: serve from cache with network fallback & runtime font caching
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // Ignore analytics requests
    if (url.hostname.includes('yandex.ru')) return;

    // Handle Google Fonts runtime caching
    if (url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com') {
        event.respondWith(
            caches.match(request).then((cached) => {
                if (cached) return cached;
                return fetch(request).then((response) => {
                    if (response && response.status === 200) {
                        const copy = response.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
                    }
                    return response;
                }).catch(() => cached);
            })
        );
        return;
    }

    // Handle same-origin assets & navigation
    if (url.origin === self.location.origin) {
        event.respondWith(
            caches.match(request, { ignoreSearch: true }).then((cachedResponse) => {
                // Return cached version immediately if available
                if (cachedResponse) {
                    // Update cache in the background (stale-while-revalidate)
                    fetch(request).then((networkResponse) => {
                        if (networkResponse && networkResponse.status === 200) {
                            caches.open(CACHE_NAME).then((cache) => {
                                cache.put(request, networkResponse);
                            });
                        }
                    }).catch(() => {
                        // Offline, network failed quietly
                    });
                    return cachedResponse;
                }

                // If not in cache, fetch from network and store
                return fetch(request).then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        const copy = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(request, copy);
                        });
                    }
                    return networkResponse;
                }).catch(() => {
                    // Fallback to index.html for navigation requests when offline
                    if (request.mode === 'navigate') {
                        return caches.match('index.html', { ignoreSearch: true });
                    }
                });
            })
        );
    }
});
