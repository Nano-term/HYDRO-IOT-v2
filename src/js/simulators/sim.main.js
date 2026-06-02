/**
 * sim.main.js v2.0 — Simuladores locales con soporte por módulo
 * Modo completo: simula todo
 * Modo por módulo: solo simula los sensores marcados en State.app.simModules
 */

import State  from '../state.js';
import CONFIG from '../config/app.config.js';

let _timer = null;
let _t     = 0;

const SIM = {
  nivel:       65.0,
  temperatura: 27.0,
  humedad:     62.0,
  turbidez:    4.5,
  flujo:       0.0,
  ph:          7.2,
  tds:         310.0,
  bomba:       false,
  modo:        'AUTOMATICO',
  estado:      'NORMAL',
};

function ruido(amp) { return (Math.random() - 0.5) * 2 * amp; }

function tick() {
  _t += CONFIG.SIM_INTERVAL / 1000;

  // Física del tanque
  if (SIM.modo === 'AUTOMATICO') {
    if (SIM.nivel < CONFIG.UMBRALES.nivel.minimo)  SIM.bomba = true;
    if (SIM.nivel > CONFIG.UMBRALES.nivel.maximo)  SIM.bomba = false;
  }

  // Actualizar valores simulados
  if (SIM.bomba) {
    SIM.nivel += 0.4 + ruido(0.1);
    SIM.flujo  = 8.5 + ruido(0.8);
  } else {
    SIM.nivel -= 0.2 + ruido(0.05);
    SIM.flujo  = Math.max(0, ruido(0.3));
  }
  SIM.nivel       = Math.max(2, Math.min(98, SIM.nivel));
  SIM.temperatura = 27 + 5 * Math.sin(_t / 120) + ruido(0.4);
  SIM.humedad     = Math.max(20, Math.min(95, 60 - 8 * Math.sin(_t / 120) + ruido(1.0)));
  SIM.turbidez    = Math.max(0.5, Math.min(28, SIM.turbidez + ruido(0.3) + (Math.random() < 0.02 ? 3 : 0)));
  SIM.ph          = Math.max(5.5, Math.min(9.0, SIM.ph + ruido(0.03)));
  SIM.tds         = Math.max(100, Math.min(600, 310 + SIM.temperatura * 2 + ruido(8)));
  SIM.estado      = _calcEstado();

  // ── Construir datos mezclando real + simulado por módulo ──
  const mods = State.app.simModules;
  const d    = State.device; // datos reales actuales

  const update = {
    deviceId:        State.getDeviceId(),
    nombre:          State.app.simModeActive ? 'Tanque Principal (SIM)' : (d.nombre || '--'),
    zona:            d.zona || 'Zona A',
    firmwareVersion: State.app.simModeActive ? 'SIM' : (d.firmwareVersion || '--'),
    ip:              State.app.simModeActive ? '-- simulado --' : (d.ip || '--'),
    uptime:          State.app.simModeActive ? Math.floor(_t) : (d.uptime || 0),
    rssi:            State.app.simModeActive ? -65 : (d.rssi || 0),

    // Sensores: usar simulado si modo completo O módulo individual activado
    nivel:       State.isSensorSim('nivel')       ? +SIM.nivel.toFixed(1)       : d.nivel,
    temperatura: State.isSensorSim('temperatura') ? +SIM.temperatura.toFixed(1) : d.temperatura,
    humedad:     State.isSensorSim('humedad')     ? +SIM.humedad.toFixed(1)     : d.humedad,

    turbidez:    State.isSensorSim('turbidez')    ? +SIM.turbidez.toFixed(1)    : d.turbidez,
    turbidezSim: State.isSensorSim('turbidez'),
    flujo:       State.isSensorSim('flujo')       ? +SIM.flujo.toFixed(1)       : d.flujo,
    flujoSim:    State.isSensorSim('flujo'),
    ph:          State.isSensorSim('ph')          ? +SIM.ph.toFixed(2)          : d.ph,
    phSim:       State.isSensorSim('ph'),
    tds:         State.isSensorSim('tds')         ? +SIM.tds.toFixed(0)         : d.tds,
    tdsSim:      State.isSensorSim('tds'),

    bomba:             SIM.bomba,
    modo:              SIM.modo,
    estado:            SIM.estado,
    mantenimiento:     false,
    wifiConectado:     false,
    firebaseConectado: false,
    online:            false,
    andGateA:          false,
    andGateB:          false,
    andGateY:          false,
  };

  State.setDevice(update);
  State.addHistorial({
    nivel:       update.nivel,
    temperatura: update.temperatura,
    turbidez:    update.turbidez,
    ph:          update.ph,
  });
}

function _calcEstado() {
  const u = CONFIG.UMBRALES;
  if (SIM.nivel <= u.nivel.criticoBajo || SIM.nivel >= u.nivel.criticoAlto ||
      SIM.temperatura >= u.temperatura.criticaAlta) return 'CRITICO';
  if (SIM.nivel < u.nivel.minimo || SIM.nivel > u.nivel.maximo ||
      SIM.temperatura >= u.temperatura.alta ||
      SIM.turbidez >= u.turbidez.critica ||
      SIM.ph < u.ph.minimo || SIM.ph > u.ph.maximo) return 'ALERTA';
  if (SIM.turbidez >= u.turbidez.precauc ||
      SIM.temperatura >= u.temperatura.baja) return 'PRECAUCION';
  return 'NORMAL';
}

export function simStart() {
  if (_timer) return;
  _t = 0;
  tick();
  _timer = setInterval(tick, CONFIG.SIM_INTERVAL);
  console.log('[SIM] Iniciados');
}

export function simStop() {
  if (_timer) { clearInterval(_timer); _timer = null; }
  console.log('[SIM] Detenidos');
}

export function simIsRunning() { return _timer !== null; }
export function simSetBomba(v) { SIM.bomba = v; }
export function simSetModo(auto) { SIM.modo = auto ? 'AUTOMATICO' : 'MANUAL'; }

/** Actualiza SIM con los valores reales actuales (para continuar desde donde estaba) */
export function simSyncFromDevice() {
  const d = State.device;
  if (d.nivel       > 0) SIM.nivel       = d.nivel;
  if (d.temperatura > 0) SIM.temperatura = d.temperatura;
  if (d.humedad     > 0) SIM.humedad     = d.humedad;
  if (d.turbidez    > 0) SIM.turbidez    = d.turbidez;
  if (d.ph          > 0) SIM.ph          = d.ph;
  if (d.tds         > 0) SIM.tds         = d.tds;
  SIM.bomba = d.bomba;
  SIM.modo  = d.modo || 'AUTOMATICO';
}
