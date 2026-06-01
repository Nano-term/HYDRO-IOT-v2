/**
 * sw.js — Service Worker
 * CACHE v1.1.0 — fuerza limpieza de cache anterior
 */

const CACHE_NAME = 'hidro-iot-v1.2.0';

const PRECACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/src/css/main.css',
  '/src/css/animations.css',
  '/src/js/app.js',
  '/src/js/state.js',
  '/src/js/router.js',
  '/src/js/config/app.config.js',
  '/src/js/firebase/firebase.js',
  '/src/js/device/device.manager.js',
  '/src/js/simulators/sim.main.js',
  '/src/js/modules/estados.module.js',
  '/src/js/ui/ui.dashboard.js',
  '/src/js/ui/ui.control.js',
  '/src/js/ui/ui.modules.js',
  '/src/js/ui/ui.ble.js',
  '/src/js/bluetooth/ble.manager.js',
  '/src/js/utils/toast.js',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const url = e.request.url;

  if (url.includes('firebase') || url.includes('googleapis') || url.includes('cdnjs') || url.includes('gstatic')) {
    e.respondWith(fetch(e.request).catch(() => new Response('', { status: 503 })));
    return;
  }

  e.respondWith(
    caches.match(e.request).then(cached => {
      return cached || fetch(e.request).then(resp => {
        const clone = resp.clone();
        caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        return resp;
      });
    }).catch(() => caches.match('/index.html'))
  );
});
