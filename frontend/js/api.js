// OPERACIÓN ATLAS - Capa de API (FASE 5)
// Cliente HTTP hacia el backend: autenticación real y endpoints de juego.

window.ATLAS = window.ATLAS || {};

(function () {
  const API = {};
  const API_BASE = '/api/v1';

  const ACCESS_TOKEN_KEY = 'atlas_access_token';
  const REFRESH_TOKEN_KEY = 'atlas_refresh_token';
  const USER_KEY = 'atlas_user';

  function saveSession(user, tokens) {
    try {
      if (tokens && tokens.accessToken) {
        localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
      }
      if (tokens && tokens.refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
      }
      if (user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      }
    } catch (error) {
      console.warn('No se pudo guardar la sesión localmente:', error);
    }
  }

  function clearSession() {
    try {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch (error) {
      console.warn('No se pudo limpiar la sesión localmente:', error);
    }
  }

  function getAccessToken() {
    try {
      return localStorage.getItem(ACCESS_TOKEN_KEY) || '';
    } catch (_) {
      return '';
    }
  }

  function getAuthHeaders(extraHeaders = {}) {
    const token = getAccessToken();
    const headers = {
      'Content-Type': 'application/json',
      ...extraHeaders
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  async function handleJsonResponse(response) {
    const contentType = response.headers.get('Content-Type') || '';
    const isJson = contentType.includes('application/json');
    const data = isJson ? await response.json() : null;

    if (!response.ok) {
      const message = (data && data.message) || `Error HTTP ${response.status}`;
      throw new Error(message);
    }

    return data;
  }

  // ==========================
  // AUTENTICACIÓN
  // ==========================

  API.login = async function login({ username, password }) {
    if (!username || !password) {
      throw new Error('Username y contraseña son requeridos');
    }

    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await handleJsonResponse(res);
    const user = {
      ...data.user,
      displayName: data.user.username
    };

    saveSession(user, data.tokens);
    return user;
  };

  API.register = async function register({ username, email, password }) {
    if (!username || !email || !password) {
      throw new Error('Todos los campos son obligatorios');
    }

    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        email,
        password,
        passwordConfirm: password
      })
    });

    const data = await handleJsonResponse(res);
    const user = {
      ...data.user,
      displayName: data.user.username
    };

    // Opcional: iniciar sesión inmediatamente tras registrarse
    saveSession(user, data.tokens);
    return user;
  };

  API.logout = async function logout() {
    const token = getAccessToken();
    if (token) {
      try {
        await fetch(`${API_BASE}/auth/logout`, {
          method: 'POST',
          headers: getAuthHeaders()
        });
      } catch (error) {
        console.warn('Error en logout remoto (se limpiará igual la sesión local):', error);
      }
    }
    clearSession();
  };

  API.getCurrentUser = function getCurrentUser() {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  };

  // ==========================
  // JUEGO (FASE 5)
  // ==========================

  API.startGameSession = async function startGameSession(difficulty) {
    const res = await fetch(`${API_BASE}/games/start`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ difficulty })
    });

    const data = await handleJsonResponse(res);
    return data.game;
  };

  API.performGameAction = async function performGameAction(gameId, { actionType, locationId }) {
    if (!gameId) {
      throw new Error('No hay partida activa');
    }

    const res = await fetch(`${API_BASE}/games/${encodeURIComponent(gameId)}/action`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ actionType, locationId })
    });

    const data = await handleJsonResponse(res);
    return data.action;
  };

  ATLAS.api = API;
})();
