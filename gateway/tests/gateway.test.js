const request = require('supertest');
const app = require('../src/index');

describe('API Gateway', () => {
  describe('GET /health', () => {
    it('should return health status', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.service).toBe('api-gateway');
    });
  });
});
