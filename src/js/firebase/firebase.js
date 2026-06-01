/**
 * firebase.js — Comunicación Firebase Realtime Database
 * Compatible con ESP32 firmware v2.1.0
 */

import { initializeApp }         from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getDatabase, ref, onValue, set, get, push, serverTimestamp }
  from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js';
import CONFIG from '../config/app.config.js';
import State  from '../state.js';

let _app = null;
let _db  = null;
let _listeners = {};

export function firebaseInit() {
  try {
    _app = initializeApp(CONFIG.FIREBASE);
    _db  = getDatabase(_app);
    console.log('[Firebase] SDK inicializado');
    return true;
  } catch (e) {
    console.error('[Firebase] Error al inicializar:', e);
    return false;
  }
}

export function getDB() { return _db; }

// ══════════════════════════════════════════════════════
// LISTENERS
// ══════════════════════════════════════════════════════

/**
 * Escucha /dispositivos/{id}/lecturas
 * Si la ruta está vacía (ESP32 aún no conectado) → activa simulación
 * Si llegan datos reales → muestra datos reales y detiene simulación
 */
export function listenLecturas(deviceId) {
  if (!_db) return;
  const ruta = CONFIG.RTDB_PATHS.lecturas(deviceId);

  if (_listeners.lecturas) _listeners.lecturas();

  const r = ref(_db, ruta);
  _listeners.lecturas = onValue(r, (snap) => {

    // ── Sin datos: ESP32 no ha publicado aún ─────────────
    if (!snap.exists()) {
      console.warn('[Firebase] Ruta vacía → simulación activa');
      State.setApp({ deviceOnline: false, firebaseReady: true, simModeActive: true });
      import('../simulators/sim.main.js')
        .then(m => { if (!m.simIsRunning()) m.simStart(); })
        .catch(() => {});
      return;
    }

    // ── Con datos: ESP32 conectado ────────────────────────
    // Si venía en simulación, detenerla
    import('../simulators/sim.main.js')
      .then(m => { if (m.simIsRunning()) m.simStop(); })
      .catch(() => {});

    const d = snap.val();

    State.setDevice({
      deviceId:        d.deviceId        || deviceId,
      nombre:          d.nombre          || '--',
      zona:            d.zona            || '--',
      firmwareVersion: d.firmwareVersion || '--',
      ip:              d.ip              || '--',
      uptime:          d.uptime          || 0,
      rssi:            d.rssi            || 0,
      nivel:           parseFloat(d.nivel       ?? 0),
      temperatura:     parseFloat(d.temperatura ?? 0),
      humedad:         parseFloat(d.humedad     ?? 0),
      turbidez:        parseFloat(d.turbidez    ?? 0),
      turbidezSim:     d.turbidezSim ?? true,
      flujo:           parseFloat(d.flujo       ?? 0),
      flujoSim:        d.flujoSim    ?? true,
      ph:              parseFloat(d.ph          ?? 7.0),
      phSim:           d.phSim       ?? true,
      tds:             parseFloat(d.tds         ?? 0),
      tdsSim:          d.tdsSim      ?? true,
      bomba:           d.bomba         ?? false,
      modo:            d.modo          ?? 'AUTOMATICO',
      estado:          d.estado        ?? 'OFFLINE',
      mantenimiento:   d.mantenimiento ?? false,
      alertasCount:    d.alertasCount  ?? 0,
      wifiConectado:     d.wifiConectado     ?? false,
      firebaseConectado: true,
      online:            true,
      andGateA: d.andGateA ?? false,
      andGateB: d.andGateB ?? false,
      andGateY: d.andGateY ?? false,
    });

    State.setApp({ deviceOnline: true, firebaseReady: true, simModeActive: false });

    State.addHistorial({
      nivel:       parseFloat(d.nivel       ?? 0),
      temperatura: parseFloat(d.temperatura ?? 0),
      turbidez:    parseFloat(d.turbidez    ?? 0),
      ph:          parseFloat(d.ph          ?? 7.0),
    });

  }, (err) => {
    console.error('[Firebase] Error leyendo lecturas:', err);
    State.setApp({ deviceOnline: false });
    State.setDevice({ online: false, estado: 'OFFLINE' });
  });
}

export function listenAlertas(deviceId) {
  if (!_db) return;
  const ruta = CONFIG.RTDB_PATHS.alertas(deviceId);
  if (_listeners.alertas) _listeners.alertas();

  const r = ref(_db, ruta);
  _listeners.alertas = onValue(r, (snap) => {
    if (!snap.exists()) { State.setAlertas([]); return; }
    const raw = snap.val();
    let arr = Array.isArray(raw) ? raw : Object.values(raw);
    arr = arr.filter(Boolean).map((a, i) => ({
      id:      a.timestamp || i,
      tipo:    a.tipo      || 'DESCONOCIDO',
      mensaje: a.mensaje   || '',
      nivel:   a.nivel     || 1,
      activa:  a.activa    ?? true,
      resuelta: false,
      fuente:  'esp32',
      ts:      a.timestamp || Date.now(),
    }));
    State.setAlertas(arr);
  });
}

export function listenNotas(deviceId) {
  if (!_db) return;
  const ruta = CONFIG.RTDB_PATHS.notas(deviceId);
  if (_listeners.notas) _listeners.notas();

  const r = ref(_db, ruta);
  _listeners.notas = onValue(r, (snap) => {
    if (!snap.exists()) { State.setNotas([]); return; }
    const raw = snap.val();
    const arr = Object.entries(raw).map(([k, v]) => ({ id: k, ...v }));
    arr.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    State.setNotas(arr);
  });
}

export async function fbSetBomba(deviceId, encender) {
  if (!_db) return false;
  try {
    const ruta = CONFIG.RTDB_PATHS.comandos(deviceId);
    await set(ref(_db, ruta), {
      bomba:     encender,
      modo_auto: State.device.modo === 'AUTOMATICO',
      timestamp: Date.now(),
    });
    return true;
  } catch (e) {
    console.error('[Firebase] Error comando bomba:', e);
    return false;
  }
}

export async function fbSetModo(deviceId, modoAuto) {
  if (!_db) return false;
  try {
    const ruta = CONFIG.RTDB_PATHS.comandos(deviceId);
    await set(ref(_db, ruta), {
      bomba:     State.device.bomba,
      modo_auto: modoAuto,
      timestamp: Date.now(),
    });
    return true;
  } catch (e) {
    console.error('[Firebase] Error comando modo:', e);
    return false;
  }
}

export async function fbGuardarNota(deviceId, texto, tipo) {
  if (!_db) return false;
  try {
    const ruta = CONFIG.RTDB_PATHS.notas(deviceId);
    await push(ref(_db, ruta), { texto, tipo, timestamp: Date.now() });
    return true;
  } catch (e) {
    console.error('[Firebase] Error guardando nota:', e);
    return false;
  }
}

export async function fbCheckDeviceExists(deviceId) {
  if (!_db) return false;
  try {
    const snap = await get(ref(_db, CONFIG.RTDB_PATHS.lecturas(deviceId)));
    return snap.exists();
  } catch (e) {
    return false;
  }
}

export async function fbGetConfiguracion(deviceId) {
  if (!_db) return null;
  try {
    const snap = await get(ref(_db, CONFIG.RTDB_PATHS.configuracion(deviceId)));
    return snap.exists() ? snap.val() : null;
  } catch (e) {
    return null;
  }
}

export function cancelarListeners() {
  Object.values(_listeners).forEach(unsub => {
    if (typeof unsub === 'function') unsub();
  });
  _listeners = {};
}
