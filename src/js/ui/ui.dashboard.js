/**
 * ui.dashboard.js — Actualiza el dashboard con datos del State
 */
import State from '../state.js';

function fmt(val, dec = 1) {
  const n = parseFloat(val);
  return isNaN(n) ? '--' : n.toFixed(dec);
}

function $id(id) { return document.getElementById(id); }

function setColorClass(el, estado) {
  el.classList.remove('precauc', 'alerta', 'critico');
  if (estado === 'PRECAUCION') el.classList.add('precauc');
  else if (estado === 'ALERTA')   el.classList.add('alerta');
  else if (estado === 'CRITICO')  el.classList.add('critico');
}

export const UIDashboard = {

  init() {
    State.on('device:update',  (d) => this.render(d));
    State.on('estado:change',  (e) => this._renderEstado(e));
    State.on('app:update',     (a) => this._renderOnline(a));
  },

  render(d) {
    // Nivel
    const nivel = parseFloat(d.nivel ?? 0);
    $id('mNivel').textContent = fmt(nivel, 0);
    const barEl = $id('mNivelBar');
    if (barEl) barEl.style.width = `${Math.min(100, nivel)}%`;

    // Temperatura
    $id('mTemp').textContent = fmt(d.temperatura);

    // Humedad
    $id('mHum').textContent = fmt(d.humedad, 0);

    // Bomba
    const bombaOn = d.bomba === true || d.bomba === 'true';
    $id('mBomba').textContent = bombaOn ? 'ON' : 'OFF';
    const bombaWrap = $id('bombaIconWrap');
    if (bombaWrap) {
      bombaWrap.classList.toggle('green', bombaOn);
      bombaWrap.classList.toggle('red',  !bombaOn);
    }

    // Sensores calidad
    $id('mTurbidez').textContent = fmt(d.turbidez);
    $id('mFlujo').textContent    = fmt(d.flujo);
    $id('mPH').textContent       = fmt(d.ph, 2);
    $id('mTDS').textContent      = fmt(d.tds, 0);

    // Tags SIM
    const simTag = $id('simTagCalidad');
    if (simTag) simTag.classList.toggle('hidden', !d.turbidezSim);

    // Mini tanque
    const fill = $id('tanqueMiniRell');
    if (fill) fill.style.height = `${Math.min(100, nivel)}%`;
    const lbl = $id('tanqueMiniLabel');
    if (lbl) lbl.textContent = `${fmt(nivel, 0)}%`;

    // Estado
    this._renderEstado(d.estado);

    // Última actualización
    const lu = $id('lastUpdateTime');
    if (lu) lu.textContent = new Date().toLocaleTimeString('es-MX');
  },

  _renderEstado(estado) {
    const card  = $id('estadoCard');
    const label = $id('estadoLabel');
    const sub   = $id('estadoSub');
    const dot   = $id('navDot');
    const navEst = $id('navEstado');

    const MAP = {
      'NORMAL':        { label: 'NORMAL',       sub: 'Sistema operando correctamente', dotClass: 'normal', cardClass: '' },
      'PRECAUCION':    { label: 'PRECAUCIÓN',   sub: 'Revisar parámetros del sistema', dotClass: 'precauc', cardClass: 'estado-precauc' },
      'ALERTA':        { label: 'ALERTA',        sub: 'Atención requerida',             dotClass: 'alerta',  cardClass: 'estado-alerta' },
      'CRITICO':       { label: 'CRÍTICO',       sub: 'Acción inmediata necesaria',     dotClass: 'alerta',  cardClass: 'estado-critico' },
      'MANTENIMIENTO': { label: 'MANT.',         sub: 'Modo mantenimiento activo',      dotClass: 'offline', cardClass: 'estado-precauc' },
      'OFFLINE':       { label: 'OFFLINE',       sub: 'Sin conexión al dispositivo',    dotClass: 'offline', cardClass: '' },
    };

    const info = MAP[estado] || MAP['OFFLINE'];

    if (label) { label.textContent = info.label; setColorClass(label, estado); }
    if (sub)   sub.textContent = info.sub;
    if (card)  { card.classList.remove('estado-precauc','estado-alerta','estado-critico'); if (info.cardClass) card.classList.add(info.cardClass); }
    if (dot)   { dot.className = 'status-dot ' + info.dotClass; }
    if (navEst) navEst.textContent = info.label;

    // Semáforo
    const mapSem = {
      'NORMAL':     'verde',
      'PRECAUCION': 'ambar',
      'ALERTA':     'rojo',
      'CRITICO':    'rojo',
      'OFFLINE':    '',
    };
    ['verde', 'ambar', 'rojo'].forEach(c => {
      const el = $id(`sem${c.charAt(0).toUpperCase() + c.slice(1)}`);
      if (el) el.classList.toggle('activo', mapSem[estado] === c);
    });
  },

  _renderOnline(app) {
    const badge   = $id('onlineBadge');
    const simBadge = $id('simBadge');
    const banner  = $id('offlineBanner');

    if (!badge) return;

    if (app.deviceOnline) {
      badge.textContent = '● En línea';
      badge.className   = 'online-badge';
    } else {
      badge.textContent = '○ Sin conexión';
      badge.className   = 'online-badge offline-badge';
    }

    if (simBadge) simBadge.classList.toggle('hidden', !app.simModeActive);
    if (banner)   banner.classList.toggle('hidden', app.deviceOnline);
  },
};
