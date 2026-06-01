# HidroGanadero IoT — PWA
## Versión 1.1.0 | Progressive Web App

---

## Qué es esta PWA

Dashboard web instalable que muestra en tiempo real los datos del nodo ESP32. Conecta directo a Firebase Realtime Database — el mismo que usa el firmware.

Cuando el ESP32 no tiene señal o no está conectado, la PWA activa automáticamente sus simuladores locales y sigue mostrando datos realistas para demostración o prueba.

---

## Estructura de archivos

```
hidricov2/
├── index.html
├── manifest.json
├── sw.js
├── package.json
├── public/
│   └── icons/
│       ├── icon.svg
│       ├── icon-192.png      ← generar desde icon.svg
│       └── icon-512.png      ← generar desde icon.svg
└── src/
    ├── css/
    │   ├── main.css
    │   └── animations.css
    └── js/
        ├── app.js
        ├── state.js
        ├── router.js
        ├── config/
        │   └── app.config.js     ← EDITAR AQUÍ
        ├── firebase/
        │   └── firebase.js
        ├── bluetooth/
        │   └── ble.manager.js
        ├── device/
        │   └── device.manager.js
        ├── simulators/
        │   └── sim.main.js
        ├── modules/
        │   └── estados.module.js
        ├── ui/
        │   ├── ui.dashboard.js
        │   ├── ui.control.js
        │   ├── ui.modules.js
        │   └── ui.ble.js
        └── utils/
            └── toast.js
```

Crear las carpetas con un solo comando:
```bash
mkdir -p public/icons src/css src/js/{config,firebase,bluetooth,device,simulators,modules,ui,utils}
```

---

## PASO 1 — Configurar Firebase

### 1.1 Crear proyecto Firebase

1. Ir a [console.firebase.google.com](https://console.firebase.google.com)
2. Clic en **Agregar proyecto**
3. Nombre: `hidro-ganadero-iot` (o el que prefieras)
4. Google Analytics: desactivar (no es necesario)
5. Clic en **Crear proyecto**

### 1.2 Crear Realtime Database

> ⚠ Este proyecto usa **Realtime Database**, NO Firestore. Son productos distintos.

1. Menú lateral → **Realtime Database**
2. Clic en **Crear base de datos**
3. Ubicación: la más cercana a tu país
4. Modo de inicio: **Modo de prueba** (válido 30 días, suficiente para desarrollo)
5. Clic en **Listo**
6. Copia la URL que aparece arriba: `https://tu-proyecto-default-rtdb.firebaseio.com/`

### 1.3 Habilitar Authentication

1. Menú lateral → **Authentication**
2. Pestaña **Sign-in method** → **Correo electrónico/contraseña** → Activar
3. Pestaña **Users** → **Agregar usuario**:
   - Email: `esp32@tuproyecto.com` ← este usuario es para el ESP32
   - Contraseña: una contraseña segura que tú elijas
4. Clic en **Agregar usuario**

### 1.4 Crear app web y obtener credenciales

1. Engranaje ⚙ → **Configuración del proyecto**
2. Pestaña **General** → bajar hasta "Tus apps"
3. Clic en `</>` (Web)
4. Nombre de la app: `hidro-pwa` → Registrar app
5. Copia el objeto `firebaseConfig` que aparece

### 1.5 Pegar credenciales en la PWA

Abrir `src/js/config/app.config.js` y rellenar:

```javascript
FIREBASE: {
  apiKey:            "AIzaSy-TU-API-KEY",
  authDomain:        "tu-proyecto.firebaseapp.com",
  databaseURL:       "https://tu-proyecto-default-rtdb.firebaseio.com/",
  projectId:         "tu-proyecto",
  storageBucket:     "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId:             "1:123456789:web:abcdef"
},
DEVICE_ID: "tanque_001",   // debe coincidir con DEVICE_ID en mod_config.h del ESP32
```

### 1.6 Reglas de seguridad RTDB

Firebase Console → Realtime Database → pestaña **Reglas** → reemplazar con:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

Clic en **Publicar**. (Para producción usar reglas con auth, ver sección al final.)

### 1.7 Importar estructura inicial de datos

Firebase Console → Realtime Database → pestaña **Datos** → tres puntos `⋮` → **Importar JSON**:

```json
{
  "dispositivos": {
    "tanque_001": {
      "info": { "online": false, "firmware": "2.1.0" },
      "lecturas": {},
      "configuracion": {
        "nivel_minimo": 25,
        "nivel_maximo": 90,
        "modo_auto_default": true
      }
    }
  },
  "alertas":  { "tanque_001": [] },
  "comandos": {
    "tanque_001": {
      "bomba": false,
      "modo_auto": true,
      "timestamp": 0
    }
  }
}
```

---

## PASO 2 — Generar íconos PNG

Los íconos PNG son necesarios para que la PWA sea instalable como app.

**Opción A — Sin instalar nada (recomendada):**
1. Abrir [squoosh.app](https://squoosh.app)
2. Arrastrar `public/icons/icon.svg`
3. Exportar como PNG 192×192 → guardar como `public/icons/icon-192.png`
4. Repetir, exportar 512×512 → guardar como `public/icons/icon-512.png`

**Opción B — Con ImageMagick:**
```bash
convert public/icons/icon.svg -resize 192x192 public/icons/icon-192.png
convert public/icons/icon.svg -resize 512x512 public/icons/icon-512.png
```

---

## PASO 3 — Probar localmente

> ⚠ Abrir `index.html` directo con doble clic no funciona. Debe servirse por HTTP.

```bash
# Opción 1 — npm (recomendada)
npm install
npm run dev
# Abrir: http://localhost:3000

# Opción 2 — Python (sin instalar nada extra)
python3 -m http.server 3000
# Abrir: http://localhost:3000

# Opción 3 — VS Code
# Instalar extensión "Live Server"
# Clic derecho en index.html → "Open with Live Server"
```

Si el dashboard muestra datos (aunque sea "SIM"), la PWA está funcionando.

---

## PASO 4 — Subir a la web (opciones gratuitas)

### Opción A — Netlify (más fácil, recomendada)

**Sin cuenta de GitHub:**
1. Crear cuenta en [netlify.com](https://netlify.com) (gratis)
2. En el dashboard de Netlify → área **"Sites"**
3. Arrastrar toda la carpeta `hidricov2/` al área que dice *"Drag and drop your site folder here"*
4. Netlify despliega automáticamente en ~30 segundos
5. URL generada automáticamente: `https://nombre-aleatorio.netlify.app`

**Para personalizar la URL:**
- En tu sitio → **Site settings** → **Change site name** → escribir `hidro-ganadero`
- URL queda: `https://hidro-ganadero.netlify.app`

**Para actualizar después:**
- Vuelve a arrastrar la carpeta — Netlify reemplaza automáticamente

---

### Opción B — GitHub Pages (gratis, URL permanente)

1. Crear cuenta en [github.com](https://github.com) si no tienes
2. Crear repositorio nuevo → nombre: `hidro-ganadero-pwa` → **Public**
3. Subir todos los archivos:
   ```bash
   cd hidricov2
   git init
   git add .
   git commit -m "PWA HidroGanadero v1.1.0"
   git branch -M main
   git remote add origin https://github.com/tu-usuario/hidro-ganadero-pwa.git
   git push -u origin main
   ```
4. En el repositorio → **Settings** → **Pages**
5. Source: **Deploy from a branch** → Branch: `main` → Folder: `/ (root)`
6. Clic en **Save**
7. URL: `https://tu-usuario.github.io/hidro-ganadero-pwa`

> ⚠ GitHub Pages puede tardar 2-5 minutos en activarse la primera vez.

---

### Opción C — Firebase Hosting (mismo proyecto Firebase)

Ventaja: misma consola, dominio `.web.app` incluido.

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Iniciar sesión
firebase login

# En la carpeta hidricov2/
cd hidricov2
firebase init hosting

# Respuestas al asistente:
# ? Which Firebase project? → seleccionar tu proyecto
# ? What do you want to use as your public directory? → . (punto, la raíz)
# ? Configure as single-page app? → No
# ? Set up automatic builds with GitHub? → No

# Desplegar
firebase deploy --only hosting
```

URL resultado: `https://tu-proyecto.web.app`

---

### Opción D — Vercel

1. Crear cuenta en [vercel.com](https://vercel.com)
2. **New Project** → **Import** → subir carpeta o conectar GitHub
3. Framework preset: **Other**
4. Build command: dejar vacío
5. Output directory: `.` (punto)
6. Clic en **Deploy**

URL: `https://hidro-ganadero.vercel.app`

---

## PASO 5 — Instalar como app nativa

Una vez desplegada en cualquiera de las opciones anteriores:

**En Android (Chrome):**
1. Abrir la URL en Chrome
2. Menú `⋮` → **Agregar a pantalla de inicio**
3. La app aparece como ícono en el lanzador

**En computadora (Chrome/Edge):**
1. Abrir la URL
2. Barra de dirección → ícono `⊕` de instalación
3. O menú → **Instalar HidroGanadero IoT**

**En iOS (Safari):**
1. Abrir la URL en Safari
2. Botón compartir → **Agregar a inicio**

---

## Cómo funciona con el ESP32

### Flujo en tiempo real

```
ESP32 (cada 10s)  →  Firebase RTDB  →  PWA (instantáneo)
PWA (comando)     →  Firebase RTDB  →  ESP32 (cada 3s lee /comandos)
```

### Rutas en Firebase

| Ruta RTDB | Quién escribe | Quién lee |
|-----------|---------------|-----------|
| `/dispositivos/tanque_001/lecturas` | ESP32 | PWA |
| `/dispositivos/tanque_001/info` | ESP32 | PWA |
| `/alertas/tanque_001` | ESP32 | PWA |
| `/comandos/tanque_001` | PWA | ESP32 cada 3s |
| `/notas/tanque_001` | PWA | PWA |

### Cuando el ESP32 no tiene señal

El watchdog detecta si pasan 30 segundos sin datos. Automáticamente:
1. Activa los simuladores locales
2. Muestra banner naranja "Sin conexión"
3. El badge `SIM` aparece en el dashboard
4. Cuando el ESP32 vuelve, la simulación se apaga sola

---

## Cambiar WiFi del ESP32 desde la PWA (BLE)

Si mueves el tanque a otro lugar con diferente red:

1. Ir a **Configuración** en la PWA
2. Sección **"Cambiar WiFi del ESP32 (Bluetooth)"**
3. Clic en **"Buscar ESP32 por Bluetooth"** → seleccionar `HIDRO-tanque_001`
4. Ingresar nuevo SSID y contraseña
5. Clic en **"Enviar nueva red al ESP32"**
6. El ESP32 guarda en flash y reinicia automáticamente
7. En ~10 segundos vuelve a aparecer en el dashboard

> ⚠ Web Bluetooth solo funciona en **Chrome o Edge** en Android o escritorio. No funciona en Safari ni Firefox.

---

## Páginas de la app

| Página | Hash | Función |
|--------|------|---------|
| Dashboard | `#dashboard` | Métricas principales + semáforo de estado |
| Control | `#control` | AND gate, bomba, modo, info del dispositivo |
| Alertas | `#alertas` | Alertas activas del ESP32 |
| Historial | `#historial` | 4 gráficas Chart.js |
| Notas | `#notas` | Notas del operador guardadas en Firebase |
| Configuración | `#config` | Umbrales, device ID, simulación, WiFi BLE |

---

## Modos de datos

| Modo | Cuándo activa | Fuente |
|------|---------------|--------|
| En línea | ESP32 con WiFi y Firebase OK | Firebase RTDB |
| Offline automático | Sin datos más de 30s | Simuladores locales |
| Simulación manual | Config → activar toggle | Simuladores locales |

---

## Múltiples tanques

Para monitorear otro tanque:
1. Ir a **Configuración** → campo **Device ID**
2. Escribir el ID del otro nodo (ej: `tanque_002`)
3. Guardar — la PWA se reconecta al nuevo nodo en Firebase

El segundo ESP32 debe tener en `mod_config.h`:
```cpp
#define DEVICE_ID "tanque_002"
```

---

## Reglas Firebase para producción

Cuando el proyecto salga del modo prueba, usar estas reglas más seguras:

```json
{
  "rules": {
    "dispositivos": {
      "$deviceId": {
        ".read":  "auth != null",
        ".write": "auth != null"
      }
    },
    "alertas":  { ".read": "auth != null", ".write": "auth != null" },
    "comandos": { ".read": "auth != null", ".write": "auth != null" },
    "notas":    { ".read": "auth != null", ".write": "auth != null" }
  }
}
```

---

## Notas técnicas

- Sin build: ES Modules nativos del navegador. No requiere npm, webpack ni Babel.
- Firebase SDK v10 cargado desde CDN de Google.
- Chart.js v4 cargado desde cdnjs solo cuando se visita Historial.
- Sin backend propio: toda la lógica corre en el navegador o en Firebase.

---

## Solución de problemas

| Síntoma | Causa | Solución |
|---------|-------|---------|
| Dashboard muestra "SIM" siempre | Firebase no configurado | Completar `app.config.js` con las credenciales reales |
| Datos no se actualizan | DEVICE_ID no coincide | Verificar que sea igual en `app.config.js` y `mod_config.h` |
| Comandos no llegan | Reglas RTDB expiradas | Renovar reglas en Firebase Console |
| AND gate en rojo siempre | ESP32 sin WiFi o sin Firebase | Verificar conexión del ESP32 |
| Gráficas vacías | Sin historial acumulado | Esperar lecturas o activar modo SIM |
| No instala como app | Faltan icon-192.png / icon-512.png | Generar PNGs según Paso 2 |
| Error Service Worker | Servido desde `file://` | Usar `npm run dev` o `python3 -m http.server` |
| BLE no encuentra ESP32 | Safari/Firefox o iOS | Usar Chrome o Edge en Android/escritorio |
| CSS no carga | Archivos fuera de carpeta | Verificar estructura de carpetas del Paso 3 |
