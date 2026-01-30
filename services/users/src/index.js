import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Base de données simulée
let users = [
  { id: 1, name: 'Alice Dupont', email: 'alice@fastshop.com', role: 'admin' },
  { id: 2, name: 'Bob Martin', email: 'bob@fastshop.com', role: 'client' },
  { id: 3, name: 'Charlie Durand', email: 'charlie@fastshop.com', role: 'client' },
];

// Middleware de logging
app.use((req, res, next) => {
  console.log(`[Users Service] ${req.method} ${req.url}`);
  next();
});

// Routes
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'Users Service',
    timestamp: new Date().toISOString()
  });
});

// GET tous les utilisateurs
app.get('/users', (req, res) => {
  res.json(users);
});

// GET un utilisateur par ID
app.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ error: 'Utilisateur non trouvé' });
  }
  res.json(user);
});

// POST créer un utilisateur
app.post('/users', (req, res) => {
  const { name, email, role } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: 'Nom et email requis' });
  }

  const newUser = {
    id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
    name,
    email,
    role: role || 'client',
  };

  users.push(newUser);
  res.status(201).json(newUser);
});

// PUT mettre à jour un utilisateur
app.put('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'Utilisateur non trouvé' });
  }

  users[userIndex] = { ...users[userIndex], ...req.body, id: userId };
  res.json(users[userIndex]);
});

// DELETE supprimer un utilisateur
app.delete('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'Utilisateur non trouvé' });
  }

  users.splice(userIndex, 1);
  res.status(204).send();
});

// Gestion des erreurs
app.use((error, req, res, next) => {
  console.error('Erreur:', error);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

app.listen(PORT, () => {
  console.log(`👥 Service Users démarré sur le port ${PORT}`);
});
