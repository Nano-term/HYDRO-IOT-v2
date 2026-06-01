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
// UIConfig — Panel de configuración
// ══════════════════════════════════════════════════════════════
export const UIConfig = {
  init() {
    this._cargarValores();
  },

  _cargarValores() {
    const cfg = JSON.parse(localStorage.getItem('hidro_config') || '{}');
    const u   = cfg.umbrales || CONFIG.UMBRALES;

    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val;
    };
    setVal('cfgNivelMin',  u.nivel?.minimo         || 25);
    setVal('cfgNivelMax',  u.nivel?.maximo         || 90);
    setVal('cfgTempAlta',  u.temperatura?.alta     || 35);
    setVal('cfgDeviceId',  cfg.deviceId            || CONFIG.DEVICE_ID);

    const simCheck = document.getElementById('cfgSimMode');
    if (simCheck) simCheck.checked = State.isSimMode();

    this.preview('cfgNivelMinVal', u.nivel?.minimo         || 25, '%');
    this.preview('cfgNivelMaxVal', u.nivel?.maximo         || 90, '%');
    this.preview('cfgTempAltaVal', u.temperatura?.alta     || 35, '°C');
  },

  preview(labelId, val, unit) {
    const el = document.getElementById(labelId);
    if (el) el.textContent = `${val}${unit}`;
  },

  guardar() {
    const nivelMin = parseInt(document.getElementById('cfgNivelMin')?.value  || '25');
    const nivelMax = parseInt(document.getElementById('cfgNivelMax')?.value  || '90');
    const tempAlta = parseInt(document.getElementById('cfgTempAlta')?.value  || '35');
    const deviceId = document.getElementById('cfgDeviceId')?.value?.trim()   || CONFIG.DEVICE_ID;

    const cfg = {
      deviceId,
      umbrales: {
        nivel:       { ...CONFIG.UMBRALES.nivel,       minimo: nivelMin, maximo: nivelMax },
        temperatura: { ...CONFIG.UMBRALES.temperatura, alta:   tempAlta },
      }
    };
    localStorage.setItem('hidro_config', JSON.stringify(cfg));
    State.setUmbrales(cfg.umbrales);
    State.setApp({ deviceId });
    Toast.success('Configuración guardada');
  },

  resetear() {
    localStorage.removeItem('hidro_config');
    this._cargarValores();
    Toast.info('Valores restaurados a defaults');
  },

  toggleSimMode(on) {
    if (on) DeviceManager.activarSim();
    else    DeviceManager.desactivarSim();
    Toast.info(on ? 'Modo simulación activado' : 'Modo simulación desactivado');
  },
};
window.UIConfig = UIConfig;


// ══════════════════════════════════════════════════════════════
// UINav — Reloj, uptime, RSSI en sidebar
// ══════════════════════════════════════════════════════════════
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
