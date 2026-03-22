/**
 * Backend - Game Routes Tests (FASE 6)
 * Pruebas basicas para inicio de partidas y acciones de investigacion
 */

const request = require('supertest');
const { app } = require('../server');

describe('Game Routes', () => {
  let accessToken;
  let gameId;

  const username = `game_tester_${Date.now()}`;
  const email = `game_tester_${Date.now()}@test.com`;
  const password = 'TestPassword123!';

  beforeAll(async () => {
    // Registrar y loguear usuario de prueba
    const registerRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        username,
        email,
        password,
        passwordConfirm: password
      });

    expect(registerRes.statusCode).toBe(201);

    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ username, password });

    expect(loginRes.statusCode).toBe(200);
    accessToken = loginRes.body.tokens.accessToken;
  });

  test('Debe iniciar una nueva partida con dificultad valida', async () => {
    const res = await request(app)
      .post('/api/v1/games/start')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ difficulty: 'easy' });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.game).toBeDefined();
    expect(res.body.game.gameId).toBeDefined();

    gameId = res.body.game.gameId;
  });

  test('Debe ejecutar una accion de investigacion en la partida', async () => {
    const res = await request(app)
      .post(`/api/v1/games/${gameId}/action`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        actionType: 'analysis',
        locationId: 'loc_plaza_armas'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.action).toBeDefined();
    expect(res.body.action.actionType).toBe('analysis');
    expect(res.body.action.timeConsumed).toBeGreaterThan(0);
  });
});
