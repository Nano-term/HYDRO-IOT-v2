/**
 * device.manager.js v2.0
 * Gestiona transiciones entre modos: Firebase ↔ BLE ↔ Simulación
 */

import State              from '../state.js';
import CONFIG             from '../config/app.config.js';
import { fbSetBomba, fbSetModo } from '../firebase/firebase.js';
import { simStart, simStop, simSetBomba, simSetModo, simSyncFromDevice, simIsRunning }
                          from '../simulators/sim.main.js';
import BLEManager         from '../bluetooth/ble.manager.js';

let _watchdogTimer   = null;
let _lastSeenOnline  = 0;
const OFFLINE_THRESHOLD = 30000;

export const DeviceManager = {

  init() {
    State.on('device:update', () => {
      if (!State.isSimMode() && !State.isBleMode()) {
        _lastSeenOnline = Date.now();
      }
    });

    // Watchdog: si pasan 30s sin datos Firebase → caché + sim
    _watchdogTimer = setInterval(() => this._watchdog(), CONFIG.WATCHDOG_INTERVAL);

    // Cargar caché inmediatamente si hay datos guardados
    const cargado = State.cargarDesdeCache();
    if (cargado) {
      console.log('[DeviceManager] Caché cargada:', new Date(State.lastKnownData?.ts));
    }
  },

  _watchdog() {
    const ahora    = Date.now();
    const sinDatos = ahora - _lastSeenOnline;

    if (_lastSeenOnline > 0 && sinDatos > OFFLINE_THRESHOLD) {
      if (!State.isSimMode() && !State.isBleMode()) {
        console.warn('[DeviceManager] Sin datos >30s → activando simulación');
        State.setApp({ deviceOnline: false, simModeActive: true, dataSource: 'sim' });
        State.setDevice({ online: false, estado: 'OFFLINE' });
        simSyncFromDevice(); // continuar desde últimos valores conocidos
        simStart();
      }
    }
  },

  // ── Modo Firebase (default) ──────────────────────────────

  activarModoFirebase() {
    simStop();
    State.setApp({ simModeActive: false, bleMode: false, bleConnected: false, dataSource: 'firebase' });
    console.log('[DeviceManager] Modo Firebase activado');
  },

  // ── Modo Simulación completa ─────────────────────────────

  activarSim() {
    simSyncFromDevice();
    simStart();
    State.setApp({ simModeActive: true, bleMode: false, dataSource: 'sim' });
  },

  desactivarSim() {
    simStop();
    State.setApp({ simModeActive: false, dataSource: 'firebase' });
    _lastSeenOnline = 0; // resetear watchdog
  },

  // ── Modo BLE ─────────────────────────────────────────────

  async activarModoBLE() {
    if (!BLEManager.isSupported()) {
      throw new Error('Web Bluetooth no disponible en este navegador');
    }

    // Pausar simulación si estaba activa
    const eraSimMode = State.isSimMode();
    if (eraSimMode) simStop();

    try {
      const result = await BLEManager.conectar(
        (data) => this._onBLEData(data),
        (status) => this._onBLEStatus(status)
      );

      State.setApp({
        bleMode:      true,
        bleConnected: true,
        simModeActive: false,
        dataSource:   'ble',
        deviceOnline: true,
      });

      console.log('[DeviceManager] BLE conectado:', result.nombre);
      return result;

    } catch(e) {
      // Restaurar sim si estaba activa
      if (eraSimMode) simStart();
      throw e;
    }
  },

  desactivarModoBLE() {
    BLEManager.desconectar();
    State.setApp({
      bleMode:      false,
      bleConnected: false,
      deviceOnline: false,
      dataSource:   'firebase',
    });
    _lastSeenOnline = 0;
    console.log('[DeviceManager] BLE desconectado, volviendo a Firebase');
  },

  _onBLEData(data) {
    // data = { n: nivel, t: temp, h: hum, b: bomba, m: modo, s: estado }
    const mods = State.app.simModules;

    State.setDevice({
      nivel:       mods.nivel       ? State.device.nivel       : (parseFloat(data.n) || 0),
      temperatura: mods.temperatura ? State.device.temperatura : (parseFloat(data.t) || 0),
      humedad:     mods.humedad     ? State.device.humedad     : (parseFloat(data.h) || 0),
      bomba:       data.b === 1 || data.b === true,
      modo:        data.m === 'A' ? 'AUTOMATICO' : 'MANUAL',
      estado:      data.s || 'NORMAL',
      online:      true,
      wifiConectado: false,
      firebaseConectado: false,
    });

    State.setApp({ deviceOnline: true, dataSource: 'ble' });

    State.addHistorial({
      nivel:       parseFloat(data.n) || 0,
      temperatura: parseFloat(data.t) || 0,
      turbidez:    State.device.turbidez,
      ph:          State.device.ph,
    });
  },

  _onBLEStatus(status) {
    if (status === 'DESCONECTADO') {
      State.setApp({ bleConnected: false, deviceOnline: false, dataSource: 'cache' });
    }
  },

  // ── Comandos ─────────────────────────────────────────────

  async setBomba(encender) {
    const deviceId = State.getDeviceId();

    if (State.isSimMode()) {
      simSetBomba(encender);
      State.setDevice({ bomba: encender });
      return { ok: true, fuente: 'sim' };
    }

    if (State.isBleMode()) {
      try {
        await BLEManager.enviarBomba(encender);
        State.setDevice({ bomba: encender });
        return { ok: true, fuente: 'ble' };
      } catch(e) {
        return { ok: false, error: e.message };
      }
    }

    if (!State.device.andGateY) {
      return { ok: false, error: 'AND gate OFF — WiFi o Firebase no disponibles' };
    }
    const ok = await fbSetBomba(deviceId, encender);
    if (ok) State.setDevice({ bomba: encender });
    return { ok, fuente: 'firebase' };
  },

  async setModo(modoAuto) {
    const deviceId = State.getDeviceId();

    if (State.isSimMode()) {
      simSetModo(modoAuto);
      State.setDevice({ modo: modoAuto ? 'AUTOMATICO' : 'MANUAL' });
      return { ok: true, fuente: 'sim' };
    }

    if (State.isBleMode()) {
      try {
        await BLEManager.enviarModo(modoAuto);
        State.setDevice({ modo: modoAuto ? 'AUTOMATICO' : 'MANUAL' });
        return { ok: true, fuente: 'ble' };
      } catch(e) {
        return { ok: false, error: e.message };
      }
    }

    const ok = await fbSetModo(deviceId, modoAuto);
    if (ok) State.setDevice({ modo: modoAuto ? 'AUTOMATICO' : 'MANUAL' });
    return { ok, fuente: 'firebase' };
  },

  destroy() {
    if (_watchdogTimer) clearInterval(_watchdogTimer);
  }
};

export default DeviceManager;
