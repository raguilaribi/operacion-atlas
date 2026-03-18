// OPERACIÓN ATLAS - Capa de API (stub)
// En FASE 4 usamos logica local; en FASE 5 se reemplaza por llamadas reales al backend

window.ATLAS = window.ATLAS || {};

(function () {
  const API = {};

  // Login local simulado: solo valida que exista username
  API.login = async function login({ username, password }) {
    if (!username || !password) {
      throw new Error('Debes ingresar usuario y contraseña');
    }

    // En FASE 5 esto se reemplaza por llamada real a backend
    return {
      username,
      displayName: username,
      role: 'player'
    };
  };

  // Registro local simulado
  API.register = async function register({ username, email, password }) {
    if (!username || !email || !password) {
      throw new Error('Todos los campos son obligatorios');
    }
    // No persistimos nada, solo confirmamos
    return {
      username,
      email
    };
  };

  // Creacion de "sesion de juego" local
  API.createLocalGameSession = async function createLocalGameSession(difficulty) {
    const now = Date.now();
    return {
      id: `local-${now}`,
      difficulty,
      startedAt: now
    };
  };

  ATLAS.api = API;
})();
