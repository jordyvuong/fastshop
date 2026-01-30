const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'api-gateway' });
});

app.use('/api/products', createProxyMiddleware({
  target: process.env.PRODUCT_SERVICE_URL || 'http://localhost:3001',
  changeOrigin: true,
  pathRewrite: {
    '^/api/products': '/products'
  },
  onError: (err, req, res) => {
    console.error('Product Service proxy error:', err);
    res.status(503).json({ error: 'Product service unavailable' });
  }
}));

app.use('/api/orders', createProxyMiddleware({
  target: process.env.ORDER_SERVICE_URL || 'http://localhost:3002',
  changeOrigin: true,
  pathRewrite: {
    '^/api/orders': '/orders'
  },
  onError: (err, req, res) => {
    console.error('Order Service proxy error:', err);
    res.status(503).json({ error: 'Order service unavailable' });
  }
}));

app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const server = app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  server.close(() => {
    process.exit(0);
  });
});

module.exports = app;
