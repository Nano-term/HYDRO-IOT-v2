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
