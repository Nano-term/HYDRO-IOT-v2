/**
 * sw.js — Service Worker v3.0
 * Agrega: notificaciones push para alertas críticas
 */

const CACHE_NAME = 'hidro-iot-v3.0.0';

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
  '/src/js/ui/ui.config.js',
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

// ── Notificaciones push ───────────────────────────────────────
self.addEventListener('push', (e) => {
  if (!e.data) return;
  const data = e.data.json();
  e.waitUntil(
    self.registration.showNotification(data.title || 'HidroGanadero', {
      body: data.body || '',
      icon: '/public/icons/icon-192.png',
      badge: '/public/icons/icon-192.png',
      tag: data.tag || 'hidro-alerta',
      data: { url: data.url || '/#alertas' },
    })
  );
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      const url = e.notification.data?.url || '/';
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.focus();
          client.navigate(url);
          return;
        }
      }
      if (clients.openWindow) clients.openWindow(url);
    })
  );
});

// ── Mensajes desde la app (para enviar notificaciones locales) ─
self.addEventListener('message', (e) => {
  if (e.data?.type === 'NOTIFY_ALERTA') {
    const { titulo, cuerpo, nivel } = e.data;
    if (nivel >= 3) {
      self.registration.showNotification(titulo || 'HidroGanadero — Alerta', {
        body:  cuerpo || '',
        icon:  '/public/icons/icon-192.png',
        badge: '/public/icons/icon-192.png',
        tag:   'hidro-alerta',
        requireInteraction: nivel >= 4,
      });
    }
  }
});
