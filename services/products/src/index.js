import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());

// Base de données simulée
let products = [
  { id: 1, name: 'MacBook Pro', price: 2499, category: 'Informatique', stock: 15 },
  { id: 2, name: 'iPhone 15 Pro', price: 1299, category: 'Téléphonie', stock: 30 },
  { id: 3, name: 'AirPods Pro', price: 279, category: 'Audio', stock: 50 },
  { id: 4, name: 'iPad Air', price: 699, category: 'Tablettes', stock: 20 },
  { id: 5, name: 'Apple Watch', price: 449, category: 'Accessoires', stock: 40 },
];

// Middleware de logging
app.use((req, res, next) => {
  console.log(`[Products Service] ${req.method} ${req.url}`);
  next();
});

// Routes
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'Products Service',
    timestamp: new Date().toISOString()
  });
});

// GET tous les produits
app.get('/products', (req, res) => {
  const { category, minPrice, maxPrice } = req.query;
  
  let filtered = [...products];

  if (category) {
    filtered = filtered.filter(p => 
      p.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (minPrice) {
    filtered = filtered.filter(p => p.price >= parseFloat(minPrice));
  }

  if (maxPrice) {
    filtered = filtered.filter(p => p.price <= parseFloat(maxPrice));
  }

  res.json(filtered);
});

// GET un produit par ID
app.get('/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ error: 'Produit non trouvé' });
  }
  res.json(product);
});

// POST créer un produit
app.post('/products', (req, res) => {
  const { name, price, category, stock } = req.body;
  
  if (!name || !price || !category) {
    return res.status(400).json({ 
      error: 'Nom, prix et catégorie requis' 
    });
  }

  const newProduct = {
    id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
    name,
    price: parseFloat(price),
    category,
    stock: stock || 0,
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

// PUT mettre à jour un produit
app.put('/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const productIndex = products.findIndex(p => p.id === productId);

  if (productIndex === -1) {
    return res.status(404).json({ error: 'Produit non trouvé' });
  }

  products[productIndex] = { 
    ...products[productIndex], 
    ...req.body, 
    id: productId 
  };
  res.json(products[productIndex]);
});

// DELETE supprimer un produit
app.delete('/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const productIndex = products.findIndex(p => p.id === productId);

  if (productIndex === -1) {
    return res.status(404).json({ error: 'Produit non trouvé' });
  }

  products.splice(productIndex, 1);
  res.status(204).send();
});

// GET catégories disponibles
app.get('/products/categories/list', (req, res) => {
  const categories = [...new Set(products.map(p => p.category))];
  res.json(categories);
});

// Gestion des erreurs
app.use((error, req, res, next) => {
  console.error('Erreur:', error);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

app.listen(PORT, () => {
  console.log(`📦 Service Products démarré sur le port ${PORT}`);
});
