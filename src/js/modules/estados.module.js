/**
 * estados.module.js — Motor de evaluación de estados y alertas
 * Se ejecuta cada vez que llegan datos nuevos del dispositivo.
 */

import State  from '../state.js';
import CONFIG from '../config/app.config.js';

export const EstadosModule = {

  init() {
    State.on('device:update', (device) => this._evaluar(device));
  },

  _evaluar(d) {
    const u = State.umbrales;

    // Nivel
    if (d.nivel <= u.nivel.criticoBajo) {
      State.addAlerta({ tipo: 'NIVEL_BAJO', mensaje: `Nivel crítico: ${d.nivel}%`, nivel: 4, fuente: 'pwa' });
    } else if (d.nivel < u.nivel.minimo) {
      State.addAlerta({ tipo: 'NIVEL_BAJO', mensaje: `Nivel bajo: ${d.nivel}%`, nivel: 2, fuente: 'pwa' });
    }

    if (d.nivel >= u.nivel.criticoAlto) {
      State.addAlerta({ tipo: 'NIVEL_ALTO', mensaje: `Riesgo desbordamiento: ${d.nivel}%`, nivel: 3, fuente: 'pwa' });
    }

    // Temperatura
    if (d.temperatura >= u.temperatura.criticaAlta) {
      State.addAlerta({ tipo: 'TEMP_ALTA', mensaje: `Temperatura crítica: ${d.temperatura}°C`, nivel: 4, fuente: 'pwa' });
    } else if (d.temperatura >= u.temperatura.alta) {
      State.addAlerta({ tipo: 'TEMP_ALTA', mensaje: `Temperatura elevada: ${d.temperatura}°C`, nivel: 2, fuente: 'pwa' });
    }
    if (d.temperatura <= u.temperatura.criticaBaja) {
      State.addAlerta({ tipo: 'TEMP_BAJA', mensaje: `Riesgo congelamiento: ${d.temperatura}°C`, nivel: 3, fuente: 'pwa' });
    }

    // Turbidez
    if (d.turbidez >= u.turbidez.critica) {
      State.addAlerta({ tipo: 'TURBIDEZ', mensaje: `Agua turbia: ${d.turbidez} NTU`, nivel: 4, fuente: 'pwa' });
    } else if (d.turbidez >= u.turbidez.precauc) {
      State.addAlerta({ tipo: 'TURBIDEZ', mensaje: `Turbidez moderada: ${d.turbidez} NTU`, nivel: 2, fuente: 'pwa' });
    }

    // pH
    if (d.ph < (u.ph.minimo - 0.5) || d.ph > (u.ph.maximo + 0.5)) {
      State.addAlerta({ tipo: 'PH_RANGO', mensaje: `pH fuera de rango: ${d.ph}`, nivel: 3, fuente: 'pwa' });
    }

    // TDS
    if (d.tds > u.tds.maximo) {
      State.addAlerta({ tipo: 'TDS_ALTO', mensaje: `TDS elevado: ${d.tds} ppm`, nivel: 2, fuente: 'pwa' });
    }
  },
};
