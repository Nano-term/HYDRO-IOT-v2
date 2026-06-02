/**
 * ui.dashboard.js v3.0
 * - SIM tag por sensor individual (no global)
 * - Tarjeta resumen del día
 * - Métricas secundarias rediseñadas con barra de estado
 * - Offline/BLE/caché totalmente funcional
 */
import State from '../state.js';
import CONFIG from '../config/app.config.js';

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

// ── Calcula color de barra según valor vs umbral ──────────────
function _barColor(val, warn, crit, inverted = false) {
  if (inverted) {
    if (val >= crit) return 'var(--red)';
    if (val >= warn) return 'var(--amber)';
    return 'var(--green)';
  }
  if (val <= crit) return 'var(--red)';
  if (val <= warn) return 'var(--amber)';
  return 'var(--green)';
}

// ── Timer "hace X minutos" ────────────────────────────────────
let _ageTimer = null;

export const UIDashboard = {

  init() {
    State.on('device:update', (d) => this.render(d));
    State.on('estado:change', (e) => this._renderEstado(e));
    State.on('app:update',    (a) => this._renderOnline(a));
    _ageTimer = setInterval(() => this._renderAge(), 30000);
  },

  render(d) {
    const nivel = parseFloat(d.nivel ?? 0);
    const set   = (id, val) => { const el = $id(id); if (el) el.textContent = val; };

    // ── Métricas principales ──────────────────────────────────
    set('mNivel',    fmt(nivel, 0));
    set('mTemp',     fmt(d.temperatura));
    set('mHum',      fmt(d.humedad, 0));

    // Litros si disponible
    const litros = parseFloat(d.litros_actuales ?? 0);
    const litrosEl = $id('mLitros');
    if (litrosEl) litrosEl.textContent = litros > 0 ? fmt(litros, 0) : '--';

    const bombaOn = d.bomba === true;
    set('mBomba', bombaOn ? 'ON' : 'OFF');
    const bWrap = $id('bombaIconWrap');
    if (bWrap) { bWrap.classList.toggle('green', bombaOn); bWrap.classList.toggle('red', !bombaOn); }

    const bar = $id('mNivelBar');
    if (bar) {
      bar.style.width = `${Math.min(100, nivel)}%`;
      const u = State.umbrales;
      bar.style.background = _barColor(nivel, u.nivel.minimo, u.nivel.criticoBajo);
    }

    const fill = $id('tanqueMiniRell');
    if (fill) fill.style.height = `${Math.min(100, nivel)}%`;
    const lbl = $id('tanqueMiniLabel');
    if (lbl) lbl.textContent = `${fmt(nivel, 0)}%`;

    // ── Métricas secundarias con indicador SIM individual ─────
    this._renderMetricaCalidad('mTurbidez', 'mTurbidezBar', 'simDot_turbidez',
      d.turbidez, d.turbidezSim, '%', 15, 30, true);
    this._renderMetricaCalidad('mFlujo', 'mFlujoBar', 'simDot_flujo',
      d.flujo, d.flujoSim, 'L/m', 2, 0.5, false, true);
    this._renderMetricaCalidad('mPH', 'mPHBar', 'simDot_ph',
      d.ph, d.phSim, '', 6.0, 8.5, false, false, true);
    this._renderMetricaCalidad('mTDS', 'mTDSBar', 'simDot_tds',
      d.tds, d.tdsSim, 'ppm', 350, 500, true);

    // ── Tarjeta resumen del día ───────────────────────────────
    this._renderResumenDia(d);

    this._renderEstado(d.estado);
    this._renderAge();
  },

  _renderMetricaCalidad(valId, barId, simId, valor, esSim, unidad, warn, crit, mayorEsPeor = true, esFlujo = false, esPH = false) {
    const el  = $id(valId);
    const bar = $id(barId);
    const dot = $id(simId);

    const v = parseFloat(valor ?? 0);

    if (el) el.textContent = isNaN(v) ? '--' : v.toFixed(esPH ? 2 : 1);

    // Mostrar indicador SIM solo para ESTE sensor si está simulado
    if (dot) {
      const mostrarSim = esSim === true || State.isSensorSim(simId.replace('simDot_',''));
      dot.classList.toggle('hidden', !mostrarSim);
    }

    if (!bar) return;

    // Barra proporcional según rango del sensor
    let pct = 0;
    let color = 'var(--green)';

    if (esPH) {
      // pH: rango 0-14, ideal 6-8.5
      pct = Math.min(100, (v / 14) * 100);
      color = (v < 5.5 || v > 9) ? 'var(--red)' : (v < 6 || v > 8.5) ? 'var(--amber)' : 'var(--green)';
    } else if (esFlujo) {
      // Flujo: malo si muy bajo (esperado > 2 L/min con bomba ON)
      pct = Math.min(100, (v / 30) * 100);
      color = v < 0.5 ? 'var(--text3)' : v < warn ? 'var(--amber)' : 'var(--green)';
    } else if (mayorEsPeor) {
      // Turbidez, TDS: mayor = peor
      const max = crit * 2;
      pct = Math.min(100, (v / max) * 100);
      color = v >= crit ? 'var(--red)' : v >= warn ? 'var(--amber)' : 'var(--green)';
    }

    bar.style.width  = `${pct}%`;
    bar.style.background = color;
  },

  _renderResumenDia(d) {
    const card = $id('resumenDiaCard');
    if (!card) return;

    const ciclos  = d.bomba_ciclos_hoy   ?? '--';
    const minutos = d.bomba_minutos_hoy  ?? '--';
    const litros  = d.consumo_litros_hoy > 0 ? fmt(d.consumo_litros_hoy, 0) + ' L' : '--';
    const fuga    = d.fuga_detectada === true;

    const setR = (id, val) => { const e = $id(id); if (e) e.textContent = val; };
    setR('rCiclos',  ciclos);
    setR('rMinutos', minutos + (minutos !== '--' ? ' min' : ''));
    setR('rLitros',  litros);

    const fugaEl = $id('rFuga');
    if (fugaEl) {
      fugaEl.textContent = fuga ? '⚠ Posible fuga' : 'Sin anomalías';
      fugaEl.style.color = fuga ? 'var(--red)' : 'var(--green)';
    }

    // Mostrar la card solo si hay datos
    const tieneDatos = d.bomba_ciclos_hoy !== undefined;
    card.classList.toggle('hidden', !tieneDatos && !State.isSimMode());
  },

  _renderAge() {
    const age   = State.getLastDataAge();
    const el    = $id('lastUpdateTime');
    const badge = $id('cacheAgeBadge');
    if (!el) return;

    if (age === null) {
      el.textContent = '--';
      if (badge) badge.classList.add('hidden');
      return;
    }

    el.textContent = new Date().toLocaleTimeString('es-MX');

    if (badge) {
      if (!State.app.deviceOnline && age > 60) {
        const min = Math.floor(age / 60);
        badge.textContent = `Datos de hace ${min} min`;
        badge.classList.remove('hidden');
      } else {
        badge.classList.add('hidden');
      }
    }
  },

  _renderEstado(estado) {
    const MAP = {
      'NORMAL':        { label: 'NORMAL',     sub: 'Sistema operando correctamente', dotClass: 'normal',  cardClass: '' },
      'PRECAUCION':    { label: 'PRECAUCIÓN', sub: 'Revisar parámetros',             dotClass: 'precauc', cardClass: 'estado-precauc' },
      'ALERTA':        { label: 'ALERTA',     sub: 'Atención requerida',             dotClass: 'alerta',  cardClass: 'estado-alerta' },
      'CRITICO':       { label: 'CRÍTICO',    sub: 'Acción inmediata',               dotClass: 'alerta',  cardClass: 'estado-critico' },
      'MANTENIMIENTO': { label: 'MANT.',      sub: 'Modo mantenimiento',             dotClass: 'offline', cardClass: 'estado-precauc' },
      'OFFLINE':       { label: 'OFFLINE',    sub: 'Sin conexión',                   dotClass: 'offline', cardClass: '' },
    };
    const info = MAP[estado] || MAP['OFFLINE'];
    const label  = $id('estadoLabel');
    const sub    = $id('estadoSub');
    const card   = $id('estadoCard');
    const dot    = $id('navDot');
    const navEst = $id('navEstado');
    if (label)  { label.textContent = info.label; setColorClass(label, estado); }
    if (sub)    sub.textContent   = info.sub;
    if (card)   { card.classList.remove('estado-precauc','estado-alerta','estado-critico'); if (info.cardClass) card.classList.add(info.cardClass); }
    if (dot)    dot.className     = 'status-dot ' + info.dotClass;
    if (navEst) navEst.textContent = info.label;
    const mapSem = { 'NORMAL':'verde', 'PRECAUCION':'ambar', 'ALERTA':'rojo', 'CRITICO':'rojo', 'OFFLINE':'' };
    ['verde','ambar','rojo'].forEach(c => {
      const el = $id(`sem${c.charAt(0).toUpperCase()+c.slice(1)}`);
      if (el) el.classList.toggle('activo', mapSem[estado] === c);
    });
  },

  _renderOnline(app) {
    const badge      = $id('onlineBadge');
    const simBadge   = $id('simBadge');
    const bleBadge   = $id('bleBadge');
    const cacheBadge = $id('cacheBadge');
    const banner     = $id('offlineBanner');
    if (!badge) return;
    const sourceMap = {
      firebase: { text: '● En línea',     cls: 'online-badge' },
      ble:      { text: '⟡ BLE',          cls: 'online-badge ble-online-badge' },
      sim:      { text: '◈ Simulación',   cls: 'online-badge sim-online-badge' },
      cache:    { text: '⊙ Sin conexión', cls: 'online-badge offline-badge' },
      none:     { text: '○ Sin datos',    cls: 'online-badge offline-badge' },
    };
    const src  = app.dataSource || 'none';
    const info = sourceMap[src] || sourceMap.none;
    badge.textContent = info.text;
    badge.className   = info.cls;
    if (simBadge)   simBadge.classList.toggle('hidden',  src !== 'sim');
    if (bleBadge)   bleBadge.classList.toggle('hidden',  src !== 'ble');
    if (cacheBadge) cacheBadge.classList.toggle('hidden', src !== 'cache');
    if (banner)     banner.classList.toggle('hidden',    app.deviceOnline);
  },
};
