const request = require('supertest');
const app = require('../src/index');

describe('Product Service', () => {
  describe('GET /health', () => {
    it('should return health status', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.service).toBe('product-service');
    });
  });

  describe('GET /products', () => {
    it('should return an array of products', async () => {
      const res = await request(app).get('/products');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });
});
