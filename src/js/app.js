/**
 * app.js — Punto de entrada principal de la PWA
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
import { UIAlertas, UICharts, UINotas, UIConfig, UINav } from './ui/ui.modules.js';
import UIBLE from './ui/ui.ble.js';

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// ── Splash ────────────────────────────────────────────────────
async function animarSplash() {
  const fill = document.getElementById('splashFill');
  const sub  = document.querySelector('.splash-sub');
  const pasos = [
    [25,  'Inicializando...'],
    [55,  'Conectando Firebase...'],
    [85,  'Cargando interfaz...'],
    [100, 'Listo'],
  ];
  for (const [pct, msg] of pasos) {
    if (fill) fill.style.width = `${pct}%`;
    if (sub)  sub.textContent  = msg;
    await sleep(350);
  }
}

// ── Mostrar app — SIEMPRE se llama, pase lo que pase ─────────
function mostrarApp() {
  const splash = document.getElementById('splash');
  const appEl  = document.getElementById('app');
  if (splash) splash.classList.add('fade-out');
  setTimeout(() => {
    if (splash) splash.classList.add('hidden');
    if (appEl)  appEl.classList.remove('hidden');
  }, 500);
}

// ── Inicialización ────────────────────────────────────────────
async function init() {

  // Splash corre en paralelo — no bloquea nada
  const splashPromise = animarSplash();

  // Config guardada localmente
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
  UIBLE.init();
  EstadosModule.init();
  DeviceManager.init();
  Router.init();

  // Menú hamburguesa (mobile)
  document.getElementById('menuToggle')?.addEventListener('click', () => {
    document.getElementById('nav')?.classList.toggle('open');
    document.getElementById('navOverlay')?.classList.toggle('hidden');
  });
  document.getElementById('navOverlay')?.addEventListener('click', () => {
    document.getElementById('nav')?.classList.remove('open');
    document.getElementById('navOverlay')?.classList.add('hidden');
  });

  // Firebase
  // listenLecturas maneja internamente si hay datos o no:
  //   - Con datos    → muestra datos reales del ESP32
  //   - Sin datos    → activa simulación automáticamente
  //   - Sin Firebase → simulación
  let fbOk = false;
  try {
    fbOk = firebaseInit();
  } catch(e) {
    console.warn('[App] Firebase no disponible:', e.message);
  }

  if (fbOk) {
    // Registrar listeners — ellos deciden si simular o no
    listenLecturas(deviceId);
    listenAlertas(deviceId);
    listenNotas(deviceId);
  } else {
    // Sin Firebase → simulación directa
    console.warn('[App] Sin Firebase → simulación');
    State.setApp({ simModeActive: true, deviceOnline: false });
    simStart();
  }

  // Esperar splash y mostrar app — SIEMPRE
  await splashPromise;
  mostrarApp();
}

// Arrancar
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => {});
}
