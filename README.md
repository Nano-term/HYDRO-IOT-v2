# HidroGanadero IoT — PWA
## Versión 2.0.0 | Progressive Web App

---

## Qué hay de nuevo en v2.0

- **Siempre carga** — muestra últimos datos conocidos aunque no haya señal
- **Modo BLE offline** — recibe datos directos del ESP32 por Bluetooth sin WiFi
- **Simulación por módulo** — simula sensores individuales (menú oculto)
- **Badge de fuente** — indica si los datos vienen de Firebase, BLE, simulación o caché
- **Timestamp** — muestra cuándo fue la última lectura y hace cuánto tiempo

---

## Estructura de archivos

```
hidricov2/
├── index.html
├── manifest.json
├── sw.js
├── package.json
├── public/icons/
│   ├── icon.svg
│   ├── icon-192.png
│   └── icon-512.png
└── src/
    ├── css/
    │   ├── main.css
    │   └── animations.css
    └── js/
        ├── app.js
        ├── state.js
        ├── router.js
        ├── config/app.config.js     ← EDITAR AQUÍ
        ├── firebase/firebase.js
        ├── bluetooth/ble.manager.js
        ├── device/device.manager.js
        ├── simulators/sim.main.js
        ├── modules/estados.module.js
        ├── ui/
        │   ├── ui.dashboard.js
        │   ├── ui.control.js
        │   ├── ui.modules.js
        │   ├── ui.config.js
        │   └── ui.ble.js
        └── utils/toast.js
```

---

## PASO 1 — Configurar Firebase

### 1.1 Crear proyecto

1. Ir a [console.firebase.google.com](https://console.firebase.google.com)
2. Agregar proyecto → nombre cualquiera → sin Analytics
3. Realtime Database → Crear → Modo de prueba
4. Authentication → Sign-in method → Correo/contraseña → Activar
5. Authentication → Users → Agregar usuario (para el ESP32)

### 1.2 Credenciales

Engranaje ⚙ → Configuración del proyecto → General → Tus apps → `</>` → Registrar app.

Pegar en `src/js/config/app.config.js`:

```javascript
FIREBASE: {
  apiKey:            "AIzaSy...",
  authDomain:        "tu-proyecto.firebaseapp.com",
  databaseURL:       "https://tu-proyecto-default-rtdb.firebaseio.com/",
  projectId:         "tu-proyecto",
  storageBucket:     "tu-proyecto.appspot.com",
  messagingSenderId: "...",
  appId:             "..."
},
DEVICE_ID: "tanque_001",
```

### 1.3 Reglas RTDB

```json
{ "rules": { ".read": true, ".write": true } }
```

### 1.4 Datos iniciales (importar JSON)

```json
{
  "dispositivos": { "tanque_001": { "info": { "online": false }, "lecturas": {}, "configuracion": { "nivel_minimo": 25, "nivel_maximo": 90 } } },
  "alertas": { "tanque_001": [] },
  "comandos": { "tanque_001": { "bomba": false, "modo_auto": true, "timestamp": 0 } }
}
```

---

## PASO 2 — Iconos PNG

```bash
# Con ImageMagick
convert public/icons/icon.svg -resize 192x192 public/icons/icon-192.png
convert public/icons/icon.svg -resize 512x512 public/icons/icon-512.png

# O usar squoosh.app (sin instalar nada)
```

---

## PASO 3 — Probar localmente

```bash
npm install
npm run dev
# Abrir: http://localhost:3000
```

---

## PASO 4 — Desplegar

### Netlify (recomendado)
Arrastrar la carpeta `hidricov2/` al dashboard de Netlify.

### GitHub Pages
```bash
git init && git add . && git commit -m "v2.0"
git push origin main
# Settings → Pages → main / root
```

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting   # public dir: .
firebase deploy --only hosting
```

---

## Modos de datos

| Modo | Cuándo | Fuente | Badge |
|------|--------|--------|-------|
| En línea | ESP32 con WiFi y Firebase OK | Firebase RTDB | `● En línea` |
| BLE | Sin WiFi, conectado por Bluetooth | ESP32 directo | `⟡ BLE` |
| Simulación | Sin ESP32 o activado manualmente | Simuladores PWA | `◈ Simulación` |
| Caché | Sin conexión, datos previos disponibles | localStorage | `⊙ Sin conexión` |

La PWA **siempre carga** — si no hay datos en tiempo real muestra los últimos conocidos con un badge indicando hace cuánto tiempo fueron recibidos.

---

## Modo BLE (sin WiFi)

Cuando no hay WiFi disponible en el campo:

1. Ir a **Configuración** → sección **"Fuente de datos"**
2. Clic en **"Bluetooth (BLE)"**
3. Seleccionar `HIDRO-tanque_001` en el selector del navegador
4. El dashboard recibe datos directos del ESP32 en tiempo real

Para volver a Firebase: clic en **"Firebase / WiFi"**.

> ⚠ Web Bluetooth requiere Chrome o Edge en Android o escritorio.

En modo BLE no hay historial — solo datos en vivo del momento.

---

## Simulación por módulo (menú oculto)

Para simular sensores individuales sin afectar los demás:

1. Ir a **Configuración**
2. Tocar el título **"Configuración"** 3 veces rápido
3. Aparece el panel **"Simulación por módulo"**
4. Activar los sensores que quieres simular

Útil cuando no tienes todos los sensores físicos conectados al ESP32. Por ejemplo: activar simulación de Nivel y Temperatura mientras el resto lee datos reales.

La simulación por módulo es diferente a la simulación completa:
- **Simulación completa** (toggle en Modo de datos): corta la comunicación con el ESP32 y simula todo
- **Simulación por módulo**: mantiene la comunicación con el ESP32 pero reemplaza sensores individuales con valores simulados

---

## Configuración en mod_config.h (ESP32)

```cpp
#define WIFI_SSID        "TuRed"
#define WIFI_PASS        "TuContraseña"
#define FIREBASE_API_KEY "AIzaSy..."
#define FIREBASE_DB_URL  "tu-proyecto-default-rtdb.firebaseio.com/"  // sin https://, con /
#define FIREBASE_EMAIL   "esp32@tuproyecto.com"
#define FIREBASE_PASS    "contraseña"
#define DEVICE_ID        "tanque_001"
```

---

## Solución de problemas

| Síntoma | Causa | Solución |
|---------|-------|---------|
| Dashboard muestra caché siempre | Firebase sin datos del ESP32 | Verificar WiFi del ESP32 y credenciales |
| BLE no encuentra ESP32 | Safari/Firefox o no HTTPS | Usar Chrome/Edge en Android o escritorio |
| Panel oculto no aparece | Toques muy lentos | Tres toques rápidos en menos de 800ms |
| Simulación por módulo no afecta | Sim completa activa | Desactivar sim completa primero |
| No instala como app | Faltan icon-192.png/512.png | Generar PNGs con squoosh.app |
| CSS no carga | Archivos fuera de carpeta | Verificar estructura de directorios |
| Service Worker caché viejo | Version anterior cacheada | F12 → Application → Clear site data |
