const CACHE = 'kortex-memo-v3';
const ASSETS = ['./', './index.html', './boot.mjs', './config.mjs', './icon.svg', './runtime.mjs', './styles.css'];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS))));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE && key.startsWith('kortex-memo')).map(key => caches.delete(key))))));
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    if (!response.ok || response.type !== 'basic') return response;
    const copy = response.clone();
    return caches.open(CACHE).then(cache => cache.put(event.request, copy)).then(() => response);
  }).catch(async () => {
    if (event.request.mode !== 'navigate') return Response.error();
    return (await caches.match('./index.html')) || Response.error();
  })));
});

