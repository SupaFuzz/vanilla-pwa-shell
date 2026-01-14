const CACHE_NAME = 'my-cache-v1'; // Update this version number when content changes
const file_manifest = [
    './',
    './app_main.html',
    './main.css',
    './manifest.json',
    './gfx/app_touch_icon.svg',
    './lib/app.js',
    './serviceWorker.js'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(file_manifest);
            })
    );
    self.skipWaiting(); // Immediately take control after installation for first time visitors
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        // Delete old caches
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(cacheName => cacheName !== CACHE_NAME)
                    .map(cacheName => caches.delete(cacheName))
            );
        })
    );
    // Claim clients so the new SW controls all pages immediately after activation
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                // No cache hit - fetch from network
                return fetch(event.request);
            })
    );
});

// Listen for a message from the client to skip waiting
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
