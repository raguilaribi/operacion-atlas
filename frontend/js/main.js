// OPERACIÓN ATLAS - Punto de entrada frontend
// Orquesta autenticación local y flujo de pantallas para FASE 4

window.ATLAS = window.ATLAS || {};

(function () {
  const { qs, showStatusMessage } = ATLAS.utils || {};

  function initAuthTabs() {
    const tabs = document.querySelectorAll('.tab-button');
    const loginForm = qs('#loginForm');
    const registerForm = qs('#registerForm');

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');

        const tabName = tab.getAttribute('data-tab');
        if (tabName === 'login') {
          loginForm.classList.add('active');
          registerForm.classList.remove('active');
        } else {
          registerForm.classList.add('active');
          loginForm.classList.remove('active');
        }
      });
    });
  }

  function initLoginForm() {
    const form = qs('#loginForm');
    if (!form) return;

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const username = qs('#loginUsername').value.trim();
      const password = qs('#loginPassword').value.trim();

      try {
        const user = await ATLAS.api.login({ username, password });
        showStatusMessage('Bienvenido, agente.', 'success');
        ATLAS.ui.handleLoginSuccess(user);
      } catch (error) {
        showStatusMessage(error.message || 'No se pudo iniciar sesión.', 'error');
      }
    });
  }

  function initRegisterForm() {
    const form = qs('#registerForm');
    if (!form) return;

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const username = qs('#regUsername').value.trim();
      const email = qs('#regEmail').value.trim();
      const password = qs('#regPassword').value.trim();

      try {
        await ATLAS.api.register({ username, email, password });
        showStatusMessage('Cuenta local creada (no persistente). Usa tus datos para ingresar.', 'success');
      } catch (error) {
        showStatusMessage(error.message || 'No se pudo registrar el usuario.', 'error');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    ATLAS.ui.initScreens();
    initAuthTabs();
    initLoginForm();
    initRegisterForm();
    ATLAS.ui.initNavigation();
    ATLAS.ui.initHomeActions();
    ATLAS.ui.initDifficultySelection();
  });
})();
