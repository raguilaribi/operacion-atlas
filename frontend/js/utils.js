// OPERACIÓN ATLAS - Utilidades Frontend
// Helpers generales para manipular el DOM y mensajes de estado

window.ATLAS = window.ATLAS || {};

(function () {
  function qs(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function qsa(selector, scope) {
    return Array.from((scope || document).querySelectorAll(selector));
  }

  function showStatusMessage(message, type = 'info') {
    const el = qs('#statusMessage');
    if (!el) return;

    el.textContent = message;
    el.classList.remove('hidden', 'status-success', 'status-error', 'status-info');

    if (type === 'success') {
      el.classList.add('status-success');
    } else if (type === 'error') {
      el.classList.add('status-error');
    } else {
      el.classList.add('status-info');
    }

    setTimeout(() => {
      el.classList.add('hidden');
    }, 3000);
  }

  function switchScreen(targetId) {
    const screens = qsa('.screen');
    screens.forEach((screen) => {
      if (screen.id === targetId) {
        screen.classList.add('active');
      } else {
        screen.classList.remove('active');
      }
    });
  }

  ATLAS.utils = {
    qs,
    qsa,
    showStatusMessage,
    switchScreen
  };
})();
