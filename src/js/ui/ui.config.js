/**
 * ui.config.js v2.0
 * Panel de configuración con:
 * - Menú oculto (3 toques en título "Configuración")
 * - Simulación por módulo individual
 * - Switcher de modo BLE ↔ Firebase
 */

import State         from '../state.js';
import CONFIG        from '../config/app.config.js';
import DeviceManager from '../device/device.manager.js';
import { Toast }     from '../utils/toast.js';

function $id(id) { return document.getElementById(id); }

// ── Contador de toques para menú oculto ──────────────────────
let _tapCount  = 0;
let _tapTimer  = null;

export const UIConfig = {

  init() {
    this._cargarValores();
    this._setupHiddenMenu();
    State.on('app:update', (a) => this._renderModoActual(a));
  },

  _setupHiddenMenu() {
    // Acceso via botón con contraseña (ver mostrarAdminLogin)
  },

  _togglePanelOculto() {
    const panel = $id('panelSimModulos');
    if (!panel) return;
    const visible = !panel.classList.contains('hidden');
    panel.classList.toggle('hidden', visible);
    if (!visible) {
      Toast.info('Panel de simulación por módulo');
    }
  },

  _cargarValores() {
    const cfg = JSON.parse(localStorage.getItem('hidro_config') || '{}');
    if (cfg.tanque_altura_cm  && $id('cfgTanqueAltura'))  $id('cfgTanqueAltura').value  = cfg.tanque_altura_cm;
    if (cfg.tanque_offset_cm  && $id('cfgTanqueOffset'))  $id('cfgTanqueOffset').value  = cfg.tanque_offset_cm;
    if (cfg.tanque_volumen_l  && $id('cfgTanqueVolumen')) $id('cfgTanqueVolumen').value  = cfg.tanque_volumen_l;
    const u   = cfg.umbrales || CONFIG.UMBRALES;

    const setVal = (id, val) => { const el = $id(id); if (el) el.value = val; };
    setVal('cfgNivelMin',  u.nivel?.minimo         || 25);
    setVal('cfgNivelMax',  u.nivel?.maximo         || 90);
    setVal('cfgTempAlta',  u.temperatura?.alta     || 35);
    setVal('cfgDeviceId',  cfg.deviceId            || CONFIG.DEVICE_ID);

    const simCheck = $id('cfgSimMode');
    if (simCheck) simCheck.checked = State.isSimMode();

    this.preview('cfgNivelMinVal', u.nivel?.minimo      || 25, '%');
    this.preview('cfgNivelMaxVal', u.nivel?.maximo      || 90, '%');
    this.preview('cfgTempAltaVal', u.temperatura?.alta  || 35, '°C');

    // Cargar estado de sim por módulo
    this._renderSimModulos();
  },

  _renderSimModulos() {
    const mods = State.app.simModules;
    Object.keys(mods).forEach(sensor => {
      const el = $id(`simMod_${sensor}`);
      if (el) el.checked = mods[sensor];
    });
  },

  _renderModoActual(app) {
    const btnFb  = $id('btnModoFirebase');
    const btnBle = $id('btnModoBLE');
    const infoEl = $id('modoActualInfo');

    if (btnFb)  btnFb.classList.toggle('active',  !app.bleMode && !app.simModeActive);
    if (btnBle) btnBle.classList.toggle('active',  app.bleMode);

    if (infoEl) {
      if (app.bleMode && app.bleConnected) {
        infoEl.textContent = '⟡ Modo BLE — datos directos del ESP32';
        infoEl.style.color = 'var(--accent)';
      } else if (app.bleMode && !app.bleConnected) {
        infoEl.textContent = '⟡ BLE — sin conexión activa';
        infoEl.style.color = 'var(--amber)';
      } else if (app.simModeActive) {
        infoEl.textContent = '◈ Modo simulación completa activa';
        infoEl.style.color = 'var(--amber)';
      } else if (app.deviceOnline) {
        infoEl.textContent = '● Firebase en línea';
        infoEl.style.color = 'var(--green)';
      } else {
        infoEl.textContent = '○ Sin conexión — mostrando caché';
        infoEl.style.color = 'var(--text3)';
      }
    }
  },

  preview(labelId, val, unit) {
    const el = $id(labelId);
    if (el) el.textContent = `${val}${unit}`;
  },

  guardar() {
    const nivelMin   = parseInt($id('cfgNivelMin')?.value   || '25');
    const nivelMax   = parseInt($id('cfgNivelMax')?.value   || '90');
    const tempAlta   = parseInt($id('cfgTempAlta')?.value   || '35');
    const deviceId   = $id('cfgDeviceId')?.value?.trim()    || CONFIG.DEVICE_ID;
    // Calibración del tanque — se guarda en Firebase para que el ESP32 la use
    const alturaStr  = $id('cfgTanqueAltura')?.value?.trim();
    const offsetStr  = $id('cfgTanqueOffset')?.value?.trim();
    const volumenStr = $id('cfgTanqueVolumen')?.value?.trim();
    const tanqueAltura  = alturaStr  ? parseFloat(alturaStr)  : null;
    const tanqueOffset  = offsetStr  ? parseFloat(offsetStr)  : null;
    const tanqueVolumen = volumenStr ? parseFloat(volumenStr) : null;

    const cfg = {
      deviceId,
      umbrales: {
        nivel:       { ...CONFIG.UMBRALES.nivel,       minimo: nivelMin, maximo: nivelMax },
        temperatura: { ...CONFIG.UMBRALES.temperatura, alta:   tempAlta },
      }
    };
    if (tanqueAltura  !== null) cfg.tanque_altura_cm  = tanqueAltura;
    if (tanqueOffset  !== null) cfg.tanque_offset_cm  = tanqueOffset;
    if (tanqueVolumen !== null) cfg.tanque_volumen_l   = tanqueVolumen;

    localStorage.setItem('hidro_config', JSON.stringify(cfg));
    State.setUmbrales(cfg.umbrales);
    State.setApp({ deviceId });

    // Guardar calibración en Firebase para que ESP32 la actualice
    if ((tanqueAltura || tanqueOffset || tanqueVolumen) && !State.isSimMode()) {
      import('../firebase/firebase.js').then(({ fbSetConfiguracion }) => {
        fbSetConfiguracion(deviceId, {
          tanque_altura_cm:  tanqueAltura  || 0,
          tanque_offset_cm:  tanqueOffset  || 0,
          tanque_volumen_l:  tanqueVolumen || 0,
        });
      }).catch(() => {});
    }

    Toast.success('Configuración guardada');
  },

  resetear() {
    localStorage.removeItem('hidro_config');
    this._cargarValores();
    Toast.info('Valores restaurados');
  },

  // ── Sim completa ─────────────────────────────────────────

  toggleSimMode(on) {
    if (on) DeviceManager.activarSim();
    else    DeviceManager.desactivarSim();
    Toast.info(on ? 'Simulación completa activada' : 'Simulación desactivada');
  },

  // ── Sim por módulo (desde panel oculto) ──────────────────

  toggleSimModulo(sensor, on) {
    State.setSimModule(sensor, on);
    Toast.info(`${sensor}: ${on ? 'simulado' : 'real'}`);
  },

  resetSimModulos() {
    const sensores = ['nivel','temperatura','humedad','turbidez','flujo','ph','tds'];
    sensores.forEach(s => State.setSimModule(s, false));
    this._renderSimModulos();
    Toast.info('Todos los módulos en modo real');
  },

  // ── Modo BLE ─────────────────────────────────────────────

  async activarBLE() {
    try {
      await DeviceManager.activarModoBLE();
      Toast.success('BLE conectado — datos directos del ESP32');
    } catch(e) {
      if (e.name !== 'NotFoundError') {
        Toast.error('Error BLE: ' + e.message);
      }
    }
  },

  desactivarBLE() {
    DeviceManager.desactivarModoBLE();
    Toast.info('Volviendo a modo Firebase');
  },

  // ── Panel admin con contraseña ────────────────────────────

  mostrarAdminLogin() {
    const modal = document.getElementById('adminModal');
    const input = document.getElementById('adminPassInput');
    const err   = document.getElementById('adminError');
    if (!modal) return;
    modal.classList.remove('hidden');
    if (err) err.classList.add('hidden');
    if (input) { input.value = ''; setTimeout(() => input.focus(), 100); }
  },

  cerrarAdminLogin() {
    const modal = document.getElementById('adminModal');
    if (modal) modal.classList.add('hidden');
  },

  verificarAdmin() {
    const input = document.getElementById('adminPassInput');
    const err   = document.getElementById('adminError');
    const pass  = input?.value || '';

    if (pass === 'adminpanel123') {
      this.cerrarAdminLogin();
      this._togglePanelOculto();
    } else {
      if (err) {
        err.classList.remove('hidden');
        // Sacudir el input para indicar error
        input?.classList.add('shake');
        setTimeout(() => input?.classList.remove('shake'), 500);
      }
      if (input) input.value = '';
    }
  },
};

window.UIConfig = UIConfig;