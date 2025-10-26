const CACHE_NAME = 'recruitedge-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

// Skip service worker in development
if (self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1') {
  console.log('Skipping service worker in development mode');
  self.skipWaiting();
  // Don't register event listeners in development
} else {
  // Install event
  self.addEventListener('install', event => {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then(cache => {
          console.log('Opened cache');
          return cache.addAll(urlsToCache);
        })
    );
  });

  // Fetch event
  self.addEventListener('fetch', event => {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          // Return cached version or fetch from network
          if (response) {
            return response;
          }
          return fetch(event.request);
        }
      )
    );
  });

  // Activate event
  self.addEventListener('activate', event => {
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
  });
}


