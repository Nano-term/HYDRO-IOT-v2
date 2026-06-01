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
