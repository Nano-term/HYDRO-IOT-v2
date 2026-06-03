/**
 * ble.manager.js — Conexión BLE desde la PWA
 * ============================================
 * Usa la Web Bluetooth API (Chrome/Edge en Android/desktop).
 * Permite reconfigurar el WiFi del ESP32 sin reflashear.
 *
 * UUIDs deben coincidir exactamente con mod_bluetooth.h del ESP32:
 *   SERVICE:   4fafc201-1fb5-459e-8fcc-c5c9c331914b
 *   WIFI_CFG:  beb54842-36e1-4688-b7f5-ea07361b26ac  (write)
 *   SENSORS:   beb5483e-36e1-4688-b7f5-ea07361b26a8  (notify)
 *   STATUS:    beb54843-36e1-4688-b7f5-ea07361b26ad  (notify)
 *   CMD_BOMBA: beb5483f-36e1-4688-b7f5-ea07361b26a9  (write)
 *   CMD_MODO:  beb54840-36e1-4688-b7f5-ea07361b26aa  (write)
 */

import { Toast } from '../utils/toast.js';

const SERVICE_UUID   = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
const CHAR_WIFI_CFG  = 'beb54842-36e1-4688-b7f5-ea07361b26ac';
const CHAR_SENSORS   = 'beb5483e-36e1-4688-b7f5-ea07361b26a8';
const CHAR_STATUS    = 'beb54843-36e1-4688-b7f5-ea07361b26ad';
const CHAR_CMD_BOMBA = 'beb5483f-36e1-4688-b7f5-ea07361b26a9';
const CHAR_CMD_MODO  = 'beb54840-36e1-4688-b7f5-ea07361b26aa';

let _device    = null;
let _server    = null;
let _service   = null;
let _chars     = {};
let _onData    = null;  // callback cuando llegan datos de sensores
let _onStatus  = null;  // callback cuando cambia el estado

export const BLEManager = {

  /** ¿Está disponible Web Bluetooth en este navegador? */
  isSupported() {
    return typeof navigator !== 'undefined' &&
           navigator.bluetooth !== undefined;
  },

  /** ¿Hay un dispositivo conectado? */
  isConnected() {
    return _device !== null && _server !== null && _server.connected;
  },

  /**
   * Escanea y conecta al ESP32.
   * Filtra por nombre "HIDRO-" para no mostrar todos los BT del entorno.
   */
  async conectar(onData, onStatus) {
    if (!this.isSupported()) {
      Toast.error('Web Bluetooth no disponible. Usa Chrome o Edge en Android/desktop.');
      throw new Error('BLE no soportado');
    }

    _onData   = onData;
    _onStatus = onStatus;

    try {
      // Solicitar dispositivo — el navegador muestra el selector nativo
      _device = await navigator.bluetooth.requestDevice({
        filters: [
          { namePrefix: 'HIDRO-' }
        ],
        optionalServices: [SERVICE_UUID]
      });

      _device.addEventListener('gattserverdisconnected', () => {
        this._onDesconectado();
      });

      Toast.info(`Conectando a ${_device.name}...`);

      // Conectar GATT
      _server  = await _device.gatt.connect();
      _service = await _server.getPrimaryService(SERVICE_UUID);

      // Obtener características
      _chars.wifiCfg  = await _service.getCharacteristic(CHAR_WIFI_CFG);
      _chars.cmdBomba = await _service.getCharacteristic(CHAR_CMD_BOMBA);
      _chars.cmdModo  = await _service.getCharacteristic(CHAR_CMD_MODO);

      // Suscribir a notificaciones de sensores
      try {
        _chars.sensors = await _service.getCharacteristic(CHAR_SENSORS);
        await _chars.sensors.startNotifications();
        _chars.sensors.addEventListener('characteristicvaluechanged', (e) => {
          this._onSensorData(e.target.value);
        });
      } catch(e) { /* opcional */ }

      // Suscribir a notificaciones de estado
      try {
        _chars.status = await _service.getCharacteristic(CHAR_STATUS);
        await _chars.status.startNotifications();
        _chars.status.addEventListener('characteristicvaluechanged', (e) => {
          const text = new TextDecoder().decode(e.target.value);
          if (_onStatus) _onStatus(text);
        });
      } catch(e) { /* opcional */ }

      Toast.success(`Conectado a ${_device.name}`);
      return { ok: true, nombre: _device.name };

    } catch (e) {
      _device = null;
      _server = null;
      if (e.name !== 'NotFoundError') {
        // NotFoundError = usuario canceló el selector, no es un error real
        Toast.error('Error BLE: ' + e.message);
      }
      throw e;
    }
  },

  /**
   * Envía las nuevas credenciales WiFi al ESP32.
   * Formato: "SSID:PASSWORD"
   * El ESP32 las guarda en flash (Preferences) y se reconecta.
   */
  async enviarWifi(ssid, password) {
    if (!this.isConnected()) throw new Error('No hay conexión BLE activa');
    if (!ssid || !password) throw new Error('SSID y contraseña son obligatorios');
    if (ssid.length > 32)   throw new Error('SSID demasiado largo (máx 32 caracteres)');

    const payload = `${ssid}:${password}`;
    const encoded = new TextEncoder().encode(payload);

    // BLE tiene límite de 512 bytes por característica
    if (encoded.length > 510) throw new Error('Credenciales demasiado largas');

    await _chars.wifiCfg.writeValue(encoded);
    Toast.success('Credenciales enviadas. El ESP32 se reconectará...');
    return true;
  },

  /**
   * Envía comando de bomba por BLE (útil cuando no hay WiFi/Firebase).
   */
  async enviarBomba(encender) {
    if (!this.isConnected()) throw new Error('No hay conexión BLE activa');
    const val = new TextEncoder().encode(encender ? '1' : '0');
    await _chars.cmdBomba.writeValue(val);
    Toast.success(`Bomba ${encender ? 'encendida' : 'apagada'} via BLE`);
  },

  /**
   * Envía comando de modo por BLE.
   */
  async enviarModo(modoAuto) {
    if (!this.isConnected()) throw new Error('No hay conexión BLE activa');
    const val = new TextEncoder().encode(modoAuto ? 'A' : 'M');
    await _chars.cmdModo.writeValue(val);
    Toast.success(`Modo ${modoAuto ? 'automático' : 'manual'} via BLE`);
  },

  /** Desconectar manualmente */
  desconectar() {
    _reconectManual = true;  // no auto-reconectar en desconexión manual
    if (_device && _device.gatt.connected) {
      _device.gatt.disconnect();
    }
    this._limpiar();
    Toast.info('BLE desconectado');
  },

  // ── Internos ─────────────────────────────────────────────

  _onSensorData(value) {
    try {
      const text = new TextDecoder().decode(value);
      const data = JSON.parse(text);
      // data = { n: nivel, t: temp, h: hum, b: bomba, m: modo, s: estado }
      if (_onData) _onData(data);
    } catch(e) { /* JSON malformado, ignorar */ }
  },

  _onDesconectado() {
    // Solo mostrar toast si era conexión activa (no si el usuario desconectó)
    if (_intentandoConectar) return; // ya hay reintento en marcha
    Toast.warning(`${_device?.name || 'ESP32'} desconectado`);
    if (_onStatus) _onStatus('DESCONECTADO');

    // Intentar reconexión automática si el dispositivo sigue disponible
    if (_device && !_reconectManual) {
      _intentandoConectar = true;
      console.log('[BLE] Intentando reconexión automática...');
      setTimeout(async () => {
        try {
          _server  = await _device.gatt.connect();
          _service = await _server.getPrimaryService(SERVICE_UUID);
          _chars.cmdBomba = await _service.getCharacteristic(CHAR_CMD_BOMBA);
          _chars.cmdModo  = await _service.getCharacteristic(CHAR_CMD_MODO);
          try {
            _chars.sensors = await _service.getCharacteristic(CHAR_SENSORS);
            await _chars.sensors.startNotifications();
            _chars.sensors.addEventListener('characteristicvaluechanged',
              (e) => this._onSensorData(e.target.value));
          } catch(e) {}
          _intentandoConectar = false;
          Toast.success('BLE reconectado');
          if (_onStatus) _onStatus('CONECTADO');
        } catch(e) {
          _intentandoConectar = false;
          this._limpiar();
          console.warn('[BLE] Reconexión fallida:', e.message);
        }
      }, 2000);
    } else {
      this._limpiar();
    }
  },

  _limpiar() {
    _device   = null;
    _server   = null;
    _service  = null;
    _chars    = {};
    _reconectManual = false;
  },

  getNombre() {
    return _device?.name || null;
  },
};

export default BLEManager;