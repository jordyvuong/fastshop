const request = require('supertest');
const { PrismaClient } = require('@prisma/client');

// Set test environment
process.env.NODE_ENV = 'test';

const app = require('../src/index');
const prisma = new PrismaClient();

describe('Order Service', () => {
  afterAll(async () => {
    // Close Prisma connection
    await prisma.$disconnect();
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.service).toBe('order-service');
    });
  });

  describe('GET /orders', () => {
    it('should return an array of orders', async () => {
      const res = await request(app).get('/orders');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });
});
