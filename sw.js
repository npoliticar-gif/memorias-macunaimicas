const CACHE = 'memorias-macunaimicas-v1';
const BASE = self.registration.scope;
const SHELL = ['./', './index.html', './app.js', './manifest.webmanifest', './icon-192[1].png', './icon-512[1].png', './sarau-na-quebrada-marca.jpg'].map(path => new URL(path, BASE).href);
self.addEventListener('install', event => {
 event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
 event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('memorias-macunaimicas-') && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
 const req = event.request, url = new URL(req.url);
 if (req.method !== 'GET' || url.origin !== self.location.origin || !url.href.startsWith(BASE)) return;
 if (req.mode === 'navigate') {
 event.respondWith((async () => {
  try {const response = await fetch(req); if (response.ok) {const cache = await caches.open(CACHE); await cache.put(req, response.clone());} return response;}
  catch {return (await caches.match(req)) || (await caches.match(new URL('./index.html', BASE).href)) || new Response('Memorial indisponível. Reconecte para carregar.', {status:503,headers:{'Content-Type':'text/plain;charset=utf-8'}});}
 })());
 } else if (SHELL.includes(url.href)) {
 event.respondWith(caches.match(req).then(cached => cached || fetch(req)));
 }
});
