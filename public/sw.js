/**
 * 2025 Service Worker - PWA Support
 * Modern service worker with better caching strategies
 */

const CACHE_NAME = 'leadflow-v2';
const RUNTIME_CACHE = 'leadflow-runtime-v2';
const STATIC_CACHE = 'leadflow-static-v2';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.svg',
  '/apple-touch-icon.png',
];

// 2025: Skip service worker in development
const isDevelopment = 
  self.location.hostname === 'localhost' || 
  self.location.hostname === '127.0.0.1' ||
  self.location.hostname.includes('localhost');

if (isDevelopment) {
  // Skip service worker in development
  self.skipWaiting();
} else {
  // Install event - Cache static assets
  self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open(STATIC_CACHE)
        .then((cache) => {
          console.log('[SW] Caching static assets');
          return cache.addAll(STATIC_ASSETS);
        })
        .then(() => self.skipWaiting())
        .catch((error) => {
          console.error('[SW] Cache install failed:', error);
        })
    );
  });

  // Activate event - Clean up old caches
  self.addEventListener('activate', (event) => {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (
              cacheName !== CACHE_NAME &&
              cacheName !== STATIC_CACHE &&
              cacheName !== RUNTIME_CACHE
            ) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }).then(() => self.clients.claim())
    );
  });

  // Fetch event - 2025: Network-first strategy with fallback
  self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip cross-origin requests
    if (url.origin !== self.location.origin) {
      return;
    }

    // Skip caching for non-GET requests (POST, PUT, DELETE, etc.)
    // Cache API only supports GET requests
    if (request.method !== 'GET') {
      return;
    }

    // 2025: Different strategies for different resource types
    if (request.destination === 'image') {
      // Images: Cache-first strategy
      event.respondWith(cacheFirst(request));
    } else if (
      request.destination === 'script' ||
      request.destination === 'style'
    ) {
      // Scripts/Styles: Network-first with cache fallback
      event.respondWith(networkFirst(request));
    } else {
      // Other resources: Network-first
      event.respondWith(networkFirst(request));
    }
  });

  // 2025: Cache-first strategy (for images)
  async function cacheFirst(request) {
    // Only cache GET requests
    if (request.method !== 'GET') {
      return fetch(request);
    }

    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    try {
      const networkResponse = await fetch(request);
      if (networkResponse.ok && request.method === 'GET') {
        const cache = await caches.open(RUNTIME_CACHE);
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    } catch (error) {
      console.error('[SW] Fetch failed:', error);
      // Return offline page or fallback
      return new Response('Offline', { status: 503 });
    }
  }

  // 2025: Network-first strategy (for dynamic content)
  async function networkFirst(request) {
    // Only cache GET requests
    if (request.method !== 'GET') {
      return fetch(request);
    }

    try {
      const networkResponse = await fetch(request);
      if (networkResponse.ok && request.method === 'GET') {
        const cache = await caches.open(RUNTIME_CACHE);
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    } catch (error) {
      console.log('[SW] Network failed, trying cache:', error);
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
      return new Response('Offline', { status: 503 });
    }
  }
}
