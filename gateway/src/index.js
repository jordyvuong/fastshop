import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Configuration des services
const SERVICES = {
  users: process.env.USERS_SERVICE_URL || 'http://localhost:5001',
  products: process.env.PRODUCTS_SERVICE_URL || 'http://localhost:5002',
};

// Middlewares de sécurité
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limite de 100 requêtes par fenêtre
  message: 'Trop de requêtes, veuillez réessayer plus tard.'
});
app.use(limiter);

// Middleware de logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Route de santé
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'API Gateway',
    timestamp: new Date().toISOString()
  });
});

// Proxy vers le service Users
app.all('/api/users*', async (req, res) => {
  try {
    const path = req.url.replace('/api/users', '');
    const response = await axios({
      method: req.method,
      url: `${SERVICES.users}/users${path}`,
      data: req.body,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Erreur service Users:', error.message);
    res.status(error.response?.status || 500).json({
      error: 'Erreur lors de la communication avec le service Users',
      details: error.message
    });
  }
});

// Proxy vers le service Products
app.all('/api/products*', async (req, res) => {
  try {
    const path = req.url.replace('/api/products', '');
    const response = await axios({
      method: req.method,
      url: `${SERVICES.products}/products${path}`,
      data: req.body,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Erreur service Products:', error.message);
    res.status(error.response?.status || 500).json({
      error: 'Erreur lors de la communication avec le service Products',
      details: error.message
    });
  }
});

// Route 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Gestion des erreurs globales
app.use((error, req, res, next) => {
  console.error('Erreur:', error);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

app.listen(PORT, () => {
  console.log(`🚪 API Gateway démarré sur le port ${PORT}`);
  console.log(`📡 Services configurés:`);
  console.log(`   - Users: ${SERVICES.users}`);
  console.log(`   - Products: ${SERVICES.products}`);
});
