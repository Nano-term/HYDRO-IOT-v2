/**
 * ble.manager.js — Web Bluetooth con reconexión GATT robusta
 */

import { Toast } from '../utils/toast.js';

const SERVICE_UUID   = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
const CHAR_WIFI_CFG  = 'beb54842-36e1-4688-b7f5-ea07361b26ac';
const CHAR_SENSORS   = 'beb5483e-36e1-4688-b7f5-ea07361b26a8';
const CHAR_STATUS    = 'beb54843-36e1-4688-b7f5-ea07361b26ad';
const CHAR_CMD_BOMBA = 'beb5483f-36e1-4688-b7f5-ea07361b26a9';
const CHAR_CMD_MODO  = 'beb54840-36e1-4688-b7f5-ea07361b26aa';

let _device   = null;
let _server   = null;
let _service  = null;
let _chars    = {};
let _onData   = null;
let _onStatus = null;

export const BLEManager = {

  isSupported() {
    return typeof navigator !== 'undefined' && navigator.bluetooth !== undefined;
  },

  isConnected() {
    return _device !== null && _server !== null && _server.connected;
  },

  async conectar(onData, onStatus) {
    if (!this.isSupported()) {
      Toast.error('Web Bluetooth no disponible. Usa Chrome o Edge.');
      throw new Error('BLE no soportado');
    }

    _onData   = onData;
    _onStatus = onStatus;

    try {
      // Solo pedir dispositivo si no tenemos uno ya
      if (!_device) {
        _device = await navigator.bluetooth.requestDevice({
          filters: [{ namePrefix: 'HIDRO-' }],
          optionalServices: [SERVICE_UUID]
        });

        _device.addEventListener('gattserverdisconnected', () => {
          this._onDesconectado();
        });
      }

      Toast.info(`Conectando a ${_device.name}...`);

      // Conectar o reconectar GATT
      _server = await _device.gatt.connect();

      // Esperar un momento para que el servidor GATT se estabilice
      await new Promise(r => setTimeout(r, 500));

      _service = await _server.getPrimaryService(SERVICE_UUID);

      // Obtener características con manejo de errores individual
      try { _chars.wifiCfg  = await _service.getCharacteristic(CHAR_WIFI_CFG); } catch(e) {}
      try { _chars.cmdBomba = await _service.getCharacteristic(CHAR_CMD_BOMBA); } catch(e) {}
      try { _chars.cmdModo  = await _service.getCharacteristic(CHAR_CMD_MODO); } catch(e) {}

      // Notificaciones opcionales
      try {
        _chars.sensors = await _service.getCharacteristic(CHAR_SENSORS);
        await _chars.sensors.startNotifications();
        _chars.sensors.addEventListener('characteristicvaluechanged', (e) => {
          this._onSensorData(e.target.value);
        });
      } catch(e) {}

      try {
        _chars.status = await _service.getCharacteristic(CHAR_STATUS);
        await _chars.status.startNotifications();
        _chars.status.addEventListener('characteristicvaluechanged', (e) => {
          const text = new TextDecoder().decode(e.target.value);
          if (_onStatus) _onStatus(text);
        });
      } catch(e) {}

      Toast.success(`Conectado a ${_device.name}`);
      return { ok: true, nombre: _device.name };

    } catch (e) {
      if (e.name === 'NotFoundError') {
        _device = null;
      }
      // No limpiar _device en errores GATT — permite reconexión
      if (e.name !== 'NotFoundError') {
        throw e;
      }
      throw e;
    }
  },

  async enviarWifi(ssid, password) {
    if (!this.isConnected()) throw new Error('GATT Server is disconnected. (Re)connect first');
    if (!_chars.wifiCfg) throw new Error('Característica WiFi no disponible');

    const payload = `${ssid}:${password}`;
    const encoded = new TextEncoder().encode(payload);
    if (encoded.length > 510) throw new Error('Credenciales demasiado largas');

    await _chars.wifiCfg.writeValue(encoded);
    Toast.success('Credenciales enviadas al ESP32');
    return true;
  },

  async enviarBomba(encender) {
    if (!this.isConnected()) throw new Error('Sin conexión BLE');
    await _chars.cmdBomba.writeValue(new TextEncoder().encode(encender ? '1' : '0'));
  },

  async enviarModo(modoAuto) {
    if (!this.isConnected()) throw new Error('Sin conexión BLE');
    await _chars.cmdModo.writeValue(new TextEncoder().encode(modoAuto ? 'A' : 'M'));
  },

  desconectar() {
    if (_device && _device.gatt.connected) _device.gatt.disconnect();
    this._limpiar();
  },

  _onSensorData(value) {
    try {
      const data = JSON.parse(new TextDecoder().decode(value));
      if (_onData) _onData(data);
    } catch(e) {}
  },

  _onDesconectado() {
    Toast.warning(`${_device?.name || 'ESP32'} desconectado`);
    _server  = null;
    _service = null;
    _chars   = {};
    if (_onStatus) _onStatus('DESCONECTADO');
    // NO limpiamos _device — permite reconexión sin volver a buscar
  },

  _limpiar() {
    _device   = null;
    _server   = null;
    _service  = null;
    _chars    = {};
  },

  getNombre() { return _device?.name || null; },
};

export default BLEManager;
