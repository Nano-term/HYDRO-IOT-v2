/**
 * app.js v2.0 — Punto de entrada
 * Carga caché inmediatamente, luego Firebase/BLE según disponibilidad
 */

import CONFIG        from './config/app.config.js';
import State         from './state.js';
import { Router }    from './router.js';
import { firebaseInit, listenLecturas, listenAlertas, listenNotas }
                     from './firebase/firebase.js';
import DeviceManager from './device/device.manager.js';
import { simStart }  from './simulators/sim.main.js';
import { EstadosModule } from './modules/estados.module.js';
import { UIDashboard }   from './ui/ui.dashboard.js';
import { UIControl }     from './ui/ui.control.js';
import { UIAlertas, UICharts, UINotas, UINav, UITimeline, UIAlertasHistorial } from './ui/ui.modules.js';
import { UIConfig }  from './ui/ui.config.js';
import UIBLE         from './ui/ui.ble.js';

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function animarSplash() {
  const fill = document.getElementById('splashFill');
  const sub  = document.querySelector('.splash-sub');
  const pasos = [
    [25, 'Inicializando...'],
    [55, 'Conectando Firebase...'],
    [85, 'Cargando interfaz...'],
    [100,'Listo'],
  ];
  for (const [pct, msg] of pasos) {
    if (fill) fill.style.width = `${pct}%`;
    if (sub)  sub.textContent  = msg;
    await sleep(350);
  }
}

function mostrarApp() {
  const splash = document.getElementById('splash');
  const appEl  = document.getElementById('app');
  if (splash) splash.classList.add('fade-out');
  setTimeout(() => {
    if (splash) splash.classList.add('hidden');
    if (appEl)  appEl.classList.remove('hidden');
  }, 500);
}

// ── Notificaciones push ───────────────────────────────────────

function _initNotificaciones() {
  const btn = document.getElementById('btnActivarNotif');
  const status = document.getElementById('notifStatus');
  if (!('Notification' in window)) {
    if (btn) btn.disabled = true;
    if (status) status.textContent = 'Estado: no soportado en este navegador';
    return;
  }
  const p = Notification.permission;
  if (status) {
    if (p === 'granted') status.textContent = 'Estado: ✅ activadas';
    else if (p === 'denied') status.textContent = 'Estado: ❌ bloqueadas (activar en config del navegador)';
    else status.textContent = 'Estado: pendiente de activar';
  }
  if (btn) btn.textContent = p === 'granted' ? 'Activadas ✓' : 'Activar notificaciones';
}

function activarNotificaciones() {
  if (!('Notification' in window)) return;
  Notification.requestPermission().then(p => {
    _initNotificaciones();
    if (p === 'granted') {
      import('./utils/toast.js').then(m => m.Toast.success('Notificaciones activadas'));
    }
  });
}
window.activarNotificaciones = activarNotificaciones;

function _enviarNotificacion(alerta) {
  if (Notification.permission !== 'granted') return;
  if (document.visibilityState === 'visible') return; // app abierta, no molestar
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type:   'NOTIFY_ALERTA',
      titulo: 'HidroGanadero — ' + alerta.tipo.replace(/_/g, ' '),
      cuerpo: alerta.mensaje || '',
      nivel:  alerta.nivel,
    });
  } else {
    new Notification('HidroGanadero — ' + alerta.tipo.replace(/_/g,' '), {
      body: alerta.mensaje || '',
      icon: '/public/icons/icon-192.png',
    });
  }
}

async function init() {
  const splashPromise = animarSplash();

  // Config local
  const cfgLocal = JSON.parse(localStorage.getItem('hidro_config') || '{}');
  const deviceId = cfgLocal.deviceId || CONFIG.DEVICE_ID;
  State.setApp({ deviceId });
  if (cfgLocal.umbrales) State.setUmbrales(cfgLocal.umbrales);

  // Módulos UI
  UIDashboard.init();
  UIControl.init();
  UIAlertas.init();
  UICharts.init();
  UINotas.init();
  UIConfig.init();
  UINav.init();
  UITimeline.init();
  UIAlertasHistorial.init();
  UIBLE.init();
  EstadosModule.init();

  // DeviceManager init — carga caché inmediatamente si existe
  DeviceManager.init();

  // Notificaciones push — pedir permiso si ya fue otorgado antes
  _initNotificaciones();

  Router.init();

  // Menú hamburguesa
  document.getElementById('menuToggle')?.addEventListener('click', () => {
    document.getElementById('nav')?.classList.toggle('open');
    document.getElementById('navOverlay')?.classList.toggle('hidden');
  });
  document.getElementById('navOverlay')?.addEventListener('click', () => {
    document.getElementById('nav')?.classList.remove('open');
    document.getElementById('navOverlay')?.classList.add('hidden');
  });

  // Escuchar alertas críticas para notificación push
  State.on('alertas:update', (alertas) => {
    const criticas = alertas.filter(a => !a.resuelta && a.nivel >= 3 && a.ts && (Date.now() - a.ts) < 8000);
    criticas.forEach(a => _enviarNotificacion(a));
  });

  // Firebase
  let fbOk = false;
  try { fbOk = firebaseInit(); } catch(e) {
    console.warn('[App] Firebase no disponible:', e.message);
  }

  if (fbOk) {
    listenLecturas(deviceId);
    listenAlertas(deviceId);
    listenNotas(deviceId);
  } else {
    console.warn('[App] Sin Firebase → simulación');
    State.setApp({ simModeActive: true, deviceOnline: false, dataSource: 'sim' });
    simStart();
  }

  await splashPromise;
  mostrarApp();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => {});
}
