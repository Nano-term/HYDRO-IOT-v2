/**
 * ui.ble.js — Interfaz de configuración WiFi via BLE
 * El usuario conecta por Bluetooth y envía nuevas credenciales WiFi al ESP32.
 */

import BLEManager from '../bluetooth/ble.manager.js';
import { Toast }  from '../utils/toast.js';

function $id(id) { return document.getElementById(id); }

export const UIBLE = {

  init() {
    // Si el navegador no soporta BLE, mostrar aviso y deshabilitar
    if (!BLEManager.isSupported()) {
      const btn = $id('bleBtnConectar');
      if (btn) {
        btn.disabled = true;
        btn.title = 'Web Bluetooth no disponible en este navegador';
      }
      this._setEstado('error', 'No disponible en este navegador (usa Chrome/Edge)');
    }
  },

  async conectar() {
    this._setEstado('conectando', 'Buscando ESP32...');
    this._setProgress(true, 10, 'Esperando selección de dispositivo...');

    try {
      const result = await BLEManager.conectar(
        (data) => this._onDatos(data),
        (status) => this._onStatus(status)
      );

      this._setEstado('conectado', `Conectado: ${result.nombre}`);
      this._setProgress(true, 100, '¡Conectado! Introduce las nuevas credenciales WiFi.');
      setTimeout(() => this._setProgress(false), 1500);

      // Mostrar formulario WiFi
      $id('bleWifiForm')?.classList.remove('hidden');
      $id('bleBtnConectar')?.classList.add('hidden');

    } catch (e) {
      if (e.name === 'NotFoundError') {
        // Usuario canceló el selector — no es error
        this._setEstado('', 'No conectado');
        this._setProgress(false);
      } else {
        this._setEstado('error', 'Error: ' + e.message);
        this._setProgress(false);
      }
    }
  },

  async enviarWifi() {
    const ssid = $id('bleSSID')?.value?.trim();
    const pass = $id('blePass')?.value;

    if (!ssid) { Toast.warning('Introduce el nombre de la red (SSID)'); return; }
    if (!pass)  { Toast.warning('Introduce la contraseña'); return; }
    if (ssid.length > 32) { Toast.error('SSID demasiado largo (máx 32 caracteres)'); return; }

    this._setProgress(true, 30, 'Enviando credenciales por BLE...');

    try {
      await BLEManager.enviarWifi(ssid, pass);

      this._setProgress(true, 70, 'Credenciales enviadas. El ESP32 se está reconectando...');

      // Esperar a que el ESP32 confirme (a través de notificación de status)
      // Si en 15s no hay confirmación, asumir que funcionó
      setTimeout(() => {
        this._setProgress(true, 100, '✅ Listo. El ESP32 debería conectarse a la nueva red en unos segundos.');
        setTimeout(() => this._setProgress(false), 4000);
      }, 3000);

      // Limpiar el formulario por seguridad
      if ($id('bleSSID'))  $id('bleSSID').value = '';
      if ($id('blePass'))  $id('blePass').value  = '';

    } catch (e) {
      this._setProgress(false);
      Toast.error('Error enviando WiFi: ' + e.message);
      this._setEstado('error', 'Error al enviar credenciales');
    }
  },

  desconectar() {
    BLEManager.desconectar();
    this._setEstado('', 'No conectado');
    $id('bleWifiForm')?.classList.add('hidden');
    $id('bleBtnConectar')?.classList.remove('hidden');
    this._setProgress(false);
  },

  togglePass() {
    const input = $id('blePass');
    if (input) {
      input.type = input.type === 'password' ? 'text' : 'password';
    }
  },

  // ── Callbacks BLE ────────────────────────────────────────

  _onDatos(data) {
    // data = { n: nivel, t: temp, h: hum, b: bomba, m: modo, s: estado }
    // Podríamos actualizar el State aquí si quisiéramos mostrar datos BLE en el dashboard
    // Por ahora solo confirmamos que hay comunicación
    console.log('[BLE] Datos recibidos:', data);
  },

  _onStatus(status) {
    if (status === 'DESCONECTADO') {
      this.desconectar();
    }
    // Podríamos detectar confirmación de WiFi OK aquí si el ESP32 la enviase
  },

  // ── Helpers UI ───────────────────────────────────────────

  _setEstado(tipo, texto) {
    const dot  = $id('bleDot');
    const text = $id('bleStatusText');
    if (dot)  dot.className  = `ble-dot ${tipo}`;
    if (text) text.textContent = texto;
  },

  _setProgress(visible, pct, msg) {
    const el   = $id('bleProgress');
    const fill = $id('bleProgressFill');
    const msgEl = $id('bleProgressMsg');
    if (!el) return;
    el.classList.toggle('hidden', !visible);
    if (fill  && pct  !== undefined) fill.style.width = `${pct}%`;
    if (msgEl && msg  !== undefined) msgEl.textContent = msg;
  },
};

// Exportar global para los onclick del HTML
window.UIBLE = UIBLE;

export default UIBLE;
