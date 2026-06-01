/**
 * ui.ble.js — Interfaz BLE con reconexión automática
 */

import BLEManager from '../bluetooth/ble.manager.js';
import { Toast }  from '../utils/toast.js';

function $id(id) { return document.getElementById(id); }

export const UIBLE = {

  init() {
    if (!BLEManager.isSupported()) {
      const btn = $id('bleBtnConectar');
      if (btn) {
        btn.disabled = true;
        btn.title = 'Web Bluetooth no disponible en este navegador';
      }
      this._setEstado('error', 'No disponible — usa Chrome o Edge en Android/escritorio');
    }
  },

  async conectar() {
    this._setEstado('conectando', 'Buscando ESP32...');
    this._setProgress(true, 10, 'Abriendo selector Bluetooth...');

    try {
      const result = await BLEManager.conectar(
        (data) => this._onDatos(data),
        (status) => this._onStatus(status)
      );

      this._setEstado('conectado', `Conectado: ${result.nombre}`);
      this._setProgress(true, 100, '¡Conectado! Introduce las nuevas credenciales WiFi.');
      setTimeout(() => this._setProgress(false), 1500);

      $id('bleWifiForm')?.classList.remove('hidden');
      $id('bleBtnConectar')?.classList.add('hidden');

    } catch (e) {
      if (e.name === 'NotFoundError') {
        this._setEstado('', 'No conectado');
        this._setProgress(false);
      } else if (e.message?.includes('GATT') || e.message?.includes('disconnected')) {
        // Error GATT — reintentar conexión automáticamente una vez
        this._setEstado('conectando', 'Reconectando...');
        this._setProgress(true, 30, 'Error GATT, reintentando...');
        setTimeout(() => this.conectar(), 1500);
      } else {
        this._setEstado('error', 'Error: ' + e.message);
        this._setProgress(false);
        Toast.error('Error BLE: ' + e.message);
      }
    }
  },

  async enviarWifi() {
    const ssid = $id('bleSSID')?.value?.trim();
    const pass = $id('blePass')?.value;

    if (!ssid) { Toast.warning('Introduce el nombre de la red (SSID)'); return; }
    if (!pass)  { Toast.warning('Introduce la contraseña'); return; }
    if (ssid.length > 32) { Toast.error('SSID demasiado largo (máx 32)'); return; }

    // Verificar que sigue conectado antes de enviar
    if (!BLEManager.isConnected()) {
      Toast.warning('BLE desconectado. Vuelve a conectar primero.');
      this._resetUI();
      return;
    }

    this._setProgress(true, 30, 'Enviando credenciales...');

    try {
      await BLEManager.enviarWifi(ssid, pass);
      this._setProgress(true, 70, 'Enviado. El ESP32 cambia de red...');
      setTimeout(() => {
        this._setProgress(true, 100, '✅ Listo. El ESP32 se reconecta en ~10 segundos.');
        setTimeout(() => this._setProgress(false), 4000);
      }, 2000);

      if ($id('bleSSID')) $id('bleSSID').value = '';
      if ($id('blePass')) $id('blePass').value  = '';

    } catch (e) {
      this._setProgress(false);
      if (e.message?.includes('GATT') || e.message?.includes('disconnected')) {
        Toast.error('ESP32 se desconectó. Vuelve a conectar e intenta de nuevo.');
        this._resetUI();
      } else {
        Toast.error('Error enviando WiFi: ' + e.message);
      }
    }
  },

  desconectar() {
    BLEManager.desconectar();
    this._resetUI();
    Toast.info('BLE desconectado');
  },

  togglePass() {
    const input = $id('blePass');
    if (input) input.type = input.type === 'password' ? 'text' : 'password';
  },

  _onDatos(data) {
    console.log('[BLE] Datos:', data);
  },

  _onStatus(status) {
    if (status === 'DESCONECTADO') {
      this._resetUI();
    }
  },

  _resetUI() {
    this._setEstado('', 'No conectado');
    $id('bleWifiForm')?.classList.add('hidden');
    $id('bleBtnConectar')?.classList.remove('hidden');
    this._setProgress(false);
  },

  _setEstado(tipo, texto) {
    const dot  = $id('bleDot');
    const text = $id('bleStatusText');
    if (dot)  dot.className    = `ble-dot ${tipo}`;
    if (text) text.textContent = texto;
  },

  _setProgress(visible, pct, msg) {
    const el    = $id('bleProgress');
    const fill  = $id('bleProgressFill');
    const msgEl = $id('bleProgressMsg');
    if (!el) return;
    el.classList.toggle('hidden', !visible);
    if (fill  && pct !== undefined) fill.style.width = `${pct}%`;
    if (msgEl && msg !== undefined) msgEl.textContent = msg;
  },
};

window.UIBLE = UIBLE;
export default UIBLE;
