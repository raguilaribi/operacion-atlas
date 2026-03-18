// OPERACIÓN ATLAS - UI de juego (FASE 5)
// Manejo de pantallas, HUD y logica de juego conectada al backend

window.ATLAS = window.ATLAS || {};

(function () {
  const { qs, qsa, showStatusMessage, switchScreen } = ATLAS.utils || {};

  const Game = {
    current: null,
    timerId: null,

    difficulties: {
      easy: { label: 'FÁCIL', totalSeconds: 5 * 60 },
      normal: { label: 'NORMAL', totalSeconds: 3 * 60 },
      hard: { label: 'DIFÍCIL', totalSeconds: 60 }
    },

    baseObjectives: [
      'Identificar la ultima ubicacion conocida del objetivo',
      'Confirmar identidad cruzando al menos 2 fuentes',
      'Enviar reporte preliminar al centro de mando'
    ],

    startNewGame: async function startNewGame(difficultyKey) {
      const difficulty = this.difficulties[difficultyKey] || this.difficulties.normal;

      try {
        const game = await ATLAS.api.startGameSession(difficultyKey);

        this.current = {
          id: game.gameId,
          difficultyKey,
          difficultyLabel: difficulty.label,
          totalSeconds: difficulty.totalSeconds,
          remainingSeconds: difficulty.totalSeconds,
          alertLevel: 'low',
          objectives: this.baseObjectives.map((text, index) => ({
            id: index + 1,
            text,
            completed: false
          })),
          log: []
        };

        this.renderGameScreen();
        this.startTimer();
        this.log('Sesión de juego iniciada en el servidor. Puedes comenzar a investigar.');
      } catch (error) {
        console.error('Error iniciando partida:', error);
        showStatusMessage(error.message || 'No se pudo iniciar la operación.', 'error');
        switchScreen('homeScreen');
      }
    },

    renderGameScreen: function renderGameScreen() {
      const gameScreen = qs('#gameScreen');
      if (!gameScreen) return;

      const container = gameScreen.querySelector('.screen-container');
      if (!container) return;

      container.classList.add('game-layout');

      const state = this.current;
      const minutes = String(Math.floor(state.remainingSeconds / 60)).padStart(2, '0');
      const seconds = String(state.remainingSeconds % 60).padStart(2, '0');

      container.innerHTML = `
        <div class="game-hud">
          <div class="game-hud-left">
            <h2 class="glow-text">🎯 Operación en curso</h2>
            <p class="game-hint">Dificultad: <strong>${state.difficultyLabel}</strong></p>
          </div>
          <div class="game-hud-meta">
            <div class="game-timer" id="gameTimer">
              ⏱ <span id="gameTimerValue">${minutes}:${seconds}</span>
            </div>
            <span class="game-alert-badge game-alert-low" id="gameAlertBadge">Alerta baja</span>
          </div>
        </div>
        <div class="game-body">
          <div class="game-map">
            <div class="game-map-header">
              <span>📍 Mapa operativo - Santiago Centro</span>
              <span class="game-hint">Vista simplificada; el mapa completo llegará en una fase posterior</span>
            </div>
            <div class="game-map-grid" id="gameMapGrid">
              ${this.renderMapCells()}
            </div>
          </div>
          <aside class="game-sidebar">
            <h3>🎯 Objetivos de la misión</h3>
            <ul class="objectives-list" id="objectivesList">
              ${state.objectives
                .map(
                  (obj) => `
                <li class="objective-item${obj.completed ? ' completed' : ''}" data-objective-id="${obj.id}">
                  <div class="objective-status">${obj.completed ? '✓' : ''}</div>
                  <div class="objective-text">${obj.text}</div>
                </li>
              `
                )
                .join('')}
            </ul>
            <div class="game-log" id="gameLog"></div>
          </aside>
        </div>
        <div class="game-controls">
          <div class="game-controls-left">
            <button type="button" class="game-button-primary" id="btnAdvanceTurn">Avanzar turno</button>
            <button type="button" class="game-button-primary" id="btnToggleObjective">Marcar objetivo</button>
          </div>
          <div class="game-controls-right">
            <button type="button" class="game-button-danger" id="btnFinishGame">Terminar operación</button>
          </div>
        </div>
      `;

      this.bindGameEvents();
    },

    renderMapCells: function renderMapCells() {
      const sectors = [
        { name: 'Plaza de Armas', locationId: 'loc_plaza_armas' },
        { name: 'La Moneda', locationId: 'loc_la_moneda' },
        { name: 'Bellas Artes', locationId: 'loc_bellas_artes' },
        { name: 'Lastarria', locationId: 'loc_lastarria' },
        { name: 'Barrio Brasil', locationId: 'loc_barrio_brasil' },
        { name: 'Estación Central', locationId: 'loc_estacion_central' },
        { name: 'Providencia', locationId: 'loc_providencia' },
        { name: 'Ñuñoa', locationId: 'loc_nunoa' }
      ];

      return sectors
        .map((sector, index) => {
          let extraClass = '';
          if (index === 2) extraClass = ' game-map-cell--current';
          if (index === 5) extraClass = ' game-map-cell--target';
          return `<div class="game-map-cell${extraClass}" data-location-id="${sector.locationId}">${sector.name}</div>`;
        })
        .join('');
    },

    bindGameEvents: function bindGameEvents() {
      const objectivesList = qs('#objectivesList');
      if (objectivesList) {
        objectivesList.addEventListener('click', (event) => {
          const item = event.target.closest('.objective-item');
          if (!item) return;
          const id = Number(item.getAttribute('data-objective-id'));
          this.toggleObjective(id);
        });
      }

      const btnAdvance = qs('#btnAdvanceTurn');
      if (btnAdvance) {
        btnAdvance.addEventListener('click', () => {
          this.advanceTurn();
        });
      }

      const btnToggle = qs('#btnToggleObjective');
      if (btnToggle) {
        btnToggle.addEventListener('click', () => {
          const firstIncomplete = (this.current.objectives || []).find((o) => !o.completed);
          if (firstIncomplete) {
            this.toggleObjective(firstIncomplete.id);
          } else {
            showStatusMessage('Todos los objetivos ya están completados.', 'info');
          }
        });
      }

      const btnFinish = qs('#btnFinishGame');
      if (btnFinish) {
        btnFinish.addEventListener('click', () => {
          this.finishGame('Operación finalizada manualmente.');
        });
      }
    },

    advanceTurn: async function advanceTurn() {
      if (!this.current || !this.current.id) {
        showStatusMessage('No hay una partida activa.', 'error');
        return;
      }

      try {
        // Por ahora usamos una accion generica y una locacion fija; en futuras fases se elegira desde la UI
        const action = await ATLAS.api.performGameAction(this.current.id, {
          actionType: 'analysis',
          locationId: 'loc_estacion_central'
        });

        this.log(
          `Acción de investigación ejecutada. Se consumieron ${Math.floor(
            action.timeConsumed / 60
          )} minutos de tiempo simulado.`
        );

        if (action.clueObtained) {
          this.log(`Pista obtenida: ${action.clueObtained}`);
        }
      } catch (error) {
        console.error('Error ejecutando acción de juego:', error);
        showStatusMessage(error.message || 'No se pudo ejecutar la acción.', 'error');
      }
    },

    toggleObjective: function toggleObjective(id) {
      if (!this.current) return;
      const objective = this.current.objectives.find((o) => o.id === id);
      if (!objective) return;

      objective.completed = !objective.completed;
      this.updateObjectivesUI();
      this.log(`${objective.completed ? 'Completado' : 'Revertido'} objetivo: ${objective.text}`);

      if (this.current.objectives.every((o) => o.completed)) {
        this.finishGame('Todos los objetivos marcados como completados.');
      }
    },

    updateObjectivesUI: function updateObjectivesUI() {
      const list = qs('#objectivesList');
      if (!list) return;

      Array.from(list.children).forEach((li) => {
        const id = Number(li.getAttribute('data-objective-id'));
        const obj = this.current.objectives.find((o) => o.id === id);
        if (!obj) return;
        li.classList.toggle('completed', obj.completed);
        const status = li.querySelector('.objective-status');
        if (status) {
          status.textContent = obj.completed ? '✓' : '';
        }
      });
    },

    startTimer: function startTimer() {
      if (!this.current) return;

      if (this.timerId) {
        clearInterval(this.timerId);
      }

      this.updateTimerUI();

      this.timerId = setInterval(() => {
        if (!this.current) return;

        this.current.remainingSeconds -= 1;
        if (this.current.remainingSeconds <= 0) {
          this.current.remainingSeconds = 0;
          this.updateTimerUI();
          this.finishGame('Tiempo agotado.');
          return;
        }

        this.updateTimerUI();
      }, 1000);
    },

    updateTimerUI: function updateTimerUI() {
      if (!this.current) return;
      const timerValue = qs('#gameTimerValue');
      const timerBox = qs('#gameTimer');
      const alertBadge = qs('#gameAlertBadge');

      const remaining = this.current.remainingSeconds;
      const minutes = String(Math.floor(remaining / 60)).padStart(2, '0');
      const seconds = String(remaining % 60).padStart(2, '0');

      if (timerValue) {
        timerValue.textContent = `${minutes}:${seconds}`;
      }

      if (timerBox) {
        timerBox.classList.toggle('urgent', remaining <= 30);
      }

      if (alertBadge) {
        alertBadge.classList.remove('game-alert-low', 'game-alert-medium', 'game-alert-high');
        let levelClass = 'game-alert-low';
        let label = 'Alerta baja';
        if (remaining <= this.current.totalSeconds / 3) {
          levelClass = 'game-alert-high';
          label = 'Alerta alta';
        } else if (remaining <= (this.current.totalSeconds * 2) / 3) {
          levelClass = 'game-alert-medium';
          label = 'Alerta media';
        }
        alertBadge.classList.add(levelClass);
        alertBadge.textContent = label;
      }
    },

    finishGame: function finishGame(reason) {
      if (this.timerId) {
        clearInterval(this.timerId);
        this.timerId = null;
      }

      this.log(reason);

      const allCompleted = this.current && this.current.objectives.every((o) => o.completed);
      const type = allCompleted ? 'success' : 'info';

      showStatusMessage(reason, type);
    },

    log: function log(message) {
      const logEl = qs('#gameLog');
      if (!logEl) return;

      const entry = document.createElement('div');
      entry.className = 'game-log-entry';
      const now = new Date();
      const time = now.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
      entry.textContent = `[${time}] ${message}`;

      logEl.prepend(entry);
    }
  };

  const UI = {
    initScreens() {
      const app = qs('#app');
      const loginScreen = qs('#loginScreen');
      const loading = qs('#loadingScreen');

      setTimeout(() => {
        if (loading) loading.classList.add('hidden');
      }, 500);

      if (app) app.classList.add('hidden');
      if (loginScreen) loginScreen.classList.remove('hidden');
    },

    initNavigation() {
      const links = qsa('.nav-link');
      links.forEach((link) => {
        link.addEventListener('click', async (event) => {
          event.preventDefault();
          const href = link.getAttribute('href') || '';

          if (href === '#home') {
            switchScreen('homeScreen');
          } else if (href === '#game') {
            switchScreen('difficultyScreen');
          } else if (href === '#leaderboard') {
            showStatusMessage('El ranking se implementará en una fase posterior.', 'info');
          } else if (href === '#profile') {
            showStatusMessage('El perfil de agente se implementará en una fase posterior.', 'info');
          } else if (href === '#logout') {
            await this.handleLogout();
          }
        });
      });
    },

    initHomeActions() {
      const cards = qsa('.action-card');
      cards.forEach((card) => {
        card.addEventListener('click', () => {
          const action = card.getAttribute('data-action');
          if (action === 'new-game') {
            switchScreen('difficultyScreen');
          } else if (action === 'leaderboard') {
            showStatusMessage('El ranking se implementará en una fase posterior.', 'info');
          } else if (action === 'history') {
            showStatusMessage('El historial se implementará en una fase posterior.', 'info');
          }
        });
      });
    },

    initDifficultySelection() {
      const cards = qsa('.difficulty-card');
      cards.forEach((card) => {
        card.addEventListener('click', async () => {
          const difficulty = card.getAttribute('data-difficulty') || 'normal';
          switchScreen('gameScreen');
          await Game.startNewGame(difficulty);
        });
      });
    },

    handleLoginSuccess(user) {
      const app = qs('#app');
      const loginScreen = qs('#loginScreen');
      const agentName = qs('#agentName');

      if (agentName) {
        agentName.textContent = `Agente ${user.displayName || user.username}`;
      }

      if (loginScreen) loginScreen.classList.add('hidden');
      if (app) app.classList.remove('hidden');

      switchScreen('homeScreen');
    },

    async handleLogout() {
      await ATLAS.api.logout();
      const app = qs('#app');
      const loginScreen = qs('#loginScreen');

      if (app) app.classList.add('hidden');
      if (loginScreen) loginScreen.classList.remove('hidden');

      showStatusMessage('Sesión cerrada.', 'info');
    }
  };

  ATLAS.game = Game;
  ATLAS.ui = UI;
})();
