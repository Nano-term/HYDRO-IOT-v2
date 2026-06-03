This file is a merged representation of the entire codebase, combined into a single document by Repomix.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
public/
  icons/
    icon-192.png
    icon-512.png
src/
  css/
    animations.css
    main.css
  js/
    bluetooth/
      ble.manager.js
    config/
      app.config.js
    device/
      device.manager.js
    firebase/
      firebase.js
    modules/
      estados.module.js
      ui.modules.js
    simulators/
      sim.main.js
    ui/
      ui.ble.js
      ui.config.js
      ui.control.js
      ui.dashboard.js
      ui.modules.js
    utils/
      toast.js
    app.js
    router.js
    state.js
starters/
  jsonestrter
  jsonestrter.json
index.html
malo.jpeg
manifest.json
package.json
README.md
sw.js
```

# Files

## File: src/css/animations.css
````css
/* ============================================================
   ANIMATIONS.CSS — Keyframes y animaciones del sistema
   ============================================================ */

/* Parpadeo alerta crítica */
@keyframes parpadeoAlerta {
  0%, 100% { border-color: var(--red); }
  50%       { border-color: transparent; }
}
.estado-card.estado-critico { animation: parpadeoAlerta 1s ease infinite; }

/* Pulso bomba encendida */
@keyframes pulsoBomba {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.8; transform: scale(1.05); }
}
.bomba-visual.on { animation: pulsoBomba 2s ease-in-out infinite; }

/* Onda agua en tanque */
@keyframes ondaAgua {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.tanque-mini-fill::after {
  content: '';
  position: absolute;
  top: -4px; left: 0;
  width: 200%; height: 8px;
  background: repeating-linear-gradient(
    90deg,
    transparent 0, transparent 14px,
    rgba(255,255,255,0.2) 14px, rgba(255,255,255,0.2) 28px
  );
  animation: ondaAgua 2s linear infinite;
}

/* Badge entrada */
@keyframes badgeEntra {
  from { transform: scale(0); }
  to   { transform: scale(1); }
}
.badge { animation: badgeEntra 0.2s ease; }

/* Fade in sección */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
.page.active { animation: fadeInUp 0.25s ease; }

/* Spin (cargando) */
@keyframes spin {
  to { transform: rotate(360deg); }
}
.spin { animation: spin 1s linear infinite; }

/* Heartbeat LED */
@keyframes heartbeat {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.3; }
}
.status-dot.normal { animation: heartbeat 2s ease-in-out infinite; }
````

## File: src/css/main.css
````css
/* ============================================================
   HIDROGANADERO IoT — main.css
   Variables, layout, componentes, tema
   ============================================================ */

:root {
  --bg:         #0d1f2c;
  --bg2:        #122435;
  --bg3:        #163045;
  --surface:    #1a3a52;
  --surface2:   #1e4260;
  --border:     rgba(255,255,255,0.08);
  --text:       #e2eaf2;
  --text2:      #8ba4ba;
  --text3:      #5a7a96;
  --accent:     #2c9cbf;
  --accent2:    #1b6b87;
  --green:      #22c55e;
  --amber:      #f59e0b;
  --red:        #ef4444;
  --teal:       #14b8a6;
  --orange:     #f97316;
  --nav-w:      240px;
  --radius:     12px;
  --radius-lg:  20px;
  --shadow:     0 4px 24px rgba(0,0,0,0.35);
  --transition: 200ms ease;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { scroll-behavior: smooth; }

body {
  background: var(--bg);
  color: var(--text);
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  font-size: 15px;
  line-height: 1.5;
  min-height: 100vh;
  overflow-x: hidden;
}

.hidden { display: none !important; }

/* ─── SPLASH ────────────────────────────────────────────── */
.splash {
  position: fixed; inset: 0;
  background: var(--bg);
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 24px; z-index: 1000;
  transition: opacity 0.6s ease;
}
.splash.fade-out { opacity: 0; pointer-events: none; }
.splash-logo {
  display: flex; align-items: center; gap: 14px;
  font-size: 1.6rem; font-weight: 600; color: var(--accent);
}
.splash-bar {
  width: 220px; height: 4px; background: var(--surface);
  border-radius: 99px; overflow: hidden;
}
.splash-fill {
  height: 100%; width: 0%;
  background: linear-gradient(90deg, var(--accent2), var(--accent));
  border-radius: 99px;
  transition: width 0.1s linear;
}
.splash-sub { color: var(--text2); font-size: 0.9rem; }

/* ─── APP SHELL ─────────────────────────────────────────── */
.app {
  display: flex;
  min-height: 100vh;
}

/* ─── NAV SIDEBAR ───────────────────────────────────────── */
.nav {
  width: var(--nav-w);
  background: var(--bg2);
  border-right: 1px solid var(--border);
  display: flex; flex-direction: column;
  position: fixed; top: 0; left: 0; bottom: 0;
  z-index: 200;
  transition: transform var(--transition);
}
.nav-header {
  display: flex; align-items: center; gap: 10px;
  padding: 20px 16px 16px;
  border-bottom: 1px solid var(--border);
}
.nav-logo-icon { color: var(--accent); flex-shrink: 0; }
.nav-logo-text { font-weight: 600; font-size: 0.95rem; color: var(--text); }
.nav-logo-sub  { font-size: 0.75rem; color: var(--text3); font-family: monospace; }

.nav-status-bar {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 16px;
  font-size: 0.8rem; color: var(--text2);
}
.status-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--text3);
  flex-shrink: 0;
}
.status-dot.normal   { background: var(--green); box-shadow: 0 0 6px var(--green); }
.status-dot.precauc  { background: var(--amber); }
.status-dot.alerta   { background: var(--red); }
.status-dot.offline  { background: var(--text3); }

.nav-links { list-style: none; padding: 8px 0; flex: 1; }
.nav-link {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 16px; color: var(--text2); text-decoration: none;
  font-size: 0.9rem; border-radius: 0;
  transition: background var(--transition), color var(--transition);
  position: relative;
}
.nav-link:hover { background: var(--surface); color: var(--text); }
.nav-link.active {
  background: var(--surface);
  color: var(--accent);
  border-right: 3px solid var(--accent);
}
.nav-link svg { flex-shrink: 0; opacity: 0.7; }
.nav-link.active svg { opacity: 1; }

.badge {
  background: var(--red); color: white;
  font-size: 0.7rem; font-weight: 700;
  padding: 1px 6px; border-radius: 99px;
  margin-left: auto;
}

.nav-footer {
  padding: 12px 16px;
  border-top: 1px solid var(--border);
  font-size: 0.75rem; color: var(--text3);
  line-height: 1.8;
}

/* ─── MAIN CONTENT ──────────────────────────────────────── */
.main {
  margin-left: var(--nav-w);
  flex: 1;
  padding: 24px;
  min-height: 100vh;
}

.page { display: none; }
.page.active { display: block; }

.page-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 20px;
}
.page-header h1 {
  font-size: 1.5rem; font-weight: 600; color: var(--text);
}
.header-right { display: flex; align-items: center; gap: 10px; }

/* ─── BADGES ────────────────────────────────────────────── */
.online-badge {
  font-size: 0.8rem; color: var(--green);
  background: rgba(34,197,94,0.1);
  padding: 3px 10px; border-radius: 99px;
}
.offline-badge { color: var(--text3); background: var(--surface); }
.sim-badge {
  font-size: 0.75rem; color: var(--amber);
  background: rgba(245,158,11,0.15);
  padding: 2px 8px; border-radius: 99px;
  font-weight: 600;
}

/* ─── OFFLINE BANNER ────────────────────────────────────── */
.offline-banner {
  display: flex; align-items: center; gap: 8px;
  background: rgba(245,158,11,0.12);
  border: 1px solid rgba(245,158,11,0.3);
  border-radius: var(--radius);
  padding: 10px 16px;
  font-size: 0.85rem; color: var(--amber);
  margin-bottom: 16px;
}

/* ─── ESTADO CARD ───────────────────────────────────────── */
.estado-card {
  display: flex; align-items: center; gap: 20px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 20px 24px;
  margin-bottom: 20px;
  transition: border-color var(--transition);
}
.estado-card.estado-precauc { border-color: var(--amber); }
.estado-card.estado-alerta  { border-color: var(--red); }
.estado-card.estado-critico { border-color: var(--red); background: rgba(239,68,68,0.08); }

.semaforo {
  display: flex; flex-direction: column; gap: 6px; flex-shrink: 0;
}
.semaforo-dot {
  width: 16px; height: 16px; border-radius: 50%;
  opacity: 0.2; transition: opacity 0.3s, box-shadow 0.3s;
}
.semaforo-dot.rojo  { background: var(--red); }
.semaforo-dot.ambar { background: var(--amber); }
.semaforo-dot.verde { background: var(--green); }
.semaforo-dot.activo {
  opacity: 1;
  box-shadow: 0 0 10px currentColor;
}

.estado-info { flex: 1; }
.estado-label {
  font-size: 1.4rem; font-weight: 700; letter-spacing: 1px;
  color: var(--green);
}
.estado-label.precauc { color: var(--amber); }
.estado-label.alerta  { color: var(--red); }
.estado-sub { font-size: 0.85rem; color: var(--text2); margin-top: 2px; }

.tanque-mini {
  width: 48px; height: 72px;
  background: var(--bg3);
  border: 2px solid var(--border);
  border-radius: 6px;
  position: relative; overflow: hidden; flex-shrink: 0;
}
.tanque-mini-fill {
  position: absolute; bottom: 0; left: 0; right: 0;
  background: linear-gradient(to top, var(--accent2), var(--accent));
  transition: height 1s ease;
  height: 65%;
}
.tanque-mini-level {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.65rem; font-weight: 700; color: white;
  text-shadow: 0 1px 3px rgba(0,0,0,0.8);
  z-index: 1;
}

/* ─── METRICS GRID ──────────────────────────────────────── */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 14px;
  margin-bottom: 24px;
}
.metrics-grid.secondary { grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); }

.metric-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 18px 16px;
  display: flex; flex-direction: column; gap: 8px;
  transition: border-color var(--transition);
}
.metric-card:hover { border-color: var(--accent2); }
.metric-card.small { padding: 14px; }
.metric-card.alerta { border-color: var(--red); }
.metric-card.precauc { border-color: var(--amber); }

.metric-icon {
  width: 40px; height: 40px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
}
.metric-icon.blue   { background: rgba(44,156,191,0.15); color: var(--accent); }
.metric-icon.orange { background: rgba(249,115,22,0.15); color: var(--orange); }
.metric-icon.teal   { background: rgba(20,184,166,0.15); color: var(--teal); }
.metric-icon.green  { background: rgba(34,197,94,0.15);  color: var(--green); }
.metric-icon.red    { background: rgba(239,68,68,0.15);  color: var(--red); }

.metric-body { display: flex; align-items: baseline; gap: 4px; }
.metric-val  { font-size: 2rem; font-weight: 700; color: var(--text); font-variant-numeric: tabular-nums; }
.metric-card.small .metric-val { font-size: 1.5rem; }
.metric-unit { font-size: 0.85rem; color: var(--text2); }
.metric-label { font-size: 0.8rem; color: var(--text3); }

.metric-bar {
  height: 4px; background: var(--bg3);
  border-radius: 99px; overflow: hidden;
}
.metric-bar-fill {
  height: 100%; background: var(--accent);
  border-radius: 99px;
  transition: width 1s ease;
}

.section-title {
  font-size: 1rem; font-weight: 600; color: var(--text2);
  margin-bottom: 12px;
  display: flex; align-items: center; gap: 8px;
}
.sim-tag {
  font-size: 0.7rem; font-weight: 700;
  background: rgba(245,158,11,0.15); color: var(--amber);
  padding: 2px 6px; border-radius: 4px;
}

.last-update {
  font-size: 0.8rem; color: var(--text3);
  margin-top: 16px; text-align: right;
}

/* ─── CONTROL PAGE ──────────────────────────────────────── */
.and-gate-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px 20px;
  margin-bottom: 20px;
}
.and-gate-title { font-size: 0.8rem; color: var(--text3); margin-bottom: 12px; }
.and-gate-row {
  display: flex; align-items: center; gap: 12px;
  flex-wrap: wrap;
}
.gate-input, .gate-output {
  display: flex; align-items: center; gap: 6px;
  font-size: 0.85rem; color: var(--text2);
}
.gate-led {
  width: 10px; height: 10px; border-radius: 50%;
  background: var(--text3);
  display: inline-block;
}
.gate-led.on  { background: var(--green); box-shadow: 0 0 6px var(--green); }
.gate-led.off { background: var(--red); }
.gate-symbol { font-size: 0.8rem; color: var(--text3); padding: 4px 8px; background: var(--bg3); border-radius: 4px; }
.gate-arrow  { color: var(--text3); }
.gate-note   { font-size: 0.8rem; color: var(--text2); margin-top: 8px; }

.control-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 24px;
  margin-bottom: 20px;
}
.control-card h2 { font-size: 1.1rem; margin-bottom: 20px; color: var(--text); }

.bomba-display { display: flex; align-items: center; gap: 24px; margin-bottom: 20px; }
.bomba-visual { flex-shrink: 0; }
.bomba-ring  { stroke: var(--surface2); stroke-width: 2; fill: none; }
.bomba-inner { fill: var(--surface2); transition: fill 0.5s; }
.bomba-inner.on { fill: var(--accent2); }
.bomba-drop  { fill: var(--text3); transition: fill 0.5s; }
.bomba-drop.on  { fill: white; }
.bomba-status { font-size: 1.6rem; font-weight: 700; color: var(--text3); }
.bomba-status.on { color: var(--green); }
.bomba-mode  { font-size: 0.85rem; color: var(--text3); margin-top: 4px; }

.bomba-btns { display: flex; gap: 12px; flex-wrap: wrap; }
.control-warning { font-size: 0.82rem; color: var(--amber); margin-top: 10px; }

.mode-btns { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 14px; }
.mode-description { font-size: 0.85rem; color: var(--text2); line-height: 1.6; }

.device-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.di-row {
  display: flex; justify-content: space-between;
  padding: 8px 12px; background: var(--bg3);
  border-radius: 8px; font-size: 0.85rem;
}
.di-row span { color: var(--text2); }
.di-row strong { color: var(--text); }

/* ─── BUTTONS ───────────────────────────────────────────── */
.btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 9px 18px; border-radius: var(--radius);
  font-size: 0.9rem; font-weight: 500; cursor: pointer;
  border: 1px solid transparent;
  transition: all var(--transition);
  text-decoration: none;
}
.btn:disabled { opacity: 0.45; cursor: not-allowed; }
.btn-primary { background: var(--accent); color: white; }
.btn-primary:hover:not(:disabled) { background: var(--accent2); }
.btn-success { background: var(--green); color: white; }
.btn-success:hover:not(:disabled) { background: #16a34a; }
.btn-danger  { background: var(--red); color: white; }
.btn-danger:hover:not(:disabled)  { background: #dc2626; }
.btn-outline { background: transparent; color: var(--text2); border-color: var(--border); }
.btn-outline:hover:not(:disabled) { background: var(--surface); color: var(--text); }
.btn-mode {
  background: var(--accent); color: white;
  flex: 1; justify-content: center;
}
.btn-mode-outline {
  background: transparent; color: var(--text2);
  border-color: var(--border); flex: 1; justify-content: center;
}
.btn-sm { padding: 5px 12px; font-size: 0.8rem; }

/* ─── ALERTAS ───────────────────────────────────────────── */
.alertas-list { display: flex; flex-direction: column; gap: 10px; }
.alerta-item {
  background: var(--surface);
  border: 1px solid var(--border);
  border-left: 4px solid var(--text3);
  border-radius: var(--radius);
  padding: 14px 16px;
  display: flex; align-items: flex-start; justify-content: space-between; gap: 12px;
}
.alerta-item.nivel-2 { border-left-color: var(--amber); }
.alerta-item.nivel-3 { border-left-color: var(--orange); }
.alerta-item.nivel-4 { border-left-color: var(--red); background: rgba(239,68,68,0.05); }

.alerta-body h4 { font-size: 0.9rem; font-weight: 600; color: var(--text); margin-bottom: 2px; }
.alerta-body p  { font-size: 0.82rem; color: var(--text2); }
.alerta-meta { font-size: 0.75rem; color: var(--text3); margin-top: 4px; }
.alerta-btn { flex-shrink: 0; }

.empty-state {
  display: flex; flex-direction: column; align-items: center;
  gap: 12px; padding: 48px 0;
  color: var(--text3); font-size: 0.9rem;
}
.empty-state svg { opacity: 0.4; }

/* ─── CHARTS ────────────────────────────────────────────── */
.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}
.chart-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 18px;
}
.chart-card h3 { font-size: 0.9rem; color: var(--text2); margin-bottom: 12px; }

/* ─── NOTAS ─────────────────────────────────────────────── */
.nota-form-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 20px;
  margin-bottom: 20px;
}
.nota-input {
  width: 100%; padding: 12px;
  background: var(--bg3); color: var(--text);
  border: 1px solid var(--border); border-radius: var(--radius);
  font-size: 0.9rem; resize: vertical;
  font-family: inherit;
}
.nota-input:focus { outline: none; border-color: var(--accent); }
.nota-form-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 10px; gap: 10px; }
.nota-item {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius); padding: 14px 16px; margin-bottom: 8px;
}
.nota-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
.nota-tipo {
  font-size: 0.75rem; font-weight: 600;
  padding: 2px 8px; border-radius: 4px;
  background: rgba(44,156,191,0.15); color: var(--accent);
}
.nota-fecha { font-size: 0.75rem; color: var(--text3); }
.nota-texto { font-size: 0.88rem; color: var(--text); line-height: 1.5; }
.notas-list { display: flex; flex-direction: column; gap: 0; }

/* ─── CONFIG ────────────────────────────────────────────── */
.config-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius-lg); padding: 24px; margin-bottom: 20px;
}
.config-card h2 { font-size: 1rem; margin-bottom: 16px; color: var(--text2); }
.config-row { margin-bottom: 16px; }
.config-row label { font-size: 0.88rem; color: var(--text2); display: block; margin-bottom: 8px; }
.config-input-row { display: flex; align-items: center; gap: 12px; }
.config-input-row input[type="range"] { flex: 1; accent-color: var(--accent); }
.config-input-row span { min-width: 40px; font-size: 0.88rem; color: var(--text); font-weight: 600; }
.config-text-input {
  width: 100%; padding: 8px 12px;
  background: var(--bg3); color: var(--text);
  border: 1px solid var(--border); border-radius: var(--radius);
  font-size: 0.9rem; font-family: monospace;
}
.config-text-input:focus { outline: none; border-color: var(--accent); }
.config-note { font-size: 0.8rem; color: var(--text3); margin-top: 8px; line-height: 1.5; }
.config-footer { display: flex; gap: 12px; flex-wrap: wrap; }
.toggle-row { display: flex; justify-content: space-between; align-items: center; }
.toggle { position: relative; display: inline-block; width: 44px; height: 24px; }
.toggle input { opacity: 0; width: 0; height: 0; }
.toggle-slider {
  position: absolute; inset: 0; background: var(--bg3);
  border-radius: 99px; cursor: pointer; transition: background 0.2s;
}
.toggle-slider::before {
  content: ''; position: absolute;
  width: 18px; height: 18px; left: 3px; top: 3px;
  background: white; border-radius: 50%;
  transition: transform 0.2s;
}
.toggle input:checked + .toggle-slider { background: var(--accent); }
.toggle input:checked + .toggle-slider::before { transform: translateX(20px); }

/* ─── SELECTS ───────────────────────────────────────────── */
.select-sm {
  padding: 5px 10px; font-size: 0.85rem;
  background: var(--bg3); color: var(--text);
  border: 1px solid var(--border); border-radius: 8px;
  cursor: pointer;
}
.select-sm:focus { outline: none; border-color: var(--accent); }

/* ─── TOASTS ────────────────────────────────────────────── */
.toast-container {
  position: fixed; bottom: 24px; right: 24px;
  display: flex; flex-direction: column; gap: 8px;
  z-index: 9999;
}
.toast {
  background: var(--surface2); color: var(--text);
  border: 1px solid var(--border);
  border-radius: var(--radius); padding: 12px 18px;
  font-size: 0.88rem; max-width: 320px;
  box-shadow: var(--shadow);
  animation: toastIn 0.3s ease;
}
.toast.success { border-left: 3px solid var(--green); }
.toast.error   { border-left: 3px solid var(--red); }
.toast.warning { border-left: 3px solid var(--amber); }
.toast.info    { border-left: 3px solid var(--accent); }
@keyframes toastIn { from { opacity:0; transform: translateY(10px); } to { opacity:1; transform:none; } }

/* ─── MOBILE ────────────────────────────────────────────── */
.menu-toggle {
  display: none; position: fixed; top: 12px; left: 12px;
  z-index: 300; background: var(--surface); border: 1px solid var(--border);
  border-radius: 8px; padding: 8px; cursor: pointer; flex-direction: column; gap: 4px;
}
.menu-toggle span { width: 20px; height: 2px; background: var(--text2); border-radius: 1px; display: block; }
.nav-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.6);
  z-index: 190;
}

@media (max-width: 768px) {
  .nav {
    transform: translateX(-100%);
  }
  .nav.open { transform: translateX(0); }
  .main { margin-left: 0; padding: 56px 16px 16px; }
  .menu-toggle { display: flex; }
  .metrics-grid { grid-template-columns: repeat(2, 1fr); }
  .charts-grid { grid-template-columns: 1fr; }
  .device-info-grid { grid-template-columns: 1fr; }
  .and-gate-row { justify-content: center; }
  .bomba-btns { flex-direction: column; }
  .mode-btns { flex-direction: column; }
}

/* ─── BLE WIFI CONFIG ─────────────────────────────────────── */
.ble-card { border-color: rgba(99,102,241,0.3); }
.ble-card h2 { color: var(--text); }

.ble-status {
  display: flex; align-items: center; gap: 8px;
  font-size: 0.85rem; color: var(--text2);
  margin-bottom: 14px;
}
.ble-dot {
  width: 10px; height: 10px; border-radius: 50%;
  background: var(--text3); flex-shrink: 0;
  transition: background 0.3s;
}
.ble-dot.conectado  { background: var(--green); box-shadow: 0 0 6px var(--green); }
.ble-dot.conectando { background: var(--amber); }
.ble-dot.error      { background: var(--red); }

.ble-btn {
  display: flex; align-items: center; gap: 8px;
  margin-bottom: 16px;
}

.ble-form { margin-top: 16px; border-top: 1px solid var(--border); padding-top: 16px; }
.ble-form-btns { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 16px; }

.ble-eye {
  position: absolute; right: 10px; top: 50%;
  transform: translateY(-50%);
  background: none; border: none; cursor: pointer;
  color: var(--text3); padding: 4px;
}
.ble-eye:hover { color: var(--text); }

.ble-progress { margin-top: 16px; }
.ble-progress-bar {
  height: 4px; background: var(--surface2);
  border-radius: 99px; overflow: hidden; margin-bottom: 8px;
}
.ble-progress-fill {
  height: 100%; width: 0%;
  background: linear-gradient(90deg, #4f46e5, #7c3aed);
  border-radius: 99px;
  transition: width 0.4s ease;
}
#bleProgressMsg { font-size: 0.82rem; color: var(--text2); }

/* ─── v2 BADGES & MODOS ─────────────────────────────────────── */
.ble-online-badge { font-size:.8rem; color:var(--accent); background:rgba(44,156,191,.15); padding:3px 10px; border-radius:99px; }
.cache-badge { font-size:.75rem; color:var(--text3); background:var(--surface); padding:2px 8px; border-radius:99px; }
.cache-age-badge { font-size:.78rem; color:var(--amber); margin-left:10px; background:rgba(245,158,11,.1); padding:2px 8px; border-radius:6px; }
.modo-fuente-btns { display:flex; gap:10px; flex-wrap:wrap; margin-bottom:12px; }
.btn-modo-fuente { flex:1; justify-content:center; display:inline-flex; align-items:center; gap:6px; padding:9px 16px; border-radius:var(--radius); font-size:.88rem; font-weight:500; cursor:pointer; border:1px solid var(--border); background:var(--bg3); color:var(--text2); transition:all var(--transition); }
.btn-modo-fuente.active { background:var(--accent); color:white; border-color:var(--accent); }
.btn-modo-fuente:hover:not(.active) { background:var(--surface); color:var(--text); }
.sim-modulos-grid { display:flex; flex-direction:column; gap:10px; }
.sim-mod-row { display:flex; justify-content:space-between; align-items:center; padding:8px 12px; background:var(--bg3); border-radius:8px; font-size:.88rem; color:var(--text2); }

/* ─── PUNTO SECRETO CONFIG ─────────────────────────────────── */
.secret-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--surface2);
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.2s, box-shadow 0.2s;
  margin-left: auto;
}
.secret-dot:hover {
  background: var(--accent);
  box-shadow: 0 0 6px var(--accent);
}

/* ─── BOTÓN ADMIN ──────────────────────────────────────────── */
.admin-btn-wrap {
  display: flex;
  justify-content: center;
  padding: 24px 0 8px;
}
.btn-admin-access {
  width: 32px; height: 32px;
  border-radius: 50%;
  background: var(--bg3);
  border: 1px solid var(--border);
  color: var(--text3);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all var(--transition);
  display: flex; align-items: center; justify-content: center;
}
.btn-admin-access:hover {
  background: var(--surface);
  color: var(--text2);
  border-color: var(--accent2);
}

/* ─── MODAL ADMIN ──────────────────────────────────────────── */
.admin-modal {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.7);
  display: flex; align-items: center; justify-content: center;
  z-index: 9000;
}
.admin-modal-box {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 28px 24px;
  width: 280px;
  box-shadow: var(--shadow);
}
.admin-modal-title {
  font-size: 0.95rem; font-weight: 600;
  color: var(--text); margin-bottom: 16px; text-align: center;
}
.admin-pass-input {
  width: 100%; padding: 10px 14px;
  background: var(--bg3); color: var(--text);
  border: 1px solid var(--border); border-radius: var(--radius);
  font-size: 0.95rem; margin-bottom: 14px;
  font-family: inherit;
}
.admin-pass-input:focus { outline: none; border-color: var(--accent); }
.admin-modal-btns { display: flex; gap: 8px; }
.admin-modal-btns .btn { flex: 1; justify-content: center; }
.admin-modal-error {
  font-size: 0.82rem; color: var(--red);
  text-align: center; margin-top: 10px;
}

/* Shake animation para contraseña incorrecta */
@keyframes shake {
  0%,100% { transform: translateX(0); }
  25%      { transform: translateX(-6px); }
  75%      { transform: translateX(6px); }
}
.shake { animation: shake 0.4s ease; }

/* ─── SENSOR SIM DOT ────────────────────────────────────────── */
.metric-label-row {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 4px;
}
.sim-dot-sensor {
  font-size: 0.72rem; color: var(--amber);
  background: rgba(245,158,11,0.15);
  padding: 1px 5px; border-radius: 4px;
  font-weight: 600;
}

/* ─── RESUMEN DÍA ────────────────────────────────────────────── */
.resumen-dia-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 14px 16px; margin-top: 16px;
}
.resumen-dia-title {
  font-size: 0.78rem; font-weight: 600; color: var(--text3);
  text-transform: uppercase; letter-spacing: 0.05em;
  margin-bottom: 10px;
}
.resumen-dia-grid {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;
}
.resumen-item { display: flex; flex-direction: column; align-items: center; }
.resumen-val  { font-size: 1.3rem; font-weight: 700; color: var(--text); }
.resumen-lbl  { font-size: 0.72rem; color: var(--text3); margin-top: 2px; }

@media (max-width: 480px) {
  .resumen-dia-grid { grid-template-columns: repeat(2, 1fr); }
}

/* ─── TIMELINE ───────────────────────────────────────────────── */
.timeline-list { display: flex; flex-direction: column; gap: 6px; }
.timeline-item {
  display: flex; align-items: center; gap: 8px;
  padding: 7px 10px;
  background: var(--bg3); border-radius: 8px;
  font-size: 0.82rem;
}
.timeline-icon { font-size: 0.9rem; flex-shrink: 0; }
.timeline-texto { flex: 1; color: var(--text2); }
.timeline-hora  { color: var(--text3); font-size: 0.75rem; flex-shrink: 0; }

/* ─── SALUD DEL SISTEMA ─────────────────────────────────────── */
.salud-grid {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 10px; margin-top: 8px;
}
.salud-item {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius); padding: 12px 14px;
  display: flex; flex-direction: column; gap: 4px;
}
.salud-lbl { font-size: 0.75rem; color: var(--text3); text-transform: uppercase; letter-spacing: 0.05em; }
.salud-val { font-size: 1rem; font-weight: 600; color: var(--text); }
.salud-val.warn { color: var(--amber); }

/* ─── ÚLTIMO DATO HACE X MIN ─────────────────────────────────── */
.cache-age-badge {
  font-size: 0.75rem; color: var(--amber);
  background: rgba(245,158,11,0.1);
  padding: 2px 8px; border-radius: 6px; margin-left: 6px;
}
````

## File: src/js/bluetooth/ble.manager.js
````javascript
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
````

## File: src/js/config/app.config.js
````javascript
/**
 * app.config.js — Configuración central de la PWA
 * ⚠ ESTE ES EL ÚNICO ARCHIVO QUE DEBES EDITAR
 */

export const CONFIG = {

  APP_NAME:    'HidroGanadero IoT',
  APP_VERSION: '1.1.0',

  // Debe coincidir con #define DEVICE_ID en mod_config.h del ESP32
  DEVICE_ID: 'tanque_001',

  // Credenciales Firebase — ya configuradas con tu proyecto
  FIREBASE: {
    apiKey:            "AIzaSyBFC1JQWS1oRL-06Y9e3hKZ6bDWu4nkRTY",
    authDomain:        "hidrico-f8d4b.firebaseapp.com",
    databaseURL:       "https://hidrico-f8d4b-default-rtdb.firebaseio.com/",
    projectId:         "hidrico-f8d4b",
    storageBucket:     "hidrico-f8d4b.firebasestorage.app",
    messagingSenderId: "367238878834",
    appId:             "1:367238878834:web:8184de3969d2dc809b94eb"
  },

  // Rutas RTDB — deben coincidir con FB_PATH_* en mod_config.h
  RTDB_PATHS: {
    lecturas:     (id) => `/dispositivos/${id}/lecturas`,
    info:         (id) => `/dispositivos/${id}/info`,
    alertas:      (id) => `/alertas/${id}`,
    comandos:     (id) => `/comandos/${id}`,
    configuracion:(id) => `/dispositivos/${id}/configuracion`,
    historial:    (id) => `/historial/${id}`,
    notas:        (id) => `/notas/${id}`,
  },

  UMBRALES: {
    nivel:       { criticoBajo: 15, minimo: 25, maximo: 90, criticoAlto: 95 },
    temperatura: { criticaBaja: 5,  baja: 15,  alta: 35,   criticaAlta: 40 },
    turbidez:    { normal: 5,       precauc: 15,            critica: 30 },
    ph:          { minimo: 6.0,     maximo: 8.5 },
    tds:         { maximo: 500 },
    flujo:       { minimo: 2,       maximo: 25 }
  },

  WATCHDOG_INTERVAL:  15000,
  HISTORIAL_INTERVAL: 30000,
  CHART_MAX_POINTS:   60,
  SIM_INTERVAL:       3000,
};

export default CONFIG;
````

## File: src/js/device/device.manager.js
````javascript
/**
 * device.manager.js v2.0
 * Gestiona transiciones entre modos: Firebase ↔ BLE ↔ Simulación
 */

import State              from '../state.js';
import CONFIG             from '../config/app.config.js';
import { fbSetBomba, fbSetModo } from '../firebase/firebase.js';
import { simStart, simStop, simSetBomba, simSetModo, simSyncFromDevice, simIsRunning }
                          from '../simulators/sim.main.js';
import BLEManager         from '../bluetooth/ble.manager.js';

let _watchdogTimer   = null;
let _lastSeenOnline  = 0;
const OFFLINE_THRESHOLD = 30000;

export const DeviceManager = {

  init() {
    State.on('device:update', () => {
      if (!State.isSimMode() && !State.isBleMode()) {
        _lastSeenOnline = Date.now();
      }
    });

    // Watchdog: si pasan 30s sin datos Firebase → caché + sim
    _watchdogTimer = setInterval(() => this._watchdog(), CONFIG.WATCHDOG_INTERVAL);

    // Cargar caché inmediatamente si hay datos guardados
    const cargado = State.cargarDesdeCache();
    if (cargado) {
      console.log('[DeviceManager] Caché cargada:', new Date(State.lastKnownData?.ts));
    }
  },

  _watchdog() {
    const ahora    = Date.now();
    const sinDatos = ahora - _lastSeenOnline;

    if (_lastSeenOnline > 0 && sinDatos > OFFLINE_THRESHOLD) {
      if (!State.isSimMode() && !State.isBleMode()) {
        console.warn('[DeviceManager] Sin datos >30s → mostrando caché');
        // NO activar simulación automática — mostrar últimos datos reales
        State.setApp({ deviceOnline: false, dataSource: 'cache' });
        State.setDevice({ online: false, estado: 'OFFLINE' });
        // Cargar caché si aún no está cargado
        if (!State.lastKnownData) State.cargarDesdeCache();
      }
    }
  },

  // ── Modo Firebase (default) ──────────────────────────────

  activarModoFirebase() {
    simStop();
    State.setApp({ simModeActive: false, bleMode: false, bleConnected: false, dataSource: 'firebase' });
    console.log('[DeviceManager] Modo Firebase activado');
  },

  // ── Modo Simulación completa ─────────────────────────────

  activarSim() {
    simSyncFromDevice();
    simStart();
    State.setApp({ simModeActive: true, bleMode: false, dataSource: 'sim' });
  },

  desactivarSim() {
    simStop();
    State.setApp({ simModeActive: false, dataSource: 'firebase' });
    _lastSeenOnline = 0; // resetear watchdog
  },

  // ── Modo BLE ─────────────────────────────────────────────

  async activarModoBLE() {
    if (!BLEManager.isSupported()) {
      throw new Error('Web Bluetooth no disponible en este navegador');
    }

    // Pausar simulación si estaba activa
    const eraSimMode = State.isSimMode();
    if (eraSimMode) simStop();

    try {
      const result = await BLEManager.conectar(
        (data) => this._onBLEData(data),
        (status) => this._onBLEStatus(status)
      );

      State.setApp({
        bleMode:      true,
        bleConnected: true,
        simModeActive: false,
        dataSource:   'ble',
        deviceOnline: true,
      });

      console.log('[DeviceManager] BLE conectado:', result.nombre);
      return result;

    } catch(e) {
      // Restaurar sim si estaba activa
      if (eraSimMode) simStart();
      throw e;
    }
  },

  desactivarModoBLE() {
    BLEManager.desconectar();
    State.setApp({
      bleMode:      false,
      bleConnected: false,
      deviceOnline: false,
      dataSource:   'firebase',
    });
    _lastSeenOnline = 0;
    console.log('[DeviceManager] BLE desconectado, volviendo a Firebase');
  },

  _onBLEData(data) {
    // data = { n: nivel, t: temp, h: hum, b: bomba, m: modo, s: estado }
    const mods = State.app.simModules;

    State.setDevice({
      nivel:       mods.nivel       ? State.device.nivel       : (parseFloat(data.n) || 0),
      temperatura: mods.temperatura ? State.device.temperatura : (parseFloat(data.t) || 0),
      humedad:     mods.humedad     ? State.device.humedad     : (parseFloat(data.h) || 0),
      bomba:       data.b === 1 || data.b === true,
      modo:        data.m === 'A' ? 'AUTOMATICO' : 'MANUAL',
      estado:      data.s || 'NORMAL',
      online:      true,
      wifiConectado: false,
      firebaseConectado: false,
    });

    State.setApp({ deviceOnline: true, dataSource: 'ble' });

    State.addHistorial({
      nivel:       parseFloat(data.n) || 0,
      temperatura: parseFloat(data.t) || 0,
      turbidez:    State.device.turbidez,
      ph:          State.device.ph,
    });
  },

  _onBLEStatus(status) {
    if (status === 'DESCONECTADO') {
      State.setApp({ bleConnected: false, deviceOnline: false, dataSource: 'cache' });
    }
  },

  // ── Comandos ─────────────────────────────────────────────

  async setBomba(encender) {
    const deviceId = State.getDeviceId();

    if (State.isSimMode()) {
      simSetBomba(encender);
      State.setDevice({ bomba: encender });
      return { ok: true, fuente: 'sim' };
    }

    if (State.isBleMode()) {
      if (!BLEManager.isConnected()) {
        return { ok: false, error: 'BLE no conectado — acerca el teléfono al ESP32' };
      }
      try {
        await BLEManager.enviarBomba(encender);
        State.setDevice({ bomba: encender });
        return { ok: true, fuente: 'ble' };
      } catch(e) {
        // Evitar spam de errores GATT
        console.warn('[DeviceManager] BLE enviarBomba error:', e.message);
        return { ok: false, error: 'Error BLE — reconectando...' };
      }
    }

    const ok = await fbSetBomba(deviceId, encender);
    if (ok) State.setDevice({ bomba: encender });
    return { ok, fuente: 'firebase' };
  },

  async setModo(modoAuto) {
    const deviceId = State.getDeviceId();

    if (State.isSimMode()) {
      simSetModo(modoAuto);
      State.setDevice({ modo: modoAuto ? 'AUTOMATICO' : 'MANUAL' });
      return { ok: true, fuente: 'sim' };
    }

    if (State.isBleMode()) {
      if (!BLEManager.isConnected()) {
        return { ok: false, error: 'BLE no conectado' };
      }
      try {
        await BLEManager.enviarModo(modoAuto);
        State.setDevice({ modo: modoAuto ? 'AUTOMATICO' : 'MANUAL' });
        return { ok: true, fuente: 'ble' };
      } catch(e) {
        console.warn('[DeviceManager] BLE enviarModo error:', e.message);
        return { ok: false, error: 'Error BLE — reconectando...' };
      }
    }

    const ok = await fbSetModo(deviceId, modoAuto);
    if (ok) State.setDevice({ modo: modoAuto ? 'AUTOMATICO' : 'MANUAL' });
    return { ok, fuente: 'firebase' };
  },

  destroy() {
    if (_watchdogTimer) clearInterval(_watchdogTimer);
  }
};

export default DeviceManager;
````

## File: src/js/firebase/firebase.js
````javascript
/**
 * firebase.js — Comunicación Firebase Realtime Database
 * Compatible con ESP32 firmware v2.1.0
 */

import { initializeApp }         from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getDatabase, ref, onValue, set, get, push, serverTimestamp }
  from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js';
import CONFIG from '../config/app.config.js';
import State  from '../state.js';

let _app = null;
let _db  = null;
let _listeners = {};

export function firebaseInit() {
  try {
    _app = initializeApp(CONFIG.FIREBASE);
    _db  = getDatabase(_app);
    console.log('[Firebase] SDK inicializado');
    return true;
  } catch (e) {
    console.error('[Firebase] Error al inicializar:', e);
    return false;
  }
}

export function getDB() { return _db; }

// ══════════════════════════════════════════════════════
// LISTENERS
// ══════════════════════════════════════════════════════

/**
 * Escucha /dispositivos/{id}/lecturas
 * Si la ruta está vacía (ESP32 aún no conectado) → activa simulación
 * Si llegan datos reales → muestra datos reales y detiene simulación
 */
export function listenLecturas(deviceId) {
  if (!_db) return;
  const ruta = CONFIG.RTDB_PATHS.lecturas(deviceId);

  if (_listeners.lecturas) _listeners.lecturas();

  const r = ref(_db, ruta);
  _listeners.lecturas = onValue(r, (snap) => {

    // ── Sin datos: ESP32 no ha publicado aún ─────────────
    if (!snap.exists()) {
      console.warn('[Firebase] Ruta vacía — sin datos del ESP32 aún');
      State.setApp({ deviceOnline: false, firebaseReady: true });
      // No iniciar simulación — mostrar caché si existe
      return;
    }

    // ── Con datos: ESP32 conectado ────────────────────────
    // Si venía en simulación, detenerla
    import('../simulators/sim.main.js')
      .then(m => { if (m.simIsRunning()) m.simStop(); })
      .catch(() => {});

    const d = snap.val();

    State.setDevice({
      deviceId:        d.deviceId        || deviceId,
      nombre:          d.nombre          || '--',
      zona:            d.zona            || '--',
      firmwareVersion: d.firmwareVersion || '--',
      ip:              d.ip              || '--',
      uptime:          d.uptime          || 0,
      rssi:            d.rssi            || 0,
      nivel:           parseFloat(d.nivel       ?? 0),
      temperatura:     parseFloat(d.temperatura ?? 0),
      humedad:         parseFloat(d.humedad     ?? 0),
      turbidez:        parseFloat(d.turbidez    ?? 0),
      turbidezSim:     d.turbidezSim ?? true,
      flujo:           parseFloat(d.flujo       ?? 0),
      flujoSim:        d.flujoSim    ?? true,
      ph:              parseFloat(d.ph          ?? 7.0),
      phSim:           d.phSim       ?? true,
      tds:             parseFloat(d.tds         ?? 0),
      tdsSim:          d.tdsSim      ?? true,
      bomba:           d.bomba         ?? false,
      modo:            d.modo          ?? 'AUTOMATICO',
      estado:          d.estado        ?? 'OFFLINE',
      mantenimiento:   d.mantenimiento ?? false,
      alertasCount:    d.alertasCount  ?? 0,
      wifiConectado:     d.wifiConectado     ?? false,
      firebaseConectado: true,
      online:            true,
      // Estadísticas de bomba
      bomba_ciclos_hoy:    d.bomba_ciclos_hoy    ?? undefined,
      bomba_minutos_hoy:   d.bomba_minutos_hoy   ?? undefined,
      bomba_duracion_ult:  d.bomba_duracion_ult  ?? undefined,
      litros_actuales:     parseFloat(d.litros_actuales    ?? 0),
      consumo_litros_hoy:  parseFloat(d.consumo_litros_hoy ?? 0),
      consumo_litros_prom: parseFloat(d.consumo_litros_prom?? 0),
      fuga_detectada:      d.fuga_detectada ?? false,
      llenado_tiempo_prom: d.llenado_tiempo_prom ?? 0,
    });

    State.setApp({
      deviceOnline:     true,
      firebaseReady:    true,
      simModeActive:    false,
      dataSource:       'firebase',
      bleMode:          false,     // salir de modo BLE si llegaron datos Firebase
    });

    State.addHistorial({
      nivel:       parseFloat(d.nivel       ?? 0),
      temperatura: parseFloat(d.temperatura ?? 0),
      turbidez:    parseFloat(d.turbidez    ?? 0),
      ph:          parseFloat(d.ph          ?? 7.0),
    });

  }, (err) => {
    console.error('[Firebase] Error leyendo lecturas:', err);
    State.setApp({ deviceOnline: false });
    State.setDevice({ online: false, estado: 'OFFLINE' });
  });
}

export function listenAlertas(deviceId) {
  if (!_db) return;
  const ruta = CONFIG.RTDB_PATHS.alertas(deviceId);
  if (_listeners.alertas) _listeners.alertas();

  const r = ref(_db, ruta);
  _listeners.alertas = onValue(r, (snap) => {
    if (!snap.exists()) { State.setAlertas([]); return; }
    const raw = snap.val();
    let arr = Array.isArray(raw) ? raw : Object.values(raw);
    arr = arr.filter(Boolean).map((a, i) => ({
      id:      a.timestamp || i,
      tipo:    a.tipo      || 'DESCONOCIDO',
      mensaje: a.mensaje   || '',
      nivel:   a.nivel     || 1,
      activa:  a.activa    ?? true,
      resuelta: false,
      fuente:  'esp32',
      ts:      a.timestamp || Date.now(),
    }));
    State.setAlertas(arr);
  });
}

export function listenNotas(deviceId) {
  if (!_db) return;
  const ruta = CONFIG.RTDB_PATHS.notas(deviceId);
  if (_listeners.notas) _listeners.notas();

  const r = ref(_db, ruta);
  _listeners.notas = onValue(r, (snap) => {
    if (!snap.exists()) { State.setNotas([]); return; }
    const raw = snap.val();
    const arr = Object.entries(raw).map(([k, v]) => ({ id: k, ...v }));
    arr.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    State.setNotas(arr);
  });
}

export async function fbSetBomba(deviceId, encender) {
  if (!_db) return false;
  try {
    const ruta = CONFIG.RTDB_PATHS.comandos(deviceId);
    await set(ref(_db, ruta), {
      bomba:     encender,
      modo_auto: State.device.modo === 'AUTOMATICO',
      timestamp: Date.now(),
    });
    return true;
  } catch (e) {
    console.error('[Firebase] Error comando bomba:', e);
    return false;
  }
}

export async function fbSetModo(deviceId, modoAuto) {
  if (!_db) return false;
  try {
    const ruta = CONFIG.RTDB_PATHS.comandos(deviceId);
    await set(ref(_db, ruta), {
      bomba:     State.device.bomba,
      modo_auto: modoAuto,
      timestamp: Date.now(),
    });
    return true;
  } catch (e) {
    console.error('[Firebase] Error comando modo:', e);
    return false;
  }
}

export async function fbGuardarNota(deviceId, texto, tipo) {
  if (!_db) return false;
  try {
    const ruta = CONFIG.RTDB_PATHS.notas(deviceId);
    await push(ref(_db, ruta), { texto, tipo, timestamp: Date.now() });
    return true;
  } catch (e) {
    console.error('[Firebase] Error guardando nota:', e);
    return false;
  }
}

export async function fbCheckDeviceExists(deviceId) {
  if (!_db) return false;
  try {
    const snap = await get(ref(_db, CONFIG.RTDB_PATHS.lecturas(deviceId)));
    return snap.exists();
  } catch (e) {
    return false;
  }
}

export async function fbGetConfiguracion(deviceId) {
  if (!_db) return null;
  try {
    const snap = await get(ref(_db, CONFIG.RTDB_PATHS.configuracion(deviceId)));
    return snap.exists() ? snap.val() : null;
  } catch (e) {
    return null;
  }
}

// ── Escuchar config en tiempo real (sin recarga) ──────────────
export function listenConfiguracion(deviceId, onChange) {
  if (!_db) return;
  const r = ref(_db, CONFIG.RTDB_PATHS.configuracion(deviceId));
  if (_listeners.config) _listeners.config();
  _listeners.config = onValue(r, snap => {
    if (snap.exists()) onChange(snap.val());
  });
}

// ── Reconexión automática con backoff ─────────────────────────
let _reconectTimer   = null;
let _reconectDelay   = 5000;
let _reconectCb      = null;

export function firebase_onDesconexion(cb) {
  _reconectCb = cb;
}

export function firebase_scheduleReconnect() {
  if (_reconectTimer) clearTimeout(_reconectTimer);
  _reconectTimer = setTimeout(() => {
    console.log('[Firebase] Reintentando reconexión...');
    if (_reconectCb) _reconectCb();
    _reconectDelay = Math.min(_reconectDelay * 2, 60000);
  }, _reconectDelay);
}

export function firebase_resetReconnect() {
  _reconectDelay = 5000;
  if (_reconectTimer) { clearTimeout(_reconectTimer); _reconectTimer = null; }
}

export async function fbSetConfiguracion(deviceId, data) {
  if (!_db) return false;
  try {
    const r = ref(_db, CONFIG.RTDB_PATHS.configuracion(deviceId));
    await set(r, { ...data });
    return true;
  } catch(e) { return false; }
}

export function cancelarListeners() {
  Object.values(_listeners).forEach(unsub => {
    if (typeof unsub === 'function') unsub();
  });
  _listeners = {};
}
````

## File: src/js/modules/estados.module.js
````javascript
/**
 * estados.module.js — Motor de evaluación de estados y alertas
 * Se ejecuta cada vez que llegan datos nuevos del dispositivo.
 */

import State  from '../state.js';
import CONFIG from '../config/app.config.js';

export const EstadosModule = {

  init() {
    State.on('device:update', (device) => this._evaluar(device));
  },

  _evaluar(d) {
    const u = State.umbrales;

    // Nivel
    if (d.nivel <= u.nivel.criticoBajo) {
      State.addAlerta({ tipo: 'NIVEL_BAJO', mensaje: `Nivel crítico: ${d.nivel}%`, nivel: 4, fuente: 'pwa' });
    } else if (d.nivel < u.nivel.minimo) {
      State.addAlerta({ tipo: 'NIVEL_BAJO', mensaje: `Nivel bajo: ${d.nivel}%`, nivel: 2, fuente: 'pwa' });
    }

    if (d.nivel >= u.nivel.criticoAlto) {
      State.addAlerta({ tipo: 'NIVEL_ALTO', mensaje: `Riesgo desbordamiento: ${d.nivel}%`, nivel: 3, fuente: 'pwa' });
    }

    // Temperatura
    if (d.temperatura >= u.temperatura.criticaAlta) {
      State.addAlerta({ tipo: 'TEMP_ALTA', mensaje: `Temperatura crítica: ${d.temperatura}°C`, nivel: 4, fuente: 'pwa' });
    } else if (d.temperatura >= u.temperatura.alta) {
      State.addAlerta({ tipo: 'TEMP_ALTA', mensaje: `Temperatura elevada: ${d.temperatura}°C`, nivel: 2, fuente: 'pwa' });
    }
    if (d.temperatura <= u.temperatura.criticaBaja) {
      State.addAlerta({ tipo: 'TEMP_BAJA', mensaje: `Riesgo congelamiento: ${d.temperatura}°C`, nivel: 3, fuente: 'pwa' });
    }

    // Turbidez
    if (d.turbidez >= u.turbidez.critica) {
      State.addAlerta({ tipo: 'TURBIDEZ', mensaje: `Agua turbia: ${d.turbidez} NTU`, nivel: 4, fuente: 'pwa' });
    } else if (d.turbidez >= u.turbidez.precauc) {
      State.addAlerta({ tipo: 'TURBIDEZ', mensaje: `Turbidez moderada: ${d.turbidez} NTU`, nivel: 2, fuente: 'pwa' });
    }

    // pH
    if (d.ph < (u.ph.minimo - 0.5) || d.ph > (u.ph.maximo + 0.5)) {
      State.addAlerta({ tipo: 'PH_RANGO', mensaje: `pH fuera de rango: ${d.ph}`, nivel: 3, fuente: 'pwa' });
    }

    // TDS
    if (d.tds > u.tds.maximo) {
      State.addAlerta({ tipo: 'TDS_ALTO', mensaje: `TDS elevado: ${d.tds} ppm`, nivel: 2, fuente: 'pwa' });
    }
  },
};
````

## File: src/js/modules/ui.modules.js
````javascript
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


export { UIConfig } from './ui.config.js';


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
````

## File: src/js/simulators/sim.main.js
````javascript
/**
 * sim.main.js v2.0 — Simuladores locales con soporte por módulo
 * Modo completo: simula todo
 * Modo por módulo: solo simula los sensores marcados en State.app.simModules
 */

import State  from '../state.js';
import CONFIG from '../config/app.config.js';

let _timer = null;
let _t     = 0;

const SIM = {
  nivel:       65.0,
  temperatura: 27.0,
  humedad:     62.0,
  turbidez:    4.5,
  flujo:       0.0,
  ph:          7.2,
  tds:         310.0,
  bomba:       false,
  modo:        'AUTOMATICO',
  estado:      'NORMAL',
};

function ruido(amp) { return (Math.random() - 0.5) * 2 * amp; }

function tick() {
  _t += CONFIG.SIM_INTERVAL / 1000;

  // Física del tanque
  if (SIM.modo === 'AUTOMATICO') {
    if (SIM.nivel < CONFIG.UMBRALES.nivel.minimo)  SIM.bomba = true;
    if (SIM.nivel > CONFIG.UMBRALES.nivel.maximo)  SIM.bomba = false;
  }

  // Actualizar valores simulados
  if (SIM.bomba) {
    SIM.nivel += 0.4 + ruido(0.1);
    SIM.flujo  = 8.5 + ruido(0.8);
  } else {
    SIM.nivel -= 0.2 + ruido(0.05);
    SIM.flujo  = Math.max(0, ruido(0.3));
  }
  SIM.nivel       = Math.max(2, Math.min(98, SIM.nivel));
  SIM.temperatura = 27 + 5 * Math.sin(_t / 120) + ruido(0.4);
  SIM.humedad     = Math.max(20, Math.min(95, 60 - 8 * Math.sin(_t / 120) + ruido(1.0)));
  SIM.turbidez    = Math.max(0.5, Math.min(28, SIM.turbidez + ruido(0.3) + (Math.random() < 0.02 ? 3 : 0)));
  SIM.ph          = Math.max(5.5, Math.min(9.0, SIM.ph + ruido(0.03)));
  SIM.tds         = Math.max(100, Math.min(600, 310 + SIM.temperatura * 2 + ruido(8)));
  SIM.estado      = _calcEstado();

  // ── Construir datos mezclando real + simulado por módulo ──
  const mods = State.app.simModules;
  const d    = State.device; // datos reales actuales

  const update = {
    deviceId:        State.getDeviceId(),
    nombre:          State.app.simModeActive ? 'Tanque Principal (SIM)' : (d.nombre || '--'),
    zona:            d.zona || 'Zona A',
    firmwareVersion: State.app.simModeActive ? 'SIM' : (d.firmwareVersion || '--'),
    ip:              State.app.simModeActive ? '-- simulado --' : (d.ip || '--'),
    uptime:          State.app.simModeActive ? Math.floor(_t) : (d.uptime || 0),
    rssi:            State.app.simModeActive ? -65 : (d.rssi || 0),

    // Sensores: usar simulado si modo completo O módulo individual activado
    nivel:       State.isSensorSim('nivel')       ? +SIM.nivel.toFixed(1)       : d.nivel,
    temperatura: State.isSensorSim('temperatura') ? +SIM.temperatura.toFixed(1) : d.temperatura,
    humedad:     State.isSensorSim('humedad')     ? +SIM.humedad.toFixed(1)     : d.humedad,

    turbidez:    State.isSensorSim('turbidez')    ? +SIM.turbidez.toFixed(1)    : d.turbidez,
    turbidezSim: State.isSensorSim('turbidez'),
    flujo:       State.isSensorSim('flujo')       ? +SIM.flujo.toFixed(1)       : d.flujo,
    flujoSim:    State.isSensorSim('flujo'),
    ph:          State.isSensorSim('ph')          ? +SIM.ph.toFixed(2)          : d.ph,
    phSim:       State.isSensorSim('ph'),
    tds:         State.isSensorSim('tds')         ? +SIM.tds.toFixed(0)         : d.tds,
    tdsSim:      State.isSensorSim('tds'),

    bomba:             SIM.bomba,
    modo:              SIM.modo,
    estado:            SIM.estado,
    mantenimiento:     false,
    wifiConectado:     false,
    firebaseConectado: false,
    online:            false,
    andGateA:          false,
    andGateB:          false,
    andGateY:          false,
  };

  State.setDevice(update);
  State.addHistorial({
    nivel:       update.nivel,
    temperatura: update.temperatura,
    turbidez:    update.turbidez,
    ph:          update.ph,
  });
}

function _calcEstado() {
  const u = CONFIG.UMBRALES;
  if (SIM.nivel <= u.nivel.criticoBajo || SIM.nivel >= u.nivel.criticoAlto ||
      SIM.temperatura >= u.temperatura.criticaAlta) return 'CRITICO';
  if (SIM.nivel < u.nivel.minimo || SIM.nivel > u.nivel.maximo ||
      SIM.temperatura >= u.temperatura.alta ||
      SIM.turbidez >= u.turbidez.critica ||
      SIM.ph < u.ph.minimo || SIM.ph > u.ph.maximo) return 'ALERTA';
  if (SIM.turbidez >= u.turbidez.precauc ||
      SIM.temperatura >= u.temperatura.baja) return 'PRECAUCION';
  return 'NORMAL';
}

export function simStart() {
  if (_timer) return;
  _t = 0;
  tick();
  _timer = setInterval(tick, CONFIG.SIM_INTERVAL);
  console.log('[SIM] Iniciados');
}

export function simStop() {
  if (_timer) { clearInterval(_timer); _timer = null; }
  console.log('[SIM] Detenidos');
}

export function simIsRunning() { return _timer !== null; }
export function simSetBomba(v) { SIM.bomba = v; }
export function simSetModo(auto) { SIM.modo = auto ? 'AUTOMATICO' : 'MANUAL'; }

/** Actualiza SIM con los valores reales actuales (para continuar desde donde estaba) */
export function simSyncFromDevice() {
  const d = State.device;
  if (d.nivel       > 0) SIM.nivel       = d.nivel;
  if (d.temperatura > 0) SIM.temperatura = d.temperatura;
  if (d.humedad     > 0) SIM.humedad     = d.humedad;
  if (d.turbidez    > 0) SIM.turbidez    = d.turbidez;
  if (d.ph          > 0) SIM.ph          = d.ph;
  if (d.tds         > 0) SIM.tds         = d.tds;
  SIM.bomba = d.bomba;
  SIM.modo  = d.modo || 'AUTOMATICO';
}
````

## File: src/js/ui/ui.ble.js
````javascript
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
````

## File: src/js/ui/ui.config.js
````javascript
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
````

## File: src/js/ui/ui.control.js
````javascript
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
    const wifiOk = d.wifiConectado || app.deviceOnline;
    const fbOk   = d.firebaseConectado || (app.firebaseReady && app.dataSource === 'firebase');
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
````

## File: src/js/ui/ui.dashboard.js
````javascript
/**
 * ui.dashboard.js v3.0
 * - SIM tag por sensor individual (no global)
 * - Tarjeta resumen del día
 * - Métricas secundarias rediseñadas con barra de estado
 * - Offline/BLE/caché totalmente funcional
 */
import State from '../state.js';
import CONFIG from '../config/app.config.js';

function fmt(val, dec = 1) {
  const n = parseFloat(val);
  return isNaN(n) ? '--' : n.toFixed(dec);
}
function $id(id) { return document.getElementById(id); }
function setColorClass(el, estado) {
  el.classList.remove('precauc', 'alerta', 'critico');
  if (estado === 'PRECAUCION') el.classList.add('precauc');
  else if (estado === 'ALERTA')   el.classList.add('alerta');
  else if (estado === 'CRITICO')  el.classList.add('critico');
}

// ── Calcula color de barra según valor vs umbral ──────────────
function _barColor(val, warn, crit, inverted = false) {
  if (inverted) {
    if (val >= crit) return 'var(--red)';
    if (val >= warn) return 'var(--amber)';
    return 'var(--green)';
  }
  if (val <= crit) return 'var(--red)';
  if (val <= warn) return 'var(--amber)';
  return 'var(--green)';
}

// ── Timer "hace X minutos" ────────────────────────────────────
let _ageTimer = null;

export const UIDashboard = {

  init() {
    State.on('device:update', (d) => this.render(d));
    State.on('estado:change', (e) => this._renderEstado(e));
    State.on('app:update',    (a) => this._renderOnline(a));
    _ageTimer = setInterval(() => this._renderAge(), 30000);
  },

  render(d) {
    const nivel = parseFloat(d.nivel ?? 0);
    const set   = (id, val) => { const el = $id(id); if (el) el.textContent = val; };

    // ── Métricas principales ──────────────────────────────────
    set('mNivel',    fmt(nivel, 0));
    set('mTemp',     fmt(d.temperatura));
    set('mHum',      fmt(d.humedad, 0));

    // Litros si disponible
    const litros = parseFloat(d.litros_actuales ?? 0);
    const litrosEl = $id('mLitros');
    if (litrosEl) litrosEl.textContent = litros > 0 ? fmt(litros, 0) : '--';

    const bombaOn = d.bomba === true;
    set('mBomba', bombaOn ? 'ON' : 'OFF');
    const bWrap = $id('bombaIconWrap');
    if (bWrap) { bWrap.classList.toggle('green', bombaOn); bWrap.classList.toggle('red', !bombaOn); }

    const bar = $id('mNivelBar');
    if (bar) {
      bar.style.width = `${Math.min(100, nivel)}%`;
      const u = State.umbrales;
      bar.style.background = _barColor(nivel, u.nivel.minimo, u.nivel.criticoBajo);
    }

    const fill = $id('tanqueMiniRell');
    if (fill) fill.style.height = `${Math.min(100, nivel)}%`;
    const lbl = $id('tanqueMiniLabel');
    if (lbl) lbl.textContent = `${fmt(nivel, 0)}%`;

    // ── Métricas secundarias con indicador SIM individual ─────
    this._renderMetricaCalidad('mTurbidez', 'mTurbidezBar', 'simDot_turbidez',
      d.turbidez, d.turbidezSim, '%', 15, 30, true);
    this._renderMetricaCalidad('mFlujo', 'mFlujoBar', 'simDot_flujo',
      d.flujo, d.flujoSim, 'L/m', 2, 0.5, false, true);
    this._renderMetricaCalidad('mPH', 'mPHBar', 'simDot_ph',
      d.ph, d.phSim, '', 6.0, 8.5, false, false, true);
    this._renderMetricaCalidad('mTDS', 'mTDSBar', 'simDot_tds',
      d.tds, d.tdsSim, 'ppm', 350, 500, true);

    // ── Tarjeta resumen del día ───────────────────────────────
    this._renderResumenDia(d);

    this._renderEstado(d.estado);
    this._renderAge();
  },

  _renderMetricaCalidad(valId, barId, simId, valor, esSim, unidad, warn, crit, mayorEsPeor = true, esFlujo = false, esPH = false) {
    const el  = $id(valId);
    const bar = $id(barId);
    const dot = $id(simId);

    const v = parseFloat(valor ?? 0);

    if (el) el.textContent = isNaN(v) ? '--' : v.toFixed(esPH ? 2 : 1);

    // Mostrar indicador SIM solo para ESTE sensor si está simulado
    if (dot) {
      const mostrarSim = esSim === true || State.isSensorSim(simId.replace('simDot_',''));
      dot.classList.toggle('hidden', !mostrarSim);
    }

    if (!bar) return;

    // Barra proporcional según rango del sensor
    let pct = 0;
    let color = 'var(--green)';

    if (esPH) {
      // pH: rango 0-14, ideal 6-8.5
      pct = Math.min(100, (v / 14) * 100);
      color = (v < 5.5 || v > 9) ? 'var(--red)' : (v < 6 || v > 8.5) ? 'var(--amber)' : 'var(--green)';
    } else if (esFlujo) {
      // Flujo: malo si muy bajo (esperado > 2 L/min con bomba ON)
      pct = Math.min(100, (v / 30) * 100);
      color = v < 0.5 ? 'var(--text3)' : v < warn ? 'var(--amber)' : 'var(--green)';
    } else if (mayorEsPeor) {
      // Turbidez, TDS: mayor = peor
      const max = crit * 2;
      pct = Math.min(100, (v / max) * 100);
      color = v >= crit ? 'var(--red)' : v >= warn ? 'var(--amber)' : 'var(--green)';
    }

    bar.style.width  = `${pct}%`;
    bar.style.background = color;
  },

  _renderResumenDia(d) {
    const card = $id('resumenDiaCard');
    if (!card) return;

    const ciclos  = d.bomba_ciclos_hoy   ?? '--';
    const minutos = d.bomba_minutos_hoy  ?? '--';
    const litros  = d.consumo_litros_hoy > 0 ? fmt(d.consumo_litros_hoy, 0) + ' L' : '--';
    const fuga    = d.fuga_detectada === true;

    const setR = (id, val) => { const e = $id(id); if (e) e.textContent = val; };
    setR('rCiclos',  ciclos);
    setR('rMinutos', minutos + (minutos !== '--' ? ' min' : ''));
    setR('rLitros',  litros);

    const fugaEl = $id('rFuga');
    if (fugaEl) {
      fugaEl.textContent = fuga ? '⚠ Posible fuga' : 'Sin anomalías';
      fugaEl.style.color = fuga ? 'var(--red)' : 'var(--green)';
    }

    // Mostrar la card solo si hay datos
    const tieneDatos = d.bomba_ciclos_hoy !== undefined;
    card.classList.toggle('hidden', !tieneDatos && !State.isSimMode());
  },

  _renderAge() {
    const age   = State.getLastDataAge();
    const el    = $id('lastUpdateTime');
    const badge = $id('cacheAgeBadge');
    if (!el) return;

    if (age === null) {
      el.textContent = '--';
      if (badge) badge.classList.add('hidden');
      return;
    }

    el.textContent = new Date().toLocaleTimeString('es-MX');

    if (badge) {
      if (!State.app.deviceOnline && age > 60) {
        const min = Math.floor(age / 60);
        badge.textContent = `Datos de hace ${min} min`;
        badge.classList.remove('hidden');
      } else {
        badge.classList.add('hidden');
      }
    }
  },

  _renderEstado(estado) {
    const MAP = {
      'NORMAL':        { label: 'NORMAL',     sub: 'Sistema operando correctamente', dotClass: 'normal',  cardClass: '' },
      'PRECAUCION':    { label: 'PRECAUCIÓN', sub: 'Revisar parámetros',             dotClass: 'precauc', cardClass: 'estado-precauc' },
      'ALERTA':        { label: 'ALERTA',     sub: 'Atención requerida',             dotClass: 'alerta',  cardClass: 'estado-alerta' },
      'CRITICO':       { label: 'CRÍTICO',    sub: 'Acción inmediata',               dotClass: 'alerta',  cardClass: 'estado-critico' },
      'MANTENIMIENTO': { label: 'MANT.',      sub: 'Modo mantenimiento',             dotClass: 'offline', cardClass: 'estado-precauc' },
      'OFFLINE':       { label: 'OFFLINE',    sub: 'Sin conexión',                   dotClass: 'offline', cardClass: '' },
    };
    const info = MAP[estado] || MAP['OFFLINE'];
    const label  = $id('estadoLabel');
    const sub    = $id('estadoSub');
    const card   = $id('estadoCard');
    const dot    = $id('navDot');
    const navEst = $id('navEstado');
    if (label)  { label.textContent = info.label; setColorClass(label, estado); }
    if (sub)    sub.textContent   = info.sub;
    if (card)   { card.classList.remove('estado-precauc','estado-alerta','estado-critico'); if (info.cardClass) card.classList.add(info.cardClass); }
    if (dot)    dot.className     = 'status-dot ' + info.dotClass;
    if (navEst) navEst.textContent = info.label;
    const mapSem = { 'NORMAL':'verde', 'PRECAUCION':'ambar', 'ALERTA':'rojo', 'CRITICO':'rojo', 'OFFLINE':'' };
    ['verde','ambar','rojo'].forEach(c => {
      const el = $id(`sem${c.charAt(0).toUpperCase()+c.slice(1)}`);
      if (el) el.classList.toggle('activo', mapSem[estado] === c);
    });
  },

  _renderOnline(app) {
    const badge      = $id('onlineBadge');
    const simBadge   = $id('simBadge');
    const bleBadge   = $id('bleBadge');
    const cacheBadge = $id('cacheBadge');
    const banner     = $id('offlineBanner');
    if (!badge) return;
    const sourceMap = {
      firebase: { text: '● En línea',     cls: 'online-badge' },
      ble:      { text: '⟡ BLE',          cls: 'online-badge ble-online-badge' },
      sim:      { text: '◈ Simulación',   cls: 'online-badge sim-online-badge' },
      cache:    { text: '⊙ Sin conexión', cls: 'online-badge offline-badge' },
      none:     { text: '○ Sin datos',    cls: 'online-badge offline-badge' },
    };
    const src  = app.dataSource || 'none';
    const info = sourceMap[src] || sourceMap.none;
    badge.textContent = info.text;
    badge.className   = info.cls;
    if (simBadge)   simBadge.classList.toggle('hidden',  src !== 'sim');
    if (bleBadge)   bleBadge.classList.toggle('hidden',  src !== 'ble');
    if (cacheBadge) cacheBadge.classList.toggle('hidden', src !== 'cache');
    if (banner)     banner.classList.toggle('hidden',    app.deviceOnline);
  },
};
````

## File: src/js/ui/ui.modules.js
````javascript
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
````

## File: src/js/utils/toast.js
````javascript
/**
 * toast.js — Notificaciones Toast
 */
export const Toast = {
  _show(msg, type, duration = 3500) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.textContent = msg;
    container.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity 0.3s'; setTimeout(() => el.remove(), 350); }, duration);
  },
  success(msg) { this._show(msg, 'success'); },
  error(msg)   { this._show(msg, 'error', 5000); },
  warning(msg) { this._show(msg, 'warning'); },
  info(msg)    { this._show(msg, 'info'); },
};
````

## File: src/js/app.js
````javascript
/**
 * app.js v2.0 — Punto de entrada
 * Carga caché inmediatamente, luego Firebase/BLE según disponibilidad
 */

import CONFIG        from './config/app.config.js';
import State         from './state.js';
import { Router }    from './router.js';
import { firebaseInit, listenLecturas, listenAlertas, listenNotas,
         listenConfiguracion, firebase_onDesconexion,
         firebase_scheduleReconnect, firebase_resetReconnect }
                     from './firebase/firebase.js';
import DeviceManager from './device/device.manager.js';
import { simStart }  from './simulators/sim.main.js';
import { EstadosModule } from './modules/estados.module.js';
import { UIDashboard }   from './ui/ui.dashboard.js';
import { UIControl }     from './ui/ui.control.js';
import { UIAlertas, UICharts, UINotas, UINav, UITimeline, UIAlertasHistorial, UISalud } from './ui/ui.modules.js';
import { UIConfig }  from './ui/ui.config.js';
import UIBLE         from './ui/ui.ble.js';

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function animarSplash() {
  const fill = document.getElementById('splashFill');
  const sub  = document.querySelector('.splash-sub');
  const pasos = [
    [25, 'Inicializando...'],
    [55, 'Conectando Firebase...'],
    [85, 'Cargando interfaz...'],
    [100,'Listo'],
  ];
  for (const [pct, msg] of pasos) {
    if (fill) fill.style.width = `${pct}%`;
    if (sub)  sub.textContent  = msg;
    await sleep(350);
  }
}

function mostrarApp() {
  const splash = document.getElementById('splash');
  const appEl  = document.getElementById('app');
  if (splash) splash.classList.add('fade-out');
  setTimeout(() => {
    if (splash) splash.classList.add('hidden');
    if (appEl)  appEl.classList.remove('hidden');
  }, 500);
}

// ── Notificaciones push ───────────────────────────────────────

function _initNotificaciones() {
  const btn = document.getElementById('btnActivarNotif');
  const status = document.getElementById('notifStatus');
  if (!('Notification' in window)) {
    if (btn) btn.disabled = true;
    if (status) status.textContent = 'Estado: no soportado en este navegador';
    return;
  }
  const p = Notification.permission;
  if (status) {
    if (p === 'granted') status.textContent = 'Estado: ✅ activadas';
    else if (p === 'denied') status.textContent = 'Estado: ❌ bloqueadas (activar en config del navegador)';
    else status.textContent = 'Estado: pendiente de activar';
  }
  if (btn) btn.textContent = p === 'granted' ? 'Activadas ✓' : 'Activar notificaciones';
}

function activarNotificaciones() {
  if (!('Notification' in window)) return;
  Notification.requestPermission().then(p => {
    _initNotificaciones();
    if (p === 'granted') {
      import('./utils/toast.js').then(m => m.Toast.success('Notificaciones activadas'));
    }
  });
}
window.activarNotificaciones = activarNotificaciones;

function _enviarNotificacion(alerta) {
  if (Notification.permission !== 'granted') return;
  if (document.visibilityState === 'visible') return; // app abierta, no molestar
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type:   'NOTIFY_ALERTA',
      titulo: 'HidroGanadero — ' + alerta.tipo.replace(/_/g, ' '),
      cuerpo: alerta.mensaje || '',
      nivel:  alerta.nivel,
    });
  } else {
    new Notification('HidroGanadero — ' + alerta.tipo.replace(/_/g,' '), {
      body: alerta.mensaje || '',
      icon: '/public/icons/icon-192.png',
    });
  }
}

async function init() {
  const splashPromise = animarSplash();

  // Config local
  const cfgLocal = JSON.parse(localStorage.getItem('hidro_config') || '{}');
  const deviceId = cfgLocal.deviceId || CONFIG.DEVICE_ID;
  State.setApp({ deviceId });
  if (cfgLocal.umbrales) State.setUmbrales(cfgLocal.umbrales);

  // Módulos UI
  UIDashboard.init();
  UIControl.init();
  UIAlertas.init();
  UICharts.init();
  UINotas.init();
  UIConfig.init();
  UINav.init();
  UITimeline.init();
  UIAlertasHistorial.init();
  UISalud.init();
  UIBLE.init();
  EstadosModule.init();

  // DeviceManager init — carga caché inmediatamente si existe
  DeviceManager.init();

  // Notificaciones push — pedir permiso si ya fue otorgado antes
  _initNotificaciones();

  Router.init();

  // Menú hamburguesa
  document.getElementById('menuToggle')?.addEventListener('click', () => {
    document.getElementById('nav')?.classList.toggle('open');
    document.getElementById('navOverlay')?.classList.toggle('hidden');
  });
  document.getElementById('navOverlay')?.addEventListener('click', () => {
    document.getElementById('nav')?.classList.remove('open');
    document.getElementById('navOverlay')?.classList.add('hidden');
  });

  // Escuchar alertas críticas para notificación push
  State.on('alertas:update', (alertas) => {
    const criticas = alertas.filter(a => !a.resuelta && a.nivel >= 3 && a.ts && (Date.now() - a.ts) < 8000);
    criticas.forEach(a => _enviarNotificacion(a));
  });

  // Firebase
  let fbOk = false;
  try { fbOk = firebaseInit(); } catch(e) {
    console.warn('[App] Firebase no disponible:', e.message);
  }

  if (fbOk) {
    listenLecturas(deviceId);
    listenAlertas(deviceId);
    listenNotas(deviceId);

    // Config en tiempo real — UI se actualiza sin recargar
    listenConfiguracion(deviceId, (cfg) => {
      State.setConfig(cfg);
      import('./ui/ui.config.js').then(m => m.UIConfig?.renderRemote?.(cfg)).catch(()=>{});
    });

    // Reconexión automática con backoff 5s→10s→20s→...60s
    firebase_onDesconexion(() => {
      firebase_resetReconnect();
      listenLecturas(deviceId);
      listenAlertas(deviceId);
      listenConfiguracion(deviceId, (cfg) => State.setConfig(cfg));
    });
    firebase_resetReconnect();
  } else {
    console.warn('[App] Sin Firebase → modo offline');
    // Intentar cargar últimos datos conocidos del caché
    const cacheOk = State.cargarDesdeCache();
    if (cacheOk) {
      console.log('[App] Datos cargados desde caché local');
      // BLE sigue disponible para control en tiempo real
    } else {
      // Sin caché ni Firebase → mostrar estado vacío, NO simular
      // El usuario puede activar simulación manualmente desde el panel admin
      State.setApp({ deviceOnline: false, dataSource: 'none' });
      State.setDevice({ estado: 'OFFLINE', online: false });
    }
    // Intentar reconectar cada 30s si recupera internet
    setInterval(() => {
      if (!navigator.onLine) return;
      let fbRetry = false;
      try { fbRetry = firebaseInit(); } catch(e) {}
      if (fbRetry) {
        listenLecturas(deviceId);
        listenAlertas(deviceId);
        listenConfiguracion(deviceId, (cfg) => State.setConfig(cfg));
      }
    }, 30000);
  }

  await splashPromise;
  mostrarApp();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => {});
}
````

## File: src/js/router.js
````javascript
/**
 * router.js — Navegación SPA simple basada en hash
 */
import State from './state.js';

const PAGES = ['dashboard', 'control', 'alertas', 'historial', 'notas', 'config'];

export const Router = {
  init() {
    // Click en nav links
    document.querySelectorAll('.nav-link[data-page]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.navigate(link.dataset.page);
      });
    });

    // Hash inicial
    const hash = location.hash.replace('#', '') || 'dashboard';
    this.navigate(PAGES.includes(hash) ? hash : 'dashboard');
  },

  navigate(page) {
    if (!PAGES.includes(page)) page = 'dashboard';

    // Ocultar todas las páginas
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    // Mostrar la página activa
    const target = document.getElementById(`page-${page}`);
    if (target) target.classList.add('active');

    // Nav links
    document.querySelectorAll('.nav-link').forEach(l => {
      l.classList.toggle('active', l.dataset.page === page);
    });

    // Actualizar hash
    history.pushState(null, '', `#${page}`);

    // Cerrar nav en mobile
    document.getElementById('nav')?.classList.remove('open');
    document.getElementById('navOverlay')?.classList.add('hidden');

    // Notificar al State para que los módulos se activen
    State.setApp({ currentPage: page });
    State.emit('page:change', page);
  },
};
````

## File: src/js/state.js
````javascript
/**
 * state.js v2.0 — Estado global reactivo
 * Agrega: caché offline, modo BLE, sim por módulo, último timestamp
 */

import CONFIG from './config/app.config.js';

const _listeners = {};
let _deviceId = localStorage.getItem('deviceId') || CONFIG.DEVICE_ID;

// ── Caché de último dato conocido ────────────────────────────
const CACHE_KEY = 'hidro_last_data';

function _saveCache(device) {
  try {
    const cache = {
      data: { ...device },
      ts:   Date.now(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch(e) {}
}

function _loadCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch(e) { return null; }
}

// ── Sim por módulo (persiste en localStorage) ────────────────
const SIM_MODULES_KEY = 'hidro_sim_modules';

function _loadSimModules() {
  try {
    const raw = localStorage.getItem(SIM_MODULES_KEY);
    return raw ? JSON.parse(raw) : {
      nivel:       false,
      temperatura: false,
      humedad:     false,
      turbidez:    false,
      flujo:       false,
      ph:          false,
      tds:         false,
    };
  } catch(e) {
    return { nivel:false, temperatura:false, humedad:false,
             turbidez:false, flujo:false, ph:false, tds:false };
  }
}

function _saveSimModules(mods) {
  try { localStorage.setItem(SIM_MODULES_KEY, JSON.stringify(mods)); } catch(e) {}
}

const State = {

  // ── Datos del dispositivo ──────────────────────────────────
  _lastDataTs: null,
  device: {
    deviceId:        _deviceId,
    nombre:          'Tanque Principal',
    zona:            'Zona A',
    firmwareVersion: '--',
    ip:              '--',
    uptime:          0,
    rssi:            0,
    nivel:           0,
    temperatura:     0,
    humedad:         0,
    turbidez:        0,
    turbidezSim:     true,
    flujo:           0,
    flujoSim:        true,
    ph:              7.0,
    phSim:           true,
    tds:             0,
    tdsSim:          true,
    bomba:           false,
    modo:            'AUTOMATICO',
    estado:          'OFFLINE',
    mantenimiento:   false,
    alertasCount:    0,
    wifiConectado:   false,
    firebaseConectado: false,
    online:          false,
    ultimaLectura:   null,
  },

  // ── Estado de la app ──────────────────────────────────────
  app: {
    deviceOnline:    false,
    simModeActive:   false,   // sim completa (todos los módulos)
    simModules:      _loadSimModules(), // sim por módulo individual
    firebaseReady:   false,
    bleMode:         false,   // true = fuente de datos es BLE, no Firebase
    bleConnected:    false,
    currentPage:     'dashboard',
    deviceId:        _deviceId,
    lastDataTs:      null,    // timestamp del último dato real recibido
    dataSource:      'none',  // 'firebase' | 'ble' | 'sim' | 'cache' | 'none'
  },

  // ── Caché último dato conocido ────────────────────────────
  lastKnownData:   _loadCache(),

  alertas:  [],
  historial: [],
  notas:    [],
  umbrales: { ...CONFIG.UMBRALES },

  // ─────────────────────────────────────────────────────────
  // API PÚBLICA
  // ─────────────────────────────────────────────────────────

  setDevice(datos) {
    const antes = { ...this.device };
    Object.assign(this.device, datos);
    this.device.ultimaLectura = new Date();
    this.app.lastDataTs = Date.now();

    // Guardar caché si datos son reales (no simulados completos)
    if (!this.app.simModeActive) {
      _saveCache(this.device);
      this.lastKnownData = { data: { ...this.device }, ts: Date.now() };
    }

    this.emit('device:update', this.device);
    if (datos.estado && datos.estado !== antes.estado) this.emit('estado:change', datos.estado);
    if (datos.bomba !== undefined && datos.bomba !== antes.bomba) this.emit('bomba:change', datos.bomba);
  },

  setApp(datos) {
    Object.assign(this.app, datos);
    this.emit('app:update', this.app);
  },

  // ── Sim por módulo ────────────────────────────────────────

  /** Activa/desactiva simulación de un módulo individual */
  setSimModule(sensor, activo) {
    this.app.simModules[sensor] = activo;
    _saveSimModules(this.app.simModules);
    this.emit('simModules:update', this.app.simModules);
  },

  /** ¿Está simulado este sensor? (sim completa O sim por módulo) */
  isSensorSim(sensor) {
    return this.app.simModeActive || this.app.simModules[sensor] === true;
  },

  // ── Caché ─────────────────────────────────────────────────

  /** Carga el último dato conocido al State.device */
  cargarDesdeCache() {
    const cache = _loadCache();
    if (!cache) return false;
    this.lastKnownData = cache;
    // Cargar al device sin emitir — solo para mostrar en UI
    Object.assign(this.device, cache.data);
    this.device.online = false;
    this.device.estado = 'OFFLINE';
    this.app.lastDataTs = cache.ts;
    this.app.dataSource = 'cache';
    this.emit('device:update', this.device);
    this.emit('app:update', this.app);
    return true;
  },

  // ── Alertas ───────────────────────────────────────────────

  setAlertas(arr) {
    this.alertas = arr || [];
    this.emit('alertas:update', this.alertas);
  },

  addAlerta(alerta) {
    const existe = this.alertas.find(a => a.tipo === alerta.tipo && !a.resuelta);
    if (existe) return;
    this.alertas.unshift({ ...alerta, id: Date.now(), resuelta: false });
    this.emit('alertas:update', this.alertas);
  },

  resolverAlerta(id) {
    const idx = this.alertas.findIndex(a => a.id === id || a.tipo === id);
    if (idx >= 0) { this.alertas[idx].resuelta = true; this.emit('alertas:update', this.alertas); }
  },

  addHistorial(punto) {
    this.historial.push({ ...punto, ts: Date.now() });
    if (this.historial.length > CONFIG.CHART_MAX_POINTS) this.historial.shift();
    this.emit('historial:update', this.historial);
  },

  setNotas(arr) { this.notas = arr || []; this.emit('notas:update', this.notas); },
  addNota(nota) { this.notas.unshift(nota); this.emit('notas:update', this.notas); },
  setUmbrales(u) { Object.assign(this.umbrales, u); this.emit('umbrales:update', this.umbrales); },

  // ── Pub/Sub ───────────────────────────────────────────────

  on(evento, cb) {
    if (!_listeners[evento]) _listeners[evento] = [];
    _listeners[evento].push(cb);
  },

  off(evento, cb) {
    if (!_listeners[evento]) return;
    _listeners[evento] = _listeners[evento].filter(f => f !== cb);
  },

  emit(evento, datos) {
    (_listeners[evento] || []).forEach(cb => {
      try { cb(datos); } catch(e) { console.error(`[State] '${evento}':`, e); }
    });
  },

  // ── Helpers ───────────────────────────────────────────────
  getDeviceId()    { return this.app.deviceId; },
  isOnline()       { return this.app.deviceOnline; },
  isSimMode()      { return this.app.simModeActive; },
  isBleMode()      { return this.app.bleMode; },
  getAlertas()     { return this.alertas.filter(a => !a.resuelta); },
  getLastDataAge() {
    if (!this.app.lastDataTs) return null;
    return Math.floor((Date.now() - this.app.lastDataTs) / 1000);
  },
};

export default State;
````

## File: starters/jsonestrter
````
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
````

## File: starters/jsonestrter.json
````json
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
````

## File: index.html
````html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
  <meta name="theme-color" content="#0f2b3d">
  <meta name="description" content="HidroGanadero IoT — Monitoreo y control hídrico para ganado">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <title>HidroGanadero IoT</title>
  <link rel="manifest" href="manifest.json">
  <link rel="icon" href="public/icons/icon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="src/css/main.css">
  <link rel="stylesheet" href="src/css/animations.css">
</head>
<body>

<!-- ══════════════════════════════════════════════ -->
<!-- SPLASH SCREEN                                  -->
<!-- ══════════════════════════════════════════════ -->
<div id="splash" class="splash">
  <div class="splash-logo">
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
      <circle cx="36" cy="36" r="34" fill="#1b6b87" opacity="0.15"/>
      <path d="M36 10 C36 10 18 28 18 40 C18 50 26 58 36 58 C46 58 54 50 54 40 C54 28 36 10 36 10Z"
            fill="#2c9cbf" opacity="0.9"/>
      <path d="M36 22 C36 22 24 35 24 42 C24 48 29.4 53 36 53 C42.6 53 48 48 48 42 C48 35 36 22 36 22Z"
            fill="white" opacity="0.3"/>
    </svg>
    <span>HidroGanadero</span>
  </div>
  <div class="splash-bar"><div class="splash-fill" id="splashFill"></div></div>
  <p class="splash-sub">Iniciando sistema...</p>
</div>

<!-- ══════════════════════════════════════════════ -->
<!-- APP SHELL                                      -->
<!-- ══════════════════════════════════════════════ -->
<div id="app" class="app hidden">

  <!-- SIDEBAR NAV -->
  <nav id="nav" class="nav">
    <div class="nav-header">
      <svg class="nav-logo-icon" width="32" height="32" viewBox="0 0 72 72" fill="none">
        <path d="M36 8 C36 8 16 28 16 42 C16 53 25 62 36 62 C47 62 56 53 56 42 C56 28 36 8 36 8Z"
              fill="currentColor" opacity="0.85"/>
      </svg>
      <div>
        <div class="nav-logo-text">HidroGanadero</div>
        <div class="nav-logo-sub" id="navDeviceName">tanque_001</div>
      </div>
    </div>

    <div class="nav-status-bar">
      <span class="status-dot" id="navDot"></span>
      <span id="navEstado">Conectando...</span>
    </div>

    <ul class="nav-links">
      <li><a href="#dashboard"  class="nav-link active" data-page="dashboard">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
        Dashboard
      </a></li>
      <li><a href="#control"    class="nav-link" data-page="control">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3m-3.3-6.7-2.1 2.1M7.4 16.6l-2.1 2.1m12.7 0-2.1-2.1M7.4 7.4 5.3 5.3"/></svg>
        Control
      </a></li>
      <li><a href="#alertas"    class="nav-link" data-page="alertas">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86 1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        Alertas <span class="badge hidden" id="navBadgeAlertas">0</span>
      </a></li>
      <li><a href="#historial"  class="nav-link" data-page="historial">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        Historial
      </a></li>
      <li><a href="#notas"      class="nav-link" data-page="notas">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
        Notas
      </a></li>
      <li><a href="#salud" class="nav-link" data-page="salud">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        Salud
      </a></li>
      <li><a href="#config"     class="nav-link" data-page="config">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
        Configuración
      </a></li>
    </ul>

    <div class="nav-footer">
      <div class="nav-clock" id="navClock">--:--:--</div>
      <div class="nav-uptime" id="navUptime">Uptime: --</div>
      <div class="nav-rssi" id="navRssi">WiFi: -- dBm</div>
    </div>
  </nav>

  <!-- HAMBURGER (mobile) -->
  <button id="menuToggle" class="menu-toggle" aria-label="Menú">
    <span></span><span></span><span></span>
  </button>
  <div id="navOverlay" class="nav-overlay hidden"></div>

  <!-- MAIN CONTENT -->
  <main id="main" class="main">

    <!-- ─── PÁGINA: DASHBOARD ─────────────────────────── -->
    <section id="page-dashboard" class="page active">
      <div class="page-header">
        <h1>Dashboard</h1>
        <div class="header-right">
          <span class="online-badge" id="onlineBadge">● En línea</span>
          <span class="sim-badge hidden" id="simBadge">SIM</span>
          <span class="ble-online-badge hidden" id="bleBadge">BLE</span>
          <span class="cache-badge hidden" id="cacheBadge">CACHÉ</span>
        </div>
      </div>

      <!-- Banner offline -->
      <div class="offline-banner hidden" id="offlineBanner">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="1" y1="1" x2="23" y2="23"/><path d="M16.72 11.06A10.94 10.94 0 0119 12.55M5 12.55a10.94 10.94 0 015.17-2.39M10.71 5.05A16 16 0 0122.56 9M1.42 9a15.91 15.91 0 014.7-2.88M8.53 16.11a6 6 0 016.95 0M12 20h.01"/></svg>
        Sin conexión — mostrando últimos datos conocidos
      </div>

      <!-- Semáforo de estado -->
      <div class="estado-card" id="estadoCard">
        <div class="semaforo">
          <div class="semaforo-dot rojo"  id="semRojo"></div>
          <div class="semaforo-dot ambar" id="semAmbar"></div>
          <div class="semaforo-dot verde" id="semVerde"></div>
        </div>
        <div class="estado-info">
          <div class="estado-label" id="estadoLabel">NORMAL</div>
          <div class="estado-sub"   id="estadoSub">Sistema operando correctamente</div>
        </div>
        <div class="tanque-mini">
          <div class="tanque-mini-fill" id="tanqueMiniRell"></div>
          <div class="tanque-mini-level" id="tanqueMiniLabel">---%</div>
        </div>
      </div>

      <!-- Métricas principales -->
      <div class="metrics-grid">
        <div class="metric-card" data-sensor="nivel">
          <div class="metric-icon blue">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2c0 0-7 8-7 13a7 7 0 0014 0c0-5-7-13-7-13z"/></svg>
          </div>
          <div class="metric-body">
            <div class="metric-val" id="mNivel">--</div>
            <div class="metric-unit">%</div>
          </div>
          <div class="metric-label">Nivel Tanque</div>
          <div class="metric-bar"><div class="metric-bar-fill" id="mNivelBar"></div></div>
        </div>

        <div class="metric-card" data-sensor="litros">
          <div class="metric-icon blue">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </div>
          <div class="metric-body">
            <div class="metric-val" id="mLitros">--</div>
            <div class="metric-unit">L</div>
          </div>
          <div class="metric-label">Litros actuales</div>
        </div>

        <div class="metric-card" data-sensor="temperatura">
          <div class="metric-icon orange">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z"/></svg>
          </div>
          <div class="metric-body">
            <div class="metric-val" id="mTemp">--</div>
            <div class="metric-unit">°C</div>
          </div>
          <div class="metric-label">Temperatura</div>
        </div>

        <div class="metric-card" data-sensor="humedad">
          <div class="metric-icon teal">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 14.899A7 7 0 1115.71 8h1.79a4.5 4.5 0 012.5 8.242"/><path d="M16 14v6m-4-4v6m-4-4v6"/></svg>
          </div>
          <div class="metric-body">
            <div class="metric-val" id="mHum">--</div>
            <div class="metric-unit">%</div>
          </div>
          <div class="metric-label">Humedad</div>
        </div>

        <div class="metric-card" data-sensor="bomba">
          <div class="metric-icon" id="bombaIconWrap">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
          </div>
          <div class="metric-body">
            <div class="metric-val" id="mBomba">--</div>
          </div>
          <div class="metric-label">Bomba</div>
        </div>
      </div>

      <!-- Sensores secundarios (simulados) -->
      <h2 class="section-title">Sensores de Calidad del Agua</h2>
      <div class="metrics-grid secondary">
        <div class="metric-card small">
          <div class="metric-label-row">
            <span class="metric-label">Turbidez</span>
            <span class="sim-dot-sensor hidden" id="simDot_turbidez" title="Simulado">◈</span>
          </div>
          <div class="metric-body"><div class="metric-val" id="mTurbidez">--</div><div class="metric-unit">NTU</div></div>
          <div class="metric-bar"><div class="metric-bar-fill" id="mTurbidezBar" style="width:0%"></div></div>
        </div>
        <div class="metric-card small">
          <div class="metric-label-row">
            <span class="metric-label">Flujo</span>
            <span class="sim-dot-sensor hidden" id="simDot_flujo" title="Simulado">◈</span>
          </div>
          <div class="metric-body"><div class="metric-val" id="mFlujo">--</div><div class="metric-unit">L/min</div></div>
          <div class="metric-bar"><div class="metric-bar-fill" id="mFlujoBar" style="width:0%"></div></div>
        </div>
        <div class="metric-card small">
          <div class="metric-label-row">
            <span class="metric-label">pH</span>
            <span class="sim-dot-sensor hidden" id="simDot_ph" title="Simulado">◈</span>
          </div>
          <div class="metric-body"><div class="metric-val" id="mPH">--</div></div>
          <div class="metric-bar"><div class="metric-bar-fill" id="mPHBar" style="width:0%"></div></div>
        </div>
        <div class="metric-card small">
          <div class="metric-label-row">
            <span class="metric-label">TDS</span>
            <span class="sim-dot-sensor hidden" id="simDot_tds" title="Simulado">◈</span>
          </div>
          <div class="metric-body"><div class="metric-val" id="mTDS">--</div><div class="metric-unit">ppm</div></div>
          <div class="metric-bar"><div class="metric-bar-fill" id="mTDSBar" style="width:0%"></div></div>
        </div>
      </div>

      <!-- Tarjeta resumen del día -->
      <div class="resumen-dia-card hidden" id="resumenDiaCard">
        <div class="resumen-dia-title">Hoy</div>
        <div class="resumen-dia-grid">
          <div class="resumen-item"><span class="resumen-val" id="rCiclos">--</span><span class="resumen-lbl">ciclos bomba</span></div>
          <div class="resumen-item"><span class="resumen-val" id="rMinutos">--</span><span class="resumen-lbl">encendida</span></div>
          <div class="resumen-item"><span class="resumen-val" id="rLitros">--</span><span class="resumen-lbl">bombeados</span></div>
          <div class="resumen-item"><span class="resumen-val" id="rFuga" style="font-size:0.8rem">Sin anomalías</span><span class="resumen-lbl">anomalías</span></div>
        </div>
      </div>

      <!-- Última actualización -->
      <div class="last-update">
        <span>Última actualización: <strong id="lastUpdateTime">--</strong></span>
        <span class="cache-age-badge hidden" id="cacheAgeBadge"></span>
      </div>
    </section>

    <!-- ─── PÁGINA: CONTROL ───────────────────────────── -->
    <section id="page-control" class="page">
      <div class="page-header"><h1>Control Remoto</h1></div>

      <!-- Estado de conexión -->
      <div class="and-gate-card" id="andGateCard">
        <div class="and-gate-row">
          <div class="gate-input" id="gateA">
            <span class="gate-led"></span>WiFi
          </div>
          <div class="gate-symbol">·</div>
          <div class="gate-input" id="gateB">
            <span class="gate-led"></span>Firebase
          </div>
        </div>
        <p class="gate-note" id="gateNote">Control remoto disponible</p>
      </div>

      <!-- Control de bomba -->
      <div class="control-card">
        <h2>Bomba de Agua</h2>
        <div class="bomba-display">
          <div class="bomba-visual" id="bombaVisual">
            <svg width="80" height="80" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="36" class="bomba-ring"/>
              <circle cx="40" cy="40" r="28" class="bomba-inner" id="bombaInnerCircle"/>
              <path d="M40 28 C40 28 28 38 28 44 C28 50 33.4 54 40 54 C46.6 54 52 50 52 44 C52 38 40 28 40 28Z"
                    class="bomba-drop" id="bombaDropIcon"/>
            </svg>
          </div>
          <div class="bomba-info">
            <div class="bomba-status" id="bombaStatus">APAGADA</div>
            <div class="bomba-mode"  id="bombaMode">Modo: AUTOMÁTICO</div>
          </div>
        </div>
        <div class="bomba-btns">
          <button class="btn btn-success" id="btnBombaOn"  onclick="UIControl.setBomba(true)">Encender Bomba</button>
          <button class="btn btn-danger"  id="btnBombaOff" onclick="UIControl.setBomba(false)">Apagar Bomba</button>
        </div>
        <p class="control-warning" id="controlWarning"></p>
      </div>

      <!-- Modo de operación -->
      <div class="control-card">
        <h2>Modo de Operación</h2>
        <div class="mode-btns">
          <button class="btn btn-mode" id="btnModoAuto" onclick="UIControl.setModo(true)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
            Automático
          </button>
          <button class="btn btn-mode-outline" id="btnModoManual" onclick="UIControl.setModo(false)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
            Manual
          </button>
        </div>
        <div class="mode-description" id="modeDescription">
          En modo automático, la bomba se activa cuando el nivel baja del 25% y se apaga al superar el 90%.
        </div>
      </div>

      <!-- Estado del dispositivo -->
      <div class="control-card">
        <h2>Estado del Dispositivo</h2>
        <div class="device-info-grid" id="deviceInfoGrid">
          <div class="di-row"><span>Firmware</span><strong id="diFw">--</strong></div>
          <div class="di-row"><span>IP</span><strong id="diIp">--</strong></div>
          <div class="di-row"><span>Uptime</span><strong id="diUptime">--</strong></div>
          <div class="di-row"><span>RSSI</span><strong id="diRssi">--</strong></div>
          <div class="di-row"><span>Online</span><strong id="diOnline">--</strong></div>
          <div class="di-row"><span>Alertas activas</span><strong id="diAlertas">--</strong></div>
        </div>
      </div>
    </section>

    <!-- ─── PÁGINA: ALERTAS ───────────────────────────── -->
    <section id="page-alertas" class="page">
      <div class="page-header">
        <h1>Alertas</h1>
        <button class="btn btn-sm btn-outline" onclick="UIAlertas.resolverTodas()">Resolver todas</button>
      </div>
      <div id="alertasList" class="alertas-list">
        <div class="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <p>Sin alertas activas</p>
        </div>
      </div>
      <!-- Timeline de eventos recientes -->
      <div style="margin-top:24px">
        <h2 style="font-size:1rem;color:var(--text2);margin-bottom:10px">Eventos recientes (sesión)</h2>
        <div id="timelineList" class="timeline-list"></div>
      </div>

      <!-- Historial de alertas resueltas -->
      <div style="margin-top:24px">
        <h2 style="font-size:1rem;color:var(--text2);margin-bottom:10px">Alertas resueltas</h2>
        <div id="alertasHistorial" class="alertas-list"></div>
      </div>
    </section>

    <!-- ─── PÁGINA: HISTORIAL ─────────────────────────── -->
    <section id="page-historial" class="page">
      <div class="page-header">
        <h1>Historial</h1>
        <div class="header-right">
          <button class="btn btn-sm btn-outline" onclick="UICharts.exportarCSV()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            CSV
          </button>
          <select id="historialRange" class="select-sm" onchange="UICharts.cambiarRango(this.value)">
            <option value="30">Últimas 30 lecturas</option>
            <option value="60">Últimas 60 lecturas</option>
            <option value="100">Últimas 100</option>
          </select>
        </div>
      </div>
      <div class="charts-grid">
        <div class="chart-card">
          <h3>Nivel del Tanque (%)</h3>
          <canvas id="chartNivel" height="120"></canvas>
        </div>
        <div class="chart-card">
          <h3>Temperatura (°C)</h3>
          <canvas id="chartTemp" height="120"></canvas>
        </div>
        <div class="chart-card">
          <h3>Turbidez (NTU)</h3>
          <canvas id="chartTurbidez" height="120"></canvas>
        </div>
        <div class="chart-card">
          <h3>pH</h3>
          <canvas id="chartPH" height="120"></canvas>
        </div>
        <div class="chart-card">
          <h3>Litros bombeados por hora</h3>
          <canvas id="chartLitros" height="120"></canvas>
        </div>
      </div>
    </section>

    <!-- ─── PÁGINA: SALUD DEL SISTEMA ─────────────────── -->
    <section id="page-salud" class="page">
      <div class="page-header"><h1>Salud del Sistema</h1></div>
      <div id="saludGrid" class="salud-grid"></div>
    </section>

    <!-- ─── PÁGINA: NOTAS ─────────────────────────────── -->
    <section id="page-notas" class="page">
      <div class="page-header"><h1>Notas del Operador</h1></div>
      <div class="nota-form-card">
        <textarea id="notaTexto" class="nota-input" placeholder="Escribe una nota de mantenimiento, observación o incidencia..." rows="3"></textarea>
        <div class="nota-form-footer">
          <select id="notaTipo" class="select-sm">
            <option value="operacion">Operación</option>
            <option value="mantenimiento">Mantenimiento</option>
            <option value="incidencia">Incidencia</option>
            <option value="observacion">Observación</option>
          </select>
          <button class="btn btn-primary" onclick="UINotas.guardar()">Guardar nota</button>
        </div>
      </div>
      <div id="notasList" class="notas-list"></div>
    </section>

    <!-- ─── PÁGINA: CONFIGURACIÓN ─────────────────────── -->
    <section id="page-config" class="page">
      <div class="page-header"><h1>Configuración</h1></div>

      <div class="config-card">
        <h2>Umbrales de Nivel</h2>
        <div class="config-row">
          <label>Nivel mínimo (bomba ON)</label>
          <div class="config-input-row">
            <input type="range" id="cfgNivelMin" min="5" max="40" value="25" oninput="UIConfig.preview('cfgNivelMinVal', this.value, '%')">
            <span id="cfgNivelMinVal">25%</span>
          </div>
        </div>
        <div class="config-row">
          <label>Nivel máximo (bomba OFF)</label>
          <div class="config-input-row">
            <input type="range" id="cfgNivelMax" min="60" max="98" value="90" oninput="UIConfig.preview('cfgNivelMaxVal', this.value, '%')">
            <span id="cfgNivelMaxVal">90%</span>
          </div>
        </div>
      </div>

      <div class="config-card">
        <h2>Umbrales de Temperatura</h2>
        <div class="config-row">
          <label>Temperatura alta (advertencia)</label>
          <div class="config-input-row">
            <input type="range" id="cfgTempAlta" min="25" max="45" value="35" oninput="UIConfig.preview('cfgTempAltaVal', this.value, '°C')">
            <span id="cfgTempAltaVal">35°C</span>
          </div>
        </div>
      </div>

      <!-- Notificaciones push -->
      <div class="config-card">
        <h2>Notificaciones</h2>
        <div class="toggle-row">
          <label style="font-size:0.88rem;color:var(--text2)">Alertas críticas (nivel 3-4) al instante</label>
          <button class="btn btn-sm btn-outline" id="btnActivarNotif" onclick="activarNotificaciones()">
            Activar notificaciones
          </button>
        </div>
        <p class="config-note" id="notifStatus">Estado: no configurado. Solo funciona si instalas la app.</p>
      </div>

      <div class="config-card">
        <h2>Firebase</h2>
        <div class="config-row">
          <label>Device ID</label>
          <input type="text" id="cfgDeviceId" class="config-text-input" value="tanque_001" placeholder="tanque_001">
        </div>
        <p class="config-note">Cambiar el Device ID para monitorear otro tanque. Debe coincidir con DEVICE_ID en mod_config.h</p>
      </div>

      <!-- MODO DE FUENTE DE DATOS -->
      <div class="config-card">
        <h2>Fuente de datos</h2>
        <div class="modo-fuente-btns">
          <button class="btn btn-modo-fuente" id="btnModoFirebase"
                  onclick="UIConfig.desactivarBLE()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0"/><path d="M3.6 9h16.8M3.6 15h16.8M11.5 3a17 17 0 0 0 0 18M12.5 3a17 17 0 0 1 0 18"/>
            </svg>
            Firebase / WiFi
          </button>
          <button class="btn btn-modo-fuente" id="btnModoBLE"
                  onclick="UIConfig.activarBLE()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6.5 6.5 17.5 17.5 12 23 12 1 17.5 6.5 6.5 17.5"/>
            </svg>
            Bluetooth (BLE)
          </button>
        </div>
        <p class="config-note" id="modoActualInfo">Verificando modo actual...</p>
        <p class="config-note">En modo BLE los datos llegan directamente del ESP32 sin necesidad de WiFi. No hay historial en este modo.</p>
      </div>

      <!-- SIMULACIÓN COMPLETA -->
      <div class="config-card">
        <h2>Modo de datos (simulación)</h2>
        <div class="config-row toggle-row">
          <label>Usar datos simulados (sin ESP32)</label>
          <label class="toggle">
            <input type="checkbox" id="cfgSimMode" onchange="UIConfig.toggleSimMode(this.checked)">
            <span class="toggle-slider"></span>
          </label>
        </div>
        <p class="config-note">Cuando el ESP32 no tiene señal, los simuladores generan datos realistas para demostración.</p>
      </div>

      <!-- ─── TARJETA BLE — CAMBIAR WIFI DEL ESP32 ─────────── -->
      <div class="config-card ble-card">
        <h2>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-3px;margin-right:6px">
            <polyline points="6.5 6.5 17.5 17.5 12 23 12 1 17.5 6.5 6.5 17.5"/>
          </svg>
          Cambiar WiFi del ESP32 (Bluetooth)
        </h2>

        <p class="config-note" style="margin-bottom:14px">
          Si mueves el tanque a otra ubicación con diferente red, conecta por Bluetooth
          y envía las nuevas credenciales sin necesidad de reflashear el ESP32.
        </p>

        <!-- Estado de conexión BLE -->
        <div class="ble-status" id="bleStatus">
          <span class="ble-dot" id="bleDot"></span>
          <span id="bleStatusText">No conectado</span>
        </div>

        <!-- Botón conectar -->
        <button class="btn btn-outline ble-btn" id="bleBtnConectar"
                onclick="UIBLE.conectar()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6.5 6.5 17.5 17.5 12 23 12 1 17.5 6.5 6.5 17.5"/>
          </svg>
          Buscar ESP32 por Bluetooth
        </button>

        <!-- Formulario WiFi (oculto hasta conectar) -->
        <div id="bleWifiForm" class="ble-form hidden">
          <div class="config-row">
            <label>Nombre de la red (SSID)</label>
            <input type="text" id="bleSSID" class="config-text-input"
                   placeholder="NombreDeTuRed" maxlength="32">
          </div>
          <div class="config-row">
            <label>Contraseña</label>
            <div style="position:relative">
              <input type="password" id="blePass" class="config-text-input"
                     placeholder="Contraseña del WiFi" id="blePass">
              <button onclick="UIBLE.togglePass()" class="ble-eye" id="bleEye">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="ble-form-btns">
            <button class="btn btn-primary" onclick="UIBLE.enviarWifi()">
              Enviar nueva red al ESP32
            </button>
            <button class="btn btn-outline" onclick="UIBLE.desconectar()">
              Desconectar BLE
            </button>
          </div>

          <div id="bleProgress" class="ble-progress hidden">
            <div class="ble-progress-bar">
              <div class="ble-progress-fill" id="bleProgressFill"></div>
            </div>
            <p id="bleProgressMsg">Enviando credenciales...</p>
          </div>
        </div>

        <p class="config-note" style="margin-top:12px">
          ⚠ Web Bluetooth requiere <strong>Chrome o Edge</strong> en Android o escritorio.
          No funciona en Safari ni Firefox.
        </p>
      </div>

      <!-- PANEL OCULTO: SIM POR MÓDULO (3 toques en título Configuración) -->
      <div id="panelSimModulos" class="config-card hidden" style="border-color:rgba(124,58,237,0.4)">
        <h2 style="color:var(--accent)">
          ⚙ Simulación por módulo
          <span style="font-size:0.7rem;color:var(--text3);font-weight:400"> — solo afecta módulos individuales</span>
        </h2>
        <p class="config-note" style="margin-bottom:14px">Activa simulación para sensores específicos. Útil cuando no tienes todos los sensores físicos conectados.</p>

        <div class="sim-modulos-grid">
          <div class="sim-mod-row">
            <label>Nivel (HC-SR04)</label>
            <label class="toggle"><input type="checkbox" id="simMod_nivel"
              onchange="UIConfig.toggleSimModulo('nivel', this.checked)">
              <span class="toggle-slider"></span></label>
          </div>
          <div class="sim-mod-row">
            <label>Temperatura (DHT22)</label>
            <label class="toggle"><input type="checkbox" id="simMod_temperatura"
              onchange="UIConfig.toggleSimModulo('temperatura', this.checked)">
              <span class="toggle-slider"></span></label>
          </div>
          <div class="sim-mod-row">
            <label>Humedad (DHT22)</label>
            <label class="toggle"><input type="checkbox" id="simMod_humedad"
              onchange="UIConfig.toggleSimModulo('humedad', this.checked)">
              <span class="toggle-slider"></span></label>
          </div>
          <div class="sim-mod-row">
            <label>Turbidez</label>
            <label class="toggle"><input type="checkbox" id="simMod_turbidez"
              onchange="UIConfig.toggleSimModulo('turbidez', this.checked)">
              <span class="toggle-slider"></span></label>
          </div>
          <div class="sim-mod-row">
            <label>Flujo</label>
            <label class="toggle"><input type="checkbox" id="simMod_flujo"
              onchange="UIConfig.toggleSimModulo('flujo', this.checked)">
              <span class="toggle-slider"></span></label>
          </div>
          <div class="sim-mod-row">
            <label>pH</label>
            <label class="toggle"><input type="checkbox" id="simMod_ph"
              onchange="UIConfig.toggleSimModulo('ph', this.checked)">
              <span class="toggle-slider"></span></label>
          </div>
          <div class="sim-mod-row">
            <label>TDS</label>
            <label class="toggle"><input type="checkbox" id="simMod_tds"
              onchange="UIConfig.toggleSimModulo('tds', this.checked)">
              <span class="toggle-slider"></span></label>
          </div>
        </div>

        <button class="btn btn-outline" style="margin-top:14px"
                onclick="UIConfig.resetSimModulos()">
          Desactivar todos
        </button>
      </div>

      <div class="config-footer">
        <!-- Calibración del tanque -->
        <div style="margin-top:16px;padding-top:14px;border-top:1px solid var(--border)">
          <h3 style="font-size:.88rem;color:var(--text2);margin-bottom:10px">📐 Calibración del Tanque</h3>
          <div class="config-row">
            <label class="config-label">Altura total cm
              <span class="config-hint">Del fondo al borde del tanque</span>
            </label>
            <input type="number" id="cfgTanqueAltura" class="input-sm" placeholder="ej. 120" min="10" max="500">
          </div>
          <div class="config-row">
            <label class="config-label">Offset sensor cm
              <span class="config-hint">Distancia HC-SR04 al borde superior</span>
            </label>
            <input type="number" id="cfgTanqueOffset" class="input-sm" placeholder="ej. 5" min="0" max="50">
          </div>
          <div class="config-row">
            <label class="config-label">Volumen total litros
              <span class="config-hint">Capacidad máxima del tanque</span>
            </label>
            <input type="number" id="cfgTanqueVolumen" class="input-sm" placeholder="ej. 1000" min="1">
          </div>
        </div>

        <button class="btn btn-primary" onclick="UIConfig.guardar()">Guardar configuración</button>
        <button class="btn btn-outline" onclick="UIConfig.resetear()">Restaurar valores</button>
      </div>

      <!-- Botón acceso panel avanzado -->
      <div class="admin-btn-wrap">
        <button class="btn-admin-access" id="btnAdminAccess"
                onclick="UIConfig.mostrarAdminLogin()"
                title="Panel avanzado">⚙</button>
      </div>

    </section>

  </main>

<!-- Modal contraseña admin — fuera de sections para evitar overflow -->
<div id="adminModal" class="admin-modal hidden">
  <div class="admin-modal-box">
    <p class="admin-modal-title">Panel avanzado</p>
    <input type="password" id="adminPassInput" class="admin-pass-input"
           placeholder="Contraseña"
           onkeydown="if(event.key==='Enter') UIConfig.verificarAdmin()">
    <div class="admin-modal-btns">
      <button class="btn btn-primary" onclick="UIConfig.verificarAdmin()">Entrar</button>
      <button class="btn btn-outline" onclick="UIConfig.cerrarAdminLogin()">Cancelar</button>
    </div>
    <p class="admin-modal-error hidden" id="adminError">Contraseña incorrecta</p>
  </div>
</div>

</div>

<!-- TOAST NOTIFICATIONS -->
<div id="toastContainer" class="toast-container"></div>

<!-- Scripts — ES Modules -->
<script type="module" src="src/js/app.js"></script>
</body>
</html>
````

## File: manifest.json
````json
{
  "name": "HidroGanadero IoT",
  "short_name": "HidroGanadero",
  "description": "Monitoreo y control hídrico para ganado con ESP32",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0d1f2c",
  "theme_color": "#0f2b3d",
  "orientation": "any",
  "icons": [
    { "src": "public/icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any maskable" },
    { "src": "public/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable" }
  ],
  "categories": ["utilities", "agriculture"],
  "lang": "es"
}
````

## File: package.json
````json
{
  "name": "hidro-ganadero-pwa",
  "version": "1.0.0",
  "description": "HidroGanadero IoT — PWA de monitoreo hídrico ganadero",
  "private": true,
  "scripts": {
    "dev":   "npx serve . --listen 3000 --no-clipboard",
    "start": "npx serve . --listen 3000",
    "build": "echo 'Sin build — ES Modules nativos, listo para deploy'"
  },
  "devDependencies": {
    "serve": "^14.2.3"
  }
}
````

## File: README.md
````markdown
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
````

## File: sw.js
````javascript
/**
 * sw.js — Service Worker v3.0
 * Agrega: notificaciones push para alertas críticas
 */

const CACHE_NAME = 'hidro-iot-v3.0.0';

const PRECACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/src/css/main.css',
  '/src/css/animations.css',
  '/src/js/app.js',
  '/src/js/state.js',
  '/src/js/router.js',
  '/src/js/config/app.config.js',
  '/src/js/firebase/firebase.js',
  '/src/js/device/device.manager.js',
  '/src/js/simulators/sim.main.js',
  '/src/js/modules/estados.module.js',
  '/src/js/ui/ui.dashboard.js',
  '/src/js/ui/ui.control.js',
  '/src/js/ui/ui.modules.js',
  '/src/js/ui/ui.ble.js',
  '/src/js/ui/ui.config.js',
  '/src/js/bluetooth/ble.manager.js',
  '/src/js/utils/toast.js',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const url = e.request.url;
  if (url.includes('firebase') || url.includes('googleapis') || url.includes('cdnjs') || url.includes('gstatic')) {
    e.respondWith(fetch(e.request).catch(() => new Response('', { status: 503 })));
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => {
      return cached || fetch(e.request).then(resp => {
        const clone = resp.clone();
        caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        return resp;
      });
    }).catch(() => caches.match('/index.html'))
  );
});

// ── Notificaciones push ───────────────────────────────────────
self.addEventListener('push', (e) => {
  if (!e.data) return;
  const data = e.data.json();
  e.waitUntil(
    self.registration.showNotification(data.title || 'HidroGanadero', {
      body: data.body || '',
      icon: '/public/icons/icon-192.png',
      badge: '/public/icons/icon-192.png',
      tag: data.tag || 'hidro-alerta',
      data: { url: data.url || '/#alertas' },
    })
  );
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      const url = e.notification.data?.url || '/';
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.focus();
          client.navigate(url);
          return;
        }
      }
      if (clients.openWindow) clients.openWindow(url);
    })
  );
});

// ── Mensajes desde la app (para enviar notificaciones locales) ─
self.addEventListener('message', (e) => {
  if (e.data?.type === 'NOTIFY_ALERTA') {
    const { titulo, cuerpo, nivel } = e.data;
    if (nivel >= 3) {
      self.registration.showNotification(titulo || 'HidroGanadero — Alerta', {
        body:  cuerpo || '',
        icon:  '/public/icons/icon-192.png',
        badge: '/public/icons/icon-192.png',
        tag:   'hidro-alerta',
        requireInteraction: nivel >= 4,
      });
    }
  }
});
````
