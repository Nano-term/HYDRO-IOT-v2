/**
 * ui.modules.js — UIAlertas, UICharts, UINotas, UIConfig, UINav
 * TODOS los imports van al inicio del archivo (regla ES Modules)
 */

// ── TODOS LOS IMPORTS PRIMERO ────────────────────────────────
import State        from '../state.js';
import CONFIG       from '../config/app.config.js';
import DeviceManager from '../device/device.manager.js';
import { fbGuardarNota } from '../firebase/firebase.js';
import { Toast }    from '../utils/toast.js';

// ══════════════════════════════════════════════════════════════
// UIAlertas — Lista de alertas
// ══════════════════════════════════════════════════════════════
export const UIAlertas = {
  init() {
    State.on('alertas:update', (alertas) => this.render(alertas));
  },

  render(alertas) {
    const list  = document.getElementById('alertasList');
    const badge = document.getElementById('navBadgeAlertas');
    if (!list) return;

    const activas = alertas.filter(a => !a.resuelta);

    if (badge) {
      badge.textContent = activas.length;
      badge.classList.toggle('hidden', activas.length === 0);
    }

    if (activas.length === 0) {
      list.innerHTML = `
        <div class="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          <p>Sin alertas activas</p>
        </div>`;
      return;
    }

    const colorMap = { 1: '', 2: 'nivel-2', 3: 'nivel-3', 4: 'nivel-4' };
    list.innerHTML = activas.map(a => `
      <div class="alerta-item ${colorMap[a.nivel] || ''}">
        <div class="alerta-body">
          <h4>${a.tipo.replace(/_/g, ' ')}</h4>
          <p>${a.mensaje || ''}</p>
          <div class="alerta-meta">
            Nivel ${a.nivel} &bull; ${a.fuente || 'esp32'} &bull;
            ${a.ts ? new Date(a.ts).toLocaleTimeString('es-MX') : '--'}
          </div>
        </div>
        <button class="btn btn-sm btn-outline alerta-btn"
                onclick="UIAlertas.resolver('${a.tipo}')">
          Resolver
        </button>
      </div>`).join('');
  },

  resolver(tipo) {
    State.resolverAlerta(tipo);
    Toast.info(`Alerta "${tipo.replace(/_/g, ' ')}" resuelta`);
  },

  resolverTodas() {
    State.getAlertas().forEach(a => State.resolverAlerta(a.tipo));
    Toast.success('Todas las alertas resueltas');
  },
};
window.UIAlertas = UIAlertas;


// ══════════════════════════════════════════════════════════════
// UITimeline — Historial de eventos recientes
// ══════════════════════════════════════════════════════════════
export const UITimeline = {
  _eventos: [],

  init() {
    // Escuchar cambios de bomba, estado y alertas para registrar eventos
    State.on('bomba:change', (encendida) => {
      this._addEvento(encendida ? 'bomba_on' : 'bomba_off',
        encendida ? 'Bomba encendida' : 'Bomba apagada');
    });
    State.on('estado:change', (estado) => {
      if (estado !== 'NORMAL' && estado !== 'OFFLINE') {
        this._addEvento('alerta', 'Estado: ' + estado);
      }
    });
    State.on('alertas:update', (alertas) => {
      const nuevas = alertas.filter(a => !a.resuelta && a.ts && (Date.now() - a.ts) < 5000);
      nuevas.forEach(a => this._addEvento('alerta', a.tipo.replace(/_/g,' ') + ': ' + a.mensaje));
      this._render();
    });
    State.on('page:change', (p) => { if (p === 'alertas') this._render(); });
  },

  _addEvento(tipo, texto) {
    this._eventos.unshift({ tipo, texto, ts: Date.now() });
    if (this._eventos.length > 30) this._eventos.pop();
    this._render();
  },

  _render() {
    const el = document.getElementById('timelineList');
    if (!el) return;
    if (this._eventos.length === 0) {
      el.innerHTML = '<p style="font-size:0.82rem;color:var(--text3);padding:12px 0">Sin eventos registrados en esta sesión</p>';
      return;
    }
    const iconos = { bomba_on: '💧', bomba_off: '⏹', alerta: '⚠', info: 'ℹ' };
    el.innerHTML = this._eventos.slice(0,15).map(e => {
      const hora = new Date(e.ts).toLocaleTimeString('es-MX');
      return `<div class="timeline-item">
        <span class="timeline-icon">${iconos[e.tipo] || 'ℹ'}</span>
        <span class="timeline-texto">${e.texto}</span>
        <span class="timeline-hora">${hora}</span>
      </div>`;
    }).join('');
  },
};
window.UITimeline = UITimeline;


// ══════════════════════════════════════════════════════════════
// UICharts — Gráficas con Chart.js (carga lazy)
// ══════════════════════════════════════════════════════════════
const CHART_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js';
let _chartsLoaded = false;
let _charts = {};

async function _loadChartJs() {
  if (_chartsLoaded || typeof Chart !== 'undefined') { _chartsLoaded = true; return; }
  await new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = CHART_CDN;
    s.onload = () => { _chartsLoaded = true; res(); };
    s.onerror = rej;
    document.head.appendChild(s);
  });
}

const CHART_BASE_OPTS = {
  responsive: true,
  animation: false,
  plugins: { legend: { display: false } },
  scales: {
    x: {
      ticks: { color: '#5a7a96', maxTicksLimit: 8 },
      grid:  { color: 'rgba(255,255,255,0.05)' }
    },
    y: {
      ticks: { color: '#5a7a96' },
      grid:  { color: 'rgba(255,255,255,0.05)' }
    },
  },
};

function _makeChart(canvasId, label, color) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || typeof Chart === 'undefined') return null;
  // Destruir si ya existe
  if (_charts[canvasId]) { _charts[canvasId].destroy(); }
  return new Chart(canvas, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label,
        data: [],
        borderColor: color,
        backgroundColor: color + '20',
        borderWidth: 2,
        pointRadius: 2,
        fill: true,
        tension: 0.3,
      }]
    },
    options: CHART_BASE_OPTS,
  });
}

export const UICharts = {
  async init() {
    State.on('page:change', async (page) => {
      if (page !== 'historial') return;
      await _loadChartJs();
      this._crearCharts();
      this._actualizar(State.historial);
    });
    State.on('historial:update', (h) => this._actualizar(h));
  },

  _crearCharts() {
    _charts.nivel    = _makeChart('chartNivel',    'Nivel %',   '#2c9cbf');
    _charts.temp     = _makeChart('chartTemp',     'Temp °C',   '#f97316');
    _charts.turbidez = _makeChart('chartTurbidez', 'Turbidez',  '#a78bfa');
    _charts.ph       = _makeChart('chartPH',       'pH',        '#22c55e');
  },

  _actualizar(historial) {
    if (!_chartsLoaded || !_charts.nivel) return;
    const max    = parseInt(document.getElementById('historialRange')?.value || '30');
    const data   = historial.slice(-max);
    const labels = data.map((_, i) => i + 1);

    const upd = (chart, key) => {
      if (!chart) return;
      chart.data.labels = labels;
      chart.data.datasets[0].data = data.map(p => p[key] ?? null);
      chart.update('none');
    };
    upd(_charts.nivel,    'nivel');
    upd(_charts.temp,     'temperatura');
    upd(_charts.turbidez, 'turbidez');
    upd(_charts.ph,       'ph');
  },

  cambiarRango() { this._actualizar(State.historial); },

  renderSalud() {
    const el = document.getElementById('saludGrid');
    if (!el) return;
    const d = State.device;
    const app = State.app;
    const edad = State.getLastDataAge();
    const edadStr = edad === null ? '--'
      : edad < 60  ? `${edad}s`
      : edad < 3600 ? `${Math.floor(edad/60)}m`
      : `${Math.floor(edad/3600)}h`;

    const src = app.dataSource || 'none';
    const srcLabel = {firebase:'Firebase',ble:'BLE',sim:'Simulación',cache:'Caché',none:'--'}[src]||src;
    const rssi = d.rssi || 0;
    const rssiLabel = rssi === 0 ? '--' : rssi > -60 ? '🟢 Excelente' : rssi > -75 ? '🟡 Buena' : '🔴 Débil';
    const uptime = d.uptime || 0;
    const uptimeStr = uptime < 60 ? `${uptime}s`
      : uptime < 3600 ? `${Math.floor(uptime/60)}m`
      : `${Math.floor(uptime/3600)}h ${Math.floor((uptime%3600)/60)}m`;

    el.innerHTML = `
      <div class="salud-item"><span class="salud-lbl">Última lectura</span>
        <span class="salud-val ${edad && edad > 120 ? 'warn' : ''}">${edadStr} atrás</span></div>
      <div class="salud-item"><span class="salud-lbl">Fuente de datos</span>
        <span class="salud-val">${srcLabel}</span></div>
      <div class="salud-item"><span class="salud-lbl">WiFi RSSI</span>
        <span class="salud-val">${rssiLabel} (${rssi} dBm)</span></div>
      <div class="salud-item"><span class="salud-lbl">Uptime ESP32</span>
        <span class="salud-val">${uptimeStr}</span></div>
      <div class="salud-item"><span class="salud-lbl">IP dispositivo</span>
        <span class="salud-val">${d.ip || '--'}</span></div>
      <div class="salud-item"><span class="salud-lbl">Firmware</span>
        <span class="salud-val">${d.firmwareVersion || '--'}</span></div>
      <div class="salud-item"><span class="salud-lbl">Ciclos bomba hoy</span>
        <span class="salud-val">${d.bomba_ciclos_hoy ?? '--'}</span></div>
      <div class="salud-item"><span class="salud-lbl">Litros bombeados hoy</span>
        <span class="salud-val">${d.consumo_litros_hoy > 0 ? d.consumo_litros_hoy.toFixed(0)+' L' : '--'}</span></div>
    `;
  },

  renderLitros() {
    const canvas = document.getElementById('chartLitros');
    if (!canvas || typeof Chart === 'undefined') return;
    if (!State.historial || State.historial.length === 0) return;

    // Agrupar litros por hora
    const byHour = {};
    State.historial.forEach(p => {
      const h = new Date(p.ts).getHours();
      byHour[h] = (byHour[h] || 0) + (parseFloat(p.consumo_litros_hoy) || 0);
    });
    const labels = Object.keys(byHour).map(h => `${h}:00`);
    const data   = Object.values(byHour);

    if (canvas._chartInst) canvas._chartInst.destroy();
    canvas._chartInst = new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [{ label: 'Litros por hora', data,
          backgroundColor: 'rgba(44,156,191,0.6)', borderColor: '#2c9cbf', borderWidth: 1 }]
      },
      options: { responsive: true, scales: { y: { beginAtZero: true } } }
    });
  },

  exportarCSV() {
    if (!State.historial || State.historial.length === 0) {
      Toast.warning('Sin datos de historial para exportar');
      return;
    }
    const headers = 'Timestamp,Nivel(%),Temperatura(C),Turbidez(NTU),pH';
    const rows = State.historial.map(p => {
      const fecha = new Date(p.ts).toISOString();
      return `${fecha},${(p.nivel??'').toFixed?.(1)??''},${(p.temperatura??'').toFixed?.(1)??''},${(p.turbidez??'').toFixed?.(1)??''},${(p.ph??'').toFixed?.(2)??''}`;
    });
    const csv  = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `hidro_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    Toast.success('CSV descargado');
  },
};
window.UICharts = UICharts;


// ══════════════════════════════════════════════════════════════
// UINotas — Panel de notas del operador
// ══════════════════════════════════════════════════════════════
export const UINotas = {
  init() {
    State.on('notas:update', (notas) => this.render(notas));
  },

  render(notas) {
    const list = document.getElementById('notasList');
    if (!list) return;

    if (!notas || notas.length === 0) {
      list.innerHTML = '<div class="empty-state"><p>Sin notas registradas</p></div>';
      return;
    }

    const tipoColor = {
      operacion:     '#2c9cbf',
      mantenimiento: '#f59e0b',
      incidencia:    '#ef4444',
      observacion:   '#22c55e'
    };

    list.innerHTML = notas.map(n => {
      const color = tipoColor[n.tipo] || '#2c9cbf';
      const fecha = n.timestamp ? new Date(n.timestamp).toLocaleString('es-MX') : '--';
      return `
        <div class="nota-item">
          <div class="nota-header">
            <span class="nota-tipo"
                  style="background:${color}20;color:${color}">
              ${n.tipo}
            </span>
            <span class="nota-fecha">${fecha}</span>
          </div>
          <div class="nota-texto">${n.texto || ''}</div>
        </div>`;
    }).join('');
  },

  async guardar() {
    const textoEl = document.getElementById('notaTexto');
    const tipoEl  = document.getElementById('notaTipo');
    const texto   = textoEl?.value?.trim();
    const tipo    = tipoEl?.value || 'operacion';

    if (!texto) { Toast.warning('Escribe algo antes de guardar'); return; }

    const deviceId = State.getDeviceId();
    const ok = await fbGuardarNota(deviceId, texto, tipo);

    if (ok) {
      textoEl.value = '';
      Toast.success('Nota guardada en Firebase');
    } else {
      // Guardar localmente si Firebase no disponible
      State.addNota({ texto, tipo, timestamp: Date.now(), id: Date.now() });
      textoEl.value = '';
      Toast.info('Nota guardada localmente (Firebase no disponible)');
    }
  },
};
window.UINotas = UINotas;




// ══════════════════════════════════════════════════════════════
// UIAlertasHistorial — Alertas resueltas
// ══════════════════════════════════════════════════════════════
export const UIAlertasHistorial = {
  init() {
    State.on('alertas:update', () => this._render());
    State.on('page:change', (p) => { if (p === 'alertas') this._render(); });
  },

  _render() {
    const el = document.getElementById('alertasHistorial');
    if (!el) return;
    const resueltas = State.alertas.filter(a => a.resuelta).slice(0, 20);
    if (resueltas.length === 0) {
      el.innerHTML = '<p style="font-size:0.82rem;color:var(--text3)">Sin alertas resueltas aún</p>';
      return;
    }
    const colorMap = { 1: '', 2: 'nivel-2', 3: 'nivel-3', 4: 'nivel-4' };
    el.innerHTML = resueltas.map(a => `
      <div class="alerta-item ${colorMap[a.nivel]||''}" style="opacity:0.6">
        <div class="alerta-body">
          <h4 style="text-decoration:line-through">${a.tipo.replace(/_/g,' ')}</h4>
          <p>${a.mensaje||''}</p>
          <div class="alerta-meta">
            Resuelta &bull; ${a.ts ? new Date(a.ts).toLocaleString('es-MX') : '--'}
          </div>
        </div>
      </div>`).join('');
  },
};
window.UIAlertasHistorial = UIAlertasHistorial;


// ══════════════════════════════════════════════════════════════
// UINav — Reloj, uptime, RSSI en sidebar
// ══════════════════════════════════════════════════════════════
// ── Salud del sistema ─────────────────────────────────────────
export const UISalud = {
  init() {
    State.on('device:update', () => {
      if (document.getElementById('page-salud')?.classList.contains('active')) {
        this.render();
      }
      this._actualizarEdad();
    });
    State.on('page:change', p => { if (p === 'salud') this.render(); });
    setInterval(() => this._actualizarEdad(), 15000);
  },
  render() {
    if (typeof UICharts !== 'undefined' && UICharts.renderSalud) {
      UICharts.renderSalud();
    }
    // fallback inline
    const el = document.getElementById('saludGrid');
    if (el && el.innerHTML === '') UICharts?.renderSalud?.();
  },
  _actualizarEdad() {
    const badge = document.getElementById('lastDataAge');
    if (!badge) return;
    const edad = State.getLastDataAge();
    if (edad === null || edad < 90) { badge.classList.add('hidden'); return; }
    const min = Math.floor(edad / 60);
    badge.textContent = `Datos de hace ${min} min`;
    badge.classList.remove('hidden');
  },
};
window.UISalud = UISalud;

export const UINav = {
  init() {
    State.on('device:update', (d) => this._renderInfo(d));
    setInterval(() => this._tick(), 1000);
  },

  _tick() {
    const el = document.getElementById('navClock');
    if (el) el.textContent = new Date().toLocaleTimeString('es-MX');
  },

  _renderInfo(d) {
    const s = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    s('navUptime',   `Uptime: ${d.uptime || 0}s`);
    s('navRssi',     `WiFi: ${d.rssi || '--'} dBm`);
    s('navDeviceName', d.deviceId || State.getDeviceId());
  },
};