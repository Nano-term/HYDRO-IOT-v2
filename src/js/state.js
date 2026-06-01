/**
 * state.js — Estado global reactivo (pub/sub)
 * Única fuente de verdad de la PWA.
 * Todos los módulos UI leen de aquí y reaccionan a eventos.
 */

import CONFIG from './config/app.config.js';

const _listeners = {};
let _deviceId = localStorage.getItem('deviceId') || CONFIG.DEVICE_ID;

const State = {

  // ── Datos del dispositivo ────────────────────────────
  device: {
    // Identificación
    deviceId:        _deviceId,
    nombre:          'Tanque Principal',
    zona:            'Zona A',
    firmwareVersion: '--',
    ip:              '--',
    uptime:          0,
    rssi:            0,

    // Sensores físicos (del ESP32)
    nivel:       0,
    temperatura: 0,
    humedad:     0,

    // Sensores simulados en ESP32 (campos planos del RTDB)
    turbidez:    0,
    turbidezSim: true,
    flujo:       0,
    flujoSim:    true,
    ph:          7.0,
    phSim:       true,
    tds:         0,
    tdsSim:      true,

    // Control
    bomba:        false,
    modo:         'AUTOMATICO',    // "AUTOMATICO" | "MANUAL"
    estado:       'OFFLINE',
    mantenimiento: false,
    alertasCount:  0,

    // Conectividad
    wifiConectado:     false,
    firebaseConectado: false,
    online:            false,

    // AND Gate
    andGateA: false,
    andGateB: false,
    andGateY: false,

    // Timestamps
    ultimaLectura: null,
  },

  // ── Estado de la app ─────────────────────────────────
  app: {
    deviceOnline:    false,
    simModeActive:   false,  // true = usar simuladores locales
    firebaseReady:   false,
    currentPage:     'dashboard',
    deviceId:        _deviceId,
  },

  // ── Alertas ──────────────────────────────────────────
  alertas: [],

  // ── Historial local ───────────────────────────────────
  historial: [],

  // ── Notas ────────────────────────────────────────────
  notas: [],

  // ── Umbrales activos ─────────────────────────────────
  umbrales: { ...CONFIG.UMBRALES },

  // ─────────────────────────────────────────────────────
  // API PÚBLICA
  // ─────────────────────────────────────────────────────

  /** Actualiza datos del dispositivo y emite evento */
  setDevice(datos) {
    const antes = { ...this.device };
    Object.assign(this.device, datos);
    this.device.ultimaLectura = new Date();
    this.emit('device:update', this.device);

    // Emitir evento de cambio de estado si cambió
    if (datos.estado && datos.estado !== antes.estado) {
      this.emit('estado:change', datos.estado);
    }
    if (datos.bomba !== undefined && datos.bomba !== antes.bomba) {
      this.emit('bomba:change', datos.bomba);
    }
  },

  /** Actualiza estado de la app */
  setApp(datos) {
    Object.assign(this.app, datos);
    this.emit('app:update', this.app);
  },

  /** Reemplaza las alertas activas */
  setAlertas(arr) {
    this.alertas = arr || [];
    this.emit('alertas:update', this.alertas);
  },

  /** Agrega una alerta generada localmente */
  addAlerta(alerta) {
    // Evitar duplicados por tipo
    const existe = this.alertas.find(a => a.tipo === alerta.tipo && !a.resuelta);
    if (existe) return;
    this.alertas.unshift({ ...alerta, id: Date.now(), resuelta: false });
    this.emit('alertas:update', this.alertas);
  },

  /** Marca una alerta como resuelta */
  resolverAlerta(id) {
    const idx = this.alertas.findIndex(a => a.id === id || a.tipo === id);
    if (idx >= 0) {
      this.alertas[idx].resuelta = true;
      this.emit('alertas:update', this.alertas);
    }
  },

  /** Agrega un punto al historial */
  addHistorial(punto) {
    this.historial.push({ ...punto, ts: Date.now() });
    if (this.historial.length > CONFIG.CHART_MAX_POINTS) {
      this.historial.shift();
    }
    this.emit('historial:update', this.historial);
  },

  /** Setea las notas */
  setNotas(arr) {
    this.notas = arr || [];
    this.emit('notas:update', this.notas);
  },

  addNota(nota) {
    this.notas.unshift(nota);
    this.emit('notas:update', this.notas);
  },

  /** Actualiza umbrales */
  setUmbrales(u) {
    Object.assign(this.umbrales, u);
    this.emit('umbrales:update', this.umbrales);
  },

  // ─────────────────────────────────────────────────────
  // PUB / SUB
  // ─────────────────────────────────────────────────────

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
      try { cb(datos); }
      catch(e) { console.error(`[State] Error en listener '${evento}':`, e); }
    });
  },

  // ─── Helpers ─────────────────────────────────────────
  getDeviceId() { return this.app.deviceId; },
  isOnline()    { return this.app.deviceOnline; },
  isSimMode()   { return this.app.simModeActive; },
  getAlertas()  { return this.alertas.filter(a => !a.resuelta); },
};

export default State;
