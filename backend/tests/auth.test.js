/**
 * Backend - Auth Routes Tests (FASE 6)
 * Pruebas basicas de registro y login de usuarios
 */

const request = require('supertest');
const { app } = require('../server');

describe('Auth Routes', () => {
  const baseUsername = `auth_tester_${Date.now()}`;
  const baseEmail = `auth_tester_${Date.now()}@test.com`;
  const password = 'TestPassword123!';

  test('Debe registrar un nuevo usuario con credenciales validas', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        username: baseUsername,
        email: baseEmail,
        password,
        passwordConfirm: password
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.user).toBeDefined();
    expect(res.body.tokens).toBeDefined();
    expect(res.body.tokens.accessToken).toBeDefined();
  });

  test('Debe rechazar registro si faltan campos', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ username: 'incomplete_user' });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('Debe permitir login con username y password correctos', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        username: baseUsername,
        password
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user).toBeDefined();
    expect(res.body.tokens).toBeDefined();
    expect(res.body.tokens.accessToken).toBeDefined();
  });
});
