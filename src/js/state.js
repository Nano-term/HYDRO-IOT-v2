/**
 * state.js v2.0 — Estado global reactivo
 * Agrega: caché offline, modo BLE, sim por módulo, último timestamp
 */

import CONFIG from './config/app.config.js';

const _listeners = {};
let _deviceId = localStorage.getItem('deviceId') || CONFIG.DEVICE_ID;

// ── Caché de último dato conocido ────────────────────────────
const CACHE_KEY = 'hidro_last_data';

function _saveCache(device) {
  try {
    const cache = {
      data: { ...device },
      ts:   Date.now(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch(e) {}
}

function _loadCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch(e) { return null; }
}

// ── Sim por módulo (persiste en localStorage) ────────────────
const SIM_MODULES_KEY = 'hidro_sim_modules';

function _loadSimModules() {
  try {
    const raw = localStorage.getItem(SIM_MODULES_KEY);
    return raw ? JSON.parse(raw) : {
      nivel:       false,
      temperatura: false,
      humedad:     false,
      turbidez:    false,
      flujo:       false,
      ph:          false,
      tds:         false,
    };
  } catch(e) {
    return { nivel:false, temperatura:false, humedad:false,
             turbidez:false, flujo:false, ph:false, tds:false };
  }
}

function _saveSimModules(mods) {
  try { localStorage.setItem(SIM_MODULES_KEY, JSON.stringify(mods)); } catch(e) {}
}

const State = {

  // ── Datos del dispositivo ──────────────────────────────────
  _lastDataTs: null,
  device: {
    deviceId:        _deviceId,
    nombre:          'Tanque Principal',
    zona:            'Zona A',
    firmwareVersion: '--',
    ip:              '--',
    uptime:          0,
    rssi:            0,
    nivel:           0,
    temperatura:     0,
    humedad:         0,
    turbidez:        0,
    turbidezSim:     true,
    flujo:           0,
    flujoSim:        true,
    ph:              7.0,
    phSim:           true,
    tds:             0,
    tdsSim:          true,
    bomba:           false,
    modo:            'AUTOMATICO',
    estado:          'OFFLINE',
    mantenimiento:   false,
    alertasCount:    0,
    wifiConectado:   false,
    firebaseConectado: false,
    online:          false,
    ultimaLectura:   null,
  },

  // ── Estado de la app ──────────────────────────────────────
  app: {
    deviceOnline:    false,
    simModeActive:   false,   // sim completa (todos los módulos)
    simModules:      _loadSimModules(), // sim por módulo individual
    firebaseReady:   false,
    bleMode:         false,   // true = fuente de datos es BLE, no Firebase
    bleConnected:    false,
    currentPage:     'dashboard',
    deviceId:        _deviceId,
    lastDataTs:      null,    // timestamp del último dato real recibido
    dataSource:      'none',  // 'firebase' | 'ble' | 'sim' | 'cache' | 'none'
  },

  // ── Caché último dato conocido ────────────────────────────
  lastKnownData:   _loadCache(),

  alertas:  [],
  historial: [],
  notas:    [],
  umbrales: { ...CONFIG.UMBRALES },

  // ─────────────────────────────────────────────────────────
  // API PÚBLICA
  // ─────────────────────────────────────────────────────────

  setDevice(datos) {
    const antes = { ...this.device };
    Object.assign(this.device, datos);
    this.device.ultimaLectura = new Date();
    this.app.lastDataTs = Date.now();

    // Guardar caché si datos son reales (no simulados completos)
    if (!this.app.simModeActive) {
      _saveCache(this.device);
      this.lastKnownData = { data: { ...this.device }, ts: Date.now() };
    }

    this.emit('device:update', this.device);
    if (datos.estado && datos.estado !== antes.estado) this.emit('estado:change', datos.estado);
    if (datos.bomba !== undefined && datos.bomba !== antes.bomba) this.emit('bomba:change', datos.bomba);
  },

  setApp(datos) {
    Object.assign(this.app, datos);
    this.emit('app:update', this.app);
  },

  // ── Sim por módulo ────────────────────────────────────────

  /** Activa/desactiva simulación de un módulo individual */
  setSimModule(sensor, activo) {
    this.app.simModules[sensor] = activo;
    _saveSimModules(this.app.simModules);
    this.emit('simModules:update', this.app.simModules);
  },

  /** ¿Está simulado este sensor? (sim completa O sim por módulo) */
  isSensorSim(sensor) {
    return this.app.simModeActive || this.app.simModules[sensor] === true;
  },

  // ── Caché ─────────────────────────────────────────────────

  /** Carga el último dato conocido al State.device */
  cargarDesdeCache() {
    const cache = _loadCache();
    if (!cache) return false;
    this.lastKnownData = cache;
    // Cargar al device sin emitir — solo para mostrar en UI
    Object.assign(this.device, cache.data);
    this.device.online = false;
    this.device.estado = 'OFFLINE';
    this.app.lastDataTs = cache.ts;
    this.app.dataSource = 'cache';
    this.emit('device:update', this.device);
    this.emit('app:update', this.app);
    return true;
  },

  // ── Alertas ───────────────────────────────────────────────

  setAlertas(arr) {
    this.alertas = arr || [];
    this.emit('alertas:update', this.alertas);
  },

  addAlerta(alerta) {
    const existe = this.alertas.find(a => a.tipo === alerta.tipo && !a.resuelta);
    if (existe) return;
    this.alertas.unshift({ ...alerta, id: Date.now(), resuelta: false });
    this.emit('alertas:update', this.alertas);
  },

  resolverAlerta(id) {
    const idx = this.alertas.findIndex(a => a.id === id || a.tipo === id);
    if (idx >= 0) { this.alertas[idx].resuelta = true; this.emit('alertas:update', this.alertas); }
  },

  addHistorial(punto) {
    this.historial.push({ ...punto, ts: Date.now() });
    if (this.historial.length > CONFIG.CHART_MAX_POINTS) this.historial.shift();
    this.emit('historial:update', this.historial);
  },

  setNotas(arr) { this.notas = arr || []; this.emit('notas:update', this.notas); },
  addNota(nota) { this.notas.unshift(nota); this.emit('notas:update', this.notas); },
  setUmbrales(u) { Object.assign(this.umbrales, u); this.emit('umbrales:update', this.umbrales); },

  // ── Pub/Sub ───────────────────────────────────────────────

  on(evento, cb) {
    if (!_listeners[evento]) _listeners[evento] = [];
    _listeners[evento].push(cb);
  },

  off(evento, cb) {
    if (!_listeners[evento]) return;
    _listeners[evento] = _listeners[evento].filter(f => f !== cb);
  },

  emit(evento, datos) {
    (_listeners[evento] || []).forEach(cb => {
      try { cb(datos); } catch(e) { console.error(`[State] '${evento}':`, e); }
    });
  },

  // ── Helpers ───────────────────────────────────────────────
  getDeviceId()    { return this.app.deviceId; },
  isOnline()       { return this.app.deviceOnline; },
  isSimMode()      { return this.app.simModeActive; },
  isBleMode()      { return this.app.bleMode; },
  getAlertas()     { return this.alertas.filter(a => !a.resuelta); },
  getLastDataAge() {
    if (!this.app.lastDataTs) return null;
    return Math.floor((Date.now() - this.app.lastDataTs) / 1000);
  },
};

export default State;