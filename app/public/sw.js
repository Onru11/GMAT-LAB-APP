// Offline support. Pages are network-first (so a new deploy shows up on the
// next visit) with the cached copy as fallback; hashed build assets and fonts
// are cache-first since their URLs change whenever their content does.
const CACHE = 'gmatlab-v1';
const SHELL = ['./', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

async function networkFirst(request) {
  const cache = await caches.open(CACHE);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    return (await cache.match(request)) || (await cache.match('./'));
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(request);
  if (hit) return hit;
  const response = await fetch(request);
  if (response.ok || response.type === 'opaque') cache.put(request, response.clone());
  return response;
}

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (request.mode === 'navigate') return event.respondWith(networkFirst(request));
  if (url.host === 'fonts.googleapis.com' || url.host === 'fonts.gstatic.com' || url.pathname.includes('/assets/'))
    return event.respondWith(cacheFirst(request));
  if (url.origin === location.origin) event.respondWith(networkFirst(request));
});
