/**
 * sim.main.js — Simuladores locales de la PWA
 * Se activan cuando el ESP32 no tiene señal o no está conectado.
 * Generan datos realistas para demostración del dashboard.
 */

import State  from '../state.js';
import CONFIG from '../config/app.config.js';

let _timer = null;
let _t     = 0;  // tiempo acumulado en segundos

// Estado interno de simulación
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

function ruido(amp) {
  return (Math.random() - 0.5) * 2 * amp;
}

function tick() {
  _t += CONFIG.SIM_INTERVAL / 1000;

  // Física del tanque simulado
  if (SIM.modo === 'AUTOMATICO') {
    if (SIM.nivel < CONFIG.UMBRALES.nivel.minimo) {
      SIM.bomba = true;
    }
    if (SIM.nivel > CONFIG.UMBRALES.nivel.maximo) {
      SIM.bomba = false;
    }
  }

  // Nivel: sube si bomba ON, baja por consumo natural
  if (SIM.bomba) {
    SIM.nivel += 0.4 + ruido(0.1);
    SIM.flujo  = 8.5 + ruido(0.8);
  } else {
    SIM.nivel -= 0.2 + ruido(0.05);
    SIM.flujo  = ruido(0.3);
  }
  SIM.nivel = Math.max(2, Math.min(98, SIM.nivel));
  SIM.flujo = Math.max(0, SIM.flujo);

  // Temperatura: ciclo diurno suave
  SIM.temperatura = 27 + 5 * Math.sin(_t / 120) + ruido(0.4);

  // Humedad: inversamente relacionada con temp
  SIM.humedad = 60 - 8 * Math.sin(_t / 120) + ruido(1.0);
  SIM.humedad = Math.max(20, Math.min(95, SIM.humedad));

  // Turbidez: ocasionalmente sube
  SIM.turbidez += ruido(0.3);
  if (Math.random() < 0.02) SIM.turbidez += 3; // evento esporádico
  SIM.turbidez = Math.max(0.5, Math.min(28, SIM.turbidez));

  // pH: varía lentamente
  SIM.ph += ruido(0.03);
  SIM.ph = Math.max(5.5, Math.min(9.0, SIM.ph));

  // TDS: varía con temperatura
  SIM.tds = 310 + SIM.temperatura * 2 + ruido(8);
  SIM.tds = Math.max(100, Math.min(600, SIM.tds));

  // Estado
  SIM.estado = calcEstado();

  // Publicar al State (igual que haría Firebase)
  State.setDevice({
    deviceId:        State.getDeviceId(),
    nombre:          'Tanque Principal (SIM)',
    zona:            'Zona A',
    firmwareVersion: 'SIM',
    ip:              '-- simulado --',
    uptime:          Math.floor(_t),
    rssi:            -65,

    nivel:       +SIM.nivel.toFixed(1),
    temperatura: +SIM.temperatura.toFixed(1),
    humedad:     +SIM.humedad.toFixed(1),

    turbidez:    +SIM.turbidez.toFixed(1),
    turbidezSim: true,
    flujo:       +SIM.flujo.toFixed(1),
    flujoSim:    true,
    ph:          +SIM.ph.toFixed(2),
    phSim:       true,
    tds:         +SIM.tds.toFixed(0),
    tdsSim:      true,

    bomba:             SIM.bomba,
    modo:              SIM.modo,
    estado:            SIM.estado,
    mantenimiento:     false,
    wifiConectado:     false,
    firebaseConectado: false,
    online:            false,

    andGateA: false,
    andGateB: false,
    andGateY: false,
  });

  State.addHistorial({
    nivel:       +SIM.nivel.toFixed(1),
    temperatura: +SIM.temperatura.toFixed(1),
    turbidez:    +SIM.turbidez.toFixed(1),
    ph:          +SIM.ph.toFixed(2),
  });
}

function calcEstado() {
  const u = CONFIG.UMBRALES;
  if (SIM.nivel  <= u.nivel.criticoBajo  ||
      SIM.nivel  >= u.nivel.criticoAlto  ||
      SIM.temperatura >= u.temperatura.criticaAlta) return 'CRITICO';
  if (SIM.nivel  < u.nivel.minimo        ||
      SIM.nivel  > u.nivel.maximo        ||
      SIM.temperatura >= u.temperatura.alta ||
      SIM.turbidez >= u.turbidez.critica ||
      SIM.ph < u.ph.minimo               ||
      SIM.ph > u.ph.maximo) return 'ALERTA';
  if (SIM.turbidez >= u.turbidez.precauc ||
      SIM.temperatura >= u.temperatura.baja) return 'PRECAUCION';
  return 'NORMAL';
}

// ─── API pública ────────────────────────────────────────
export function simStart() {
  if (_timer) return;
  _t = 0;
  tick(); // primera lectura inmediata
  _timer = setInterval(tick, CONFIG.SIM_INTERVAL);
  console.log('[SIM] Simuladores iniciados');
}

export function simStop() {
  if (_timer) { clearInterval(_timer); _timer = null; }
  console.log('[SIM] Simuladores detenidos');
}

export function simIsRunning() { return _timer !== null; }

/** Permite a UIControl modificar la bomba simulada */
export function simSetBomba(encender) {
  SIM.bomba = encender;
}

/** Permite cambiar el modo simulado */
export function simSetModo(modoAuto) {
  SIM.modo = modoAuto ? 'AUTOMATICO' : 'MANUAL';
}
