/**
 * device.manager.js — Gestión del dispositivo
 * Watchdog de conectividad + despachador de comandos
 */

import State              from '../state.js';
import CONFIG             from '../config/app.config.js';
import { fbSetBomba, fbSetModo, fbCheckDeviceExists } from '../firebase/firebase.js';
import { simStart, simStop, simSetBomba, simSetModo } from '../simulators/sim.main.js';

let _watchdogTimer = null;
let _lastSeenOnline = 0;
const OFFLINE_THRESHOLD = 30000; // ms sin datos → considerar offline

export const DeviceManager = {

  init() {
    // Monitorear cuándo llegan datos reales
    State.on('device:update', () => {
      _lastSeenOnline = Date.now();
    });

    // Watchdog: si pasan 30s sin datos, activar simulación
    _watchdogTimer = setInterval(() => this._watchdog(), CONFIG.WATCHDOG_INTERVAL);
  },

  _watchdog() {
    const ahora = Date.now();
    const sinDatos = ahora - _lastSeenOnline;

    if (_lastSeenOnline > 0 && sinDatos > OFFLINE_THRESHOLD) {
      // ESP32 sin datos → modo offline + simulación
      if (!State.isSimMode()) {
        console.warn('[DeviceManager] ESP32 offline. Activando simulación.');
        State.setApp({ deviceOnline: false, simModeActive: true });
        State.setDevice({ online: false, estado: 'OFFLINE', wifiConectado: false });
        simStart();
      }
    }
  },

  /** Activa modo sim manualmente */
  activarSim() {
    State.setApp({ simModeActive: true, deviceOnline: false });
    simStart();
  },

  /** Desactiva modo sim y vuelve a Firebase */
  desactivarSim() {
    simStop();
    State.setApp({ simModeActive: false });
  },

  /** Envía comando de bomba (Firebase o simulador) */
  async setBomba(encender) {
    const deviceId = State.getDeviceId();

    if (State.isSimMode()) {
      simSetBomba(encender);
      State.setDevice({ bomba: encender });
      return { ok: true, fuente: 'sim' };
    }

    // Verificar AND gate antes de enviar
    if (!State.device.andGateY && !State.isSimMode()) {
      const msg = 'Control bloqueado: WiFi o Firebase no disponibles (AND gate = 0)';
      console.warn('[DeviceManager]', msg);
      return { ok: false, error: msg };
    }

    const ok = await fbSetBomba(deviceId, encender);
    if (ok) {
      // Optimistic update
      State.setDevice({ bomba: encender });
    }
    return { ok, fuente: 'firebase' };
  },

  /** Envía comando de modo */
  async setModo(modoAuto) {
    const deviceId = State.getDeviceId();

    if (State.isSimMode()) {
      simSetModo(modoAuto);
      State.setDevice({ modo: modoAuto ? 'AUTOMATICO' : 'MANUAL' });
      return { ok: true, fuente: 'sim' };
    }

    const ok = await fbSetModo(deviceId, modoAuto);
    if (ok) {
      State.setDevice({ modo: modoAuto ? 'AUTOMATICO' : 'MANUAL' });
    }
    return { ok, fuente: 'firebase' };
  },

  destroy() {
    if (_watchdogTimer) clearInterval(_watchdogTimer);
  }
};

export default DeviceManager;
