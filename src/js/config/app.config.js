/**
 * app.config.js — Configuración central de la PWA
 * ⚠ ESTE ES EL ÚNICO ARCHIVO QUE DEBES EDITAR
 */

export const CONFIG = {

  APP_NAME:    'HidroGanadero IoT',
  APP_VERSION: '1.1.0',

  // Debe coincidir con #define DEVICE_ID en mod_config.h del ESP32
  DEVICE_ID: 'tanque_001',

  // Credenciales Firebase — ya configuradas con tu proyecto
  FIREBASE: {
    apiKey:            "AIzaSyBFC1JQWS1oRL-06Y9e3hKZ6bDWu4nkRTY",
    authDomain:        "hidrico-f8d4b.firebaseapp.com",
    databaseURL:       "https://hidrico-f8d4b-default-rtdb.firebaseio.com/",
    projectId:         "hidrico-f8d4b",
    storageBucket:     "hidrico-f8d4b.firebasestorage.app",
    messagingSenderId: "367238878834",
    appId:             "1:367238878834:web:8184de3969d2dc809b94eb"
  },

  // Rutas RTDB — deben coincidir con FB_PATH_* en mod_config.h
  RTDB_PATHS: {
    lecturas:     (id) => `/dispositivos/${id}/lecturas`,
    info:         (id) => `/dispositivos/${id}/info`,
    alertas:      (id) => `/alertas/${id}`,
    comandos:     (id) => `/comandos/${id}`,
    configuracion:(id) => `/dispositivos/${id}/configuracion`,
    historial:    (id) => `/historial/${id}`,
    notas:        (id) => `/notas/${id}`,
  },

  UMBRALES: {
    nivel:       { criticoBajo: 15, minimo: 25, maximo: 90, criticoAlto: 95 },
    temperatura: { criticaBaja: 5,  baja: 15,  alta: 35,   criticaAlta: 40 },
    turbidez:    { normal: 5,       precauc: 15,            critica: 30 },
    ph:          { minimo: 6.0,     maximo: 8.5 },
    tds:         { maximo: 500 },
    flujo:       { minimo: 2,       maximo: 25 }
  },

  WATCHDOG_INTERVAL:  15000,
  HISTORIAL_INTERVAL: 30000,
  CHART_MAX_POINTS:   60,
  SIM_INTERVAL:       3000,
};

export default CONFIG;
