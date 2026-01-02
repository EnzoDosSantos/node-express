import { createApp } from '../../src/app';
import request from 'supertest';
import { Application } from 'express';

describe('API Integration Tests', () => {
  let app: Application;

  beforeAll(() => {
    app = createApp();
  });

  describe('Health Check', () => {
    it('GET /api/health should return status ok', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body.status).toBe('ok');
      expect(response.body.timestamp).toBeDefined();
      expect(response.body.uptime).toBeDefined();
    });
  });

  describe('Root Endpoint', () => {
    it('GET / should return API information', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.body.message).toContain('API de Chistes');
      expect(response.body.version).toBe('1.0.0');
      expect(response.body.endpoints).toBeDefined();
    });
  });

  describe('Math Endpoints', () => {
    describe('GET /api/math/lcm', () => {
      it('should calculate LCM correctly', async () => {
        const response = await request(app)
          .get('/api/math/lcm?numbers=4,6')
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.numbers).toEqual([4, 6]);
        expect(response.body.data.lcm).toBe(12);
      });

      it('should handle multiple numbers', async () => {
        const response = await request(app)
          .get('/api/math/lcm?numbers=2,3,4,5')
          .expect(200);

        expect(response.body.data.lcm).toBe(60);
      });

      it('should return error if numbers are missing', async () => {
        const response = await request(app)
          .get('/api/math/lcm')
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.error.message).toContain('numbers');
      });

      it('should return error for invalid numbers', async () => {
        const response = await request(app)
          .get('/api/math/lcm?numbers=a,b,c')
          .expect(400);

        expect(response.body.success).toBe(false);
      });
    });

    describe('GET /api/math/increment', () => {
      it('should increment number correctly', async () => {
        const response = await request(app)
          .get('/api/math/increment?number=5')
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.original).toBe(5);
        expect(response.body.data.result).toBe(6);
      });

      it('should handle negative numbers', async () => {
        const response = await request(app)
          .get('/api/math/increment?number=-1')
          .expect(200);

        expect(response.body.data.result).toBe(0);
      });

      it('should return error if number is missing', async () => {
        const response = await request(app)
          .get('/api/math/increment')
          .expect(400);

        expect(response.body.success).toBe(false);
      });
    });
  });

  describe('Jokes Endpoints - Validation', () => {
    describe('GET /api/chistes/:source', () => {
      it('should return error for invalid source', async () => {
        const response = await request(app)
          .get('/api/chistes/Invalid')
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.error.message).toContain('inválida');
      });
    });

    describe('POST /api/chistes', () => {
      it('should return error if text is missing', async () => {
        const response = await request(app)
          .post('/api/chistes')
          .send({})
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.error.message).toContain('text');
      });
    });

    describe('PUT /api/chistes/:number', () => {
      it('should return error for invalid ID', async () => {
        const response = await request(app)
          .put('/api/chistes/abc')
          .send({ text: 'New text' })
          .expect(400);

        expect(response.body.success).toBe(false);
      });

      it('should return error if text is missing', async () => {
        const response = await request(app)
          .put('/api/chistes/1')
          .send({})
          .expect(400);

        expect(response.body.success).toBe(false);
      });
    });

    describe('DELETE /api/chistes/:number', () => {
      it('should return error for invalid ID', async () => {
        const response = await request(app)
          .delete('/api/chistes/abc')
          .expect(400);

        expect(response.body.success).toBe(false);
      });
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/api/non-existent-route')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.statusCode).toBe(404);
    });
  });
});
