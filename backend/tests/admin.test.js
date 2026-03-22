/**
 * Backend - Admin Routes Tests (FASE 6)
 * Tests para endpoints administrativos usando el contrato actual de autenticacion
 */

const request = require('supertest');
const { app } = require('../server');
const { db } = require('../config/database');

describe('Admin Routes', () => {
  let adminToken;
  let playerToken;
  let testUserId;

  beforeAll(async () => {
    // Crear usuario admin de prueba
    const adminRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        username: 'testadmin_f6',
        email: 'admin_f6@test.com',
        password: 'TestPassword123!',
        passwordConfirm: 'TestPassword123!'
      });

    // Actualizar a admin
    await db.runAsync(
      'UPDATE users SET role = ? WHERE id = ?',
      ['admin', adminRes.body.user.id]
    );

    // Login como admin (usa username + password segun contrato actual)
    const loginAdminRes = await request(app)
      .post('/api/v1/auth/login')
      .send({
        username: 'testadmin_f6',
        password: 'TestPassword123!'
      });

    adminToken = loginAdminRes.body.tokens.accessToken;

    // Crear usuario jugador de prueba
    const playerRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        username: 'testplayer_f6',
        email: 'player_f6@test.com',
        password: 'TestPassword123!',
        passwordConfirm: 'TestPassword123!'
      });

    // Login como jugador
    const loginPlayerRes = await request(app)
      .post('/api/v1/auth/login')
      .send({
        username: 'testplayer_f6',
        password: 'TestPassword123!'
      });

    playerToken = loginPlayerRes.body.tokens.accessToken;
    testUserId = playerRes.body.user.id;
  });

  describe('GET /admin/users', () => {
    test('Debe retornar 401 sin token', async () => {
      const res = await request(app).get('/api/v1/admin/users');
      expect(res.statusCode).toBe(401);
    });

    test('Debe retornar 403 si no es admin', async () => {
      const res = await request(app)
        .get('/api/v1/admin/users')
        .set('Authorization', `Bearer ${playerToken}`);
      expect(res.statusCode).toBe(403);
    });

    test('Debe retornar lista de usuarios si es admin', async () => {
      const res = await request(app)
        .get('/api/v1/admin/users')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.users)).toBe(true);
      expect(res.body.pagination).toBeDefined();
    });

    test('Debe filtrar usuarios por busqueda', async () => {
      const res = await request(app)
        .get('/api/v1/admin/users?search=testplayer_f6')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.users.length).toBeGreaterThanOrEqual(0);
    });

    test('Debe paginar resultados', async () => {
      const res = await request(app)
        .get('/api/v1/admin/users?limit=10&offset=0')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.pagination.limit).toBe(10);
      expect(res.body.pagination.offset).toBe(0);
    });
  });

  describe('GET /admin/users/:id', () => {
    test('Debe retornar detalles del usuario', async () => {
      const res = await request(app)
        .get(`/api/v1/admin/users/${testUserId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.user.id).toBe(testUserId);
      expect(res.body.statistics).toBeDefined();
    });

    test('Debe retornar 404 si usuario no existe', async () => {
      const res = await request(app)
        .get('/api/v1/admin/users/99999')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(404);
    });
  });

  describe('POST /admin/users/:id/ban', () => {
    test('Debe banear usuario', async () => {
      const res = await request(app)
        .post(`/api/v1/admin/users/${testUserId}/ban`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ reason: 'Test ban' });
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });

    test('No puede banear a si mismo', async () => {
      const adminRes = await db.getAsync(
        'SELECT id FROM users WHERE role = ? LIMIT 1',
        ['admin']
      );
      const res = await request(app)
        .post(`/api/v1/admin/users/${adminRes.id}/ban`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ reason: 'Test ban' });
      expect(res.statusCode).toBe(403);
    });
  });

  describe('POST /admin/users/:id/unban', () => {
    test('Debe desbanear usuario', async () => {
      const res = await request(app)
        .post(`/api/v1/admin/users/${testUserId}/unban`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('GET /admin/statistics', () => {
    test('Debe retornar estadisticas del sistema', async () => {
      const res = await request(app)
        .get('/api/v1/admin/statistics')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.statistics).toBeDefined();
      expect(res.body.statistics.totalUsers).toBeDefined();
      expect(res.body.statistics.totalGames).toBeDefined();
    });
  });

  describe('GET /admin/audit-log', () => {
    test('Debe retornar registro de auditoria', async () => {
      const res = await request(app)
        .get('/api/v1/admin/audit-log')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.logs)).toBe(true);
      expect(res.body.pagination).toBeDefined();
    });
  });

  describe('GET /admin/config', () => {
    test('Debe retornar configuracion del sistema', async () => {
      const res = await request(app)
        .get('/api/v1/admin/config')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.config)).toBe(true);
    });
  });

  describe('PUT /admin/config', () => {
    test('Debe actualizar configuracion', async () => {
      const res = await request(app)
        .put('/api/v1/admin/config')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          key: 'game_max_duration_minutes',
          value: '15'
        });
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });

    test('Debe validar que key y value existan', async () => {
      const res = await request(app)
        .put('/api/v1/admin/config')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({});
      expect(res.statusCode).toBe(400);
    });
  });

  afterAll(async () => {
    // Limpiar datos de prueba
    await db.runAsync('DELETE FROM users WHERE email LIKE ?', ['%_f6@test.com']);
  });
});
