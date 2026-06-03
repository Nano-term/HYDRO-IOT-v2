/**
 * ui.control.js — Panel de control de bomba y modo
 */
import State         from '../state.js';
import DeviceManager from '../device/device.manager.js';
import { Toast }     from '../utils/toast.js';

function $id(id) { return document.getElementById(id); }

export const UIControl = {
  init() {
    State.on('device:update', (d) => this.render(d));
    State.on('app:update',    ()  => this._renderAndGate());
  },

  render(d) {
    // Bomba visual
    const bombaOn = d.bomba === true;
    const bombaVisual = document.querySelector('.bomba-visual');
    const bombaInner  = document.getElementById('bombaInnerCircle');
    const bombaDrop   = document.getElementById('bombaDropIcon');
    if (bombaVisual) bombaVisual.classList.toggle('on', bombaOn);
    if (bombaInner)  bombaInner.classList.toggle('on', bombaOn);
    if (bombaDrop)   bombaDrop.classList.toggle('on', bombaOn);

    const st = $id('bombaStatus');
    if (st) {
      st.textContent = bombaOn ? 'ENCENDIDA' : 'APAGADA';
      st.classList.toggle('on', bombaOn);
    }

    const mode = $id('bombaMode');
    if (mode) mode.textContent = `Modo: ${d.modo || 'AUTOMÁTICO'}`;

    // Botones de modo
    const btnA = $id('btnModoAuto');
    const btnM = $id('btnModoManual');
    const isAuto = d.modo === 'AUTOMATICO';
    if (btnA) { btnA.className = isAuto ? 'btn btn-mode' : 'btn btn-mode-outline'; }
    if (btnM) { btnM.className = isAuto ? 'btn btn-mode-outline' : 'btn btn-mode'; }

    const desc = $id('modeDescription');
    if (desc) {
      desc.textContent = isAuto
        ? 'La bomba se activa cuando el nivel baja del 25% y se apaga al superar el 90%.'
        : 'La bomba responde a los comandos manuales.';
    }

    // Botones bomba
    const warnEl = $id('controlWarning');
    const mantenimiento = d.mantenimiento;
    if ($id('btnBombaOn'))  $id('btnBombaOn').disabled  = isAuto || mantenimiento;
    if ($id('btnBombaOff')) $id('btnBombaOff').disabled = mantenimiento;
    if (warnEl) {
      if (mantenimiento) warnEl.textContent = '⚠ Modo mantenimiento activo — bomba bloqueada';
      else if (isAuto)   warnEl.textContent = 'En modo automático la bomba se gestiona sola.';
      else               warnEl.textContent = '';
    }

    // Info dispositivo
    const s = (id, val) => { const el = $id(id); if (el) el.textContent = val || '--'; };
    s('diFw',      d.firmwareVersion);
    s('diIp',      d.ip);
    s('diUptime',  d.uptime ? `${d.uptime}s` : '--');
    s('diRssi',    d.rssi   ? `${d.rssi} dBm` : '--');
    s('diOnline',  d.online ? '✅ En línea' : '❌ Offline');
    s('diAlertas', State.getAlertas().length);

    this._renderAndGate(d);
  },

  _renderAndGate(d) {
    d = d || State.device;
    const app = State.app;
    // Usar app como fuente primaria — se actualiza antes que device tras cambio de modo
    // Múltiples fuentes para evitar falso "sin conexión" al cambiar de modo
    const wifiOk = d.wifiConectado || app.deviceOnline || app.firebaseReady;
    const fbOk   = d.firebaseConectado || app.firebaseReady;
    const bleOk  = app.bleMode && app.bleConnected;

    const setGate = (id, on) => {
      const el = $id(id);
      if (!el) return;
      const led = el.querySelector('.gate-led');
      if (led) led.className = `gate-led ${on ? 'on' : 'off'}`;
    };
    setGate('gateA', wifiOk || bleOk);
    setGate('gateB', fbOk  || bleOk);

    const note = $id('gateNote');
    if (note) {
      if (bleOk) {
        note.textContent = '⟡ Control via Bluetooth activo';
        note.style.color = 'var(--blue, #60a5fa)';
      } else if (wifiOk && fbOk) {
        note.textContent = '✅ Control remoto habilitado';
        note.style.color = 'var(--green)';
      } else if (wifiOk && !fbOk) {
        note.textContent = '⏳ WiFi conectado — Firebase sincronizando...';
        note.style.color = 'var(--amber)';
      } else {
        note.textContent = '○ Sin conexión — conecta WiFi o Bluetooth';
        note.style.color = 'var(--text3)';
      }
    }
  },

  async setBomba(encender) {
    // En modo auto por Firebase: cambiar a manual automáticamente antes de enviar
    if (State.device.modo === 'AUTOMATICO' && !State.isSimMode() && !State.isBleMode()) {
      const modoResult = await DeviceManager.setModo(false);
      if (!modoResult.ok) {
        Toast.warning('No se pudo cambiar a modo manual');
        return;
      }
      await new Promise(r => setTimeout(r, 300)); // dar tiempo al ESP32
    }
    const result = await DeviceManager.setBomba(encender);
    if (result.ok) {
      Toast.success(`Bomba ${encender ? 'encendida' : 'apagada'}`);
    } else {
      Toast.error(result.error || 'Error al enviar comando');
    }
  },

  async setModo(modoAuto) {
    const result = await DeviceManager.setModo(modoAuto);
    if (result.ok) {
      Toast.success(`Modo ${modoAuto ? 'automático' : 'manual'} activado`);
    } else {
      Toast.error('Error al cambiar modo');
    }
  },
};

// ─── Export global para onclick en HTML ──────────────────────
window.UIControl = UIControl;