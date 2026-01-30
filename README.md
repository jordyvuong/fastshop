# FastShop - Architecture Microservices

> 🛒 Application e-commerce en architecture microservices avec mono-repo

## 📁 Structure du projet

```
FastShop/
├── package.json              # Configuration du mono-repo (workspaces)
├── frontend/                 # Application React (Vite)
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
├── gateway/                  # API Gateway (Express)
│   ├── src/
│   │   └── index.js
│   └── package.json
└── services/                 # Microservices
    ├── users/               # Service de gestion des utilisateurs
    │   ├── src/
    │   │   └── index.js
    │   └── package.json
    └── products/            # Service de gestion des produits
        ├── src/
        │   └── index.js
        └── package.json
```

## 🚀 Technologies utilisées

### Frontend
- **React** 19.0.0 (dernière version)
- **Vite** 6.0.7
- **React Router DOM** 7.1.1
- **Axios** pour les requêtes HTTP

### Backend
- **Node.js** (dernière version)
- **Express** 5.2.1 (dernière version)
- **CORS** pour la gestion des requêtes cross-origin
- **Helmet** pour la sécurité
- **Rate Limiting** pour limiter les requêtes
- **Dotenv** pour les variables d'environnement

## 🔧 Installation

### Installation de toutes les dépendances

```bash
npm install
```

Cette commande installera automatiquement les dépendances de tous les workspaces (frontend, gateway, et services).

## 🎯 Démarrage du projet

### Démarrer tous les services en développement

```bash
npm run dev
```

Cette commande démarre simultanément :
- Frontend sur `http://localhost:3000`
- Gateway sur `http://localhost:4000`
- Service Users sur `http://localhost:5001`
- Service Products sur `http://localhost:5002`

### Démarrer individuellement

```bash
# Frontend uniquement
npm run dev:frontend

# Gateway uniquement
npm run dev:gateway

# Services uniquement
npm run dev:services
```

## 📡 Architecture

### Frontend (Port 3000)
- Interface utilisateur React
- Communique avec le backend via le Gateway (`/api/*`)
- Proxy configuré dans Vite pour rediriger vers le Gateway

### API Gateway (Port 4000)
- Point d'entrée unique pour toutes les requêtes API
- Route les requêtes vers les microservices appropriés
- Gestion de la sécurité (Helmet, Rate Limiting)
- Endpoints :
  - `/api/users/*` → Service Users
  - `/api/products/*` → Service Products
  - `/health` → État du gateway

### Service Users (Port 5001)
- Gestion des utilisateurs
- Endpoints disponibles :
  - `GET /users` - Liste tous les utilisateurs
  - `GET /users/:id` - Récupère un utilisateur
  - `POST /users` - Crée un utilisateur
  - `PUT /users/:id` - Met à jour un utilisateur
  - `DELETE /users/:id` - Supprime un utilisateur

### Service Products (Port 5002)
- Gestion des produits
- Endpoints disponibles :
  - `GET /products` - Liste tous les produits (filtres disponibles)
  - `GET /products/:id` - Récupère un produit
  - `POST /products` - Crée un produit
  - `PUT /products/:id` - Met à jour un produit
  - `DELETE /products/:id` - Supprime un produit
  - `GET /products/categories/list` - Liste les catégories

## 🧪 Tests

Les requêtes peuvent être testées via :
- L'interface React sur `http://localhost:3000`
- Directement via le Gateway sur `http://localhost:4000/api/*`
- Outils comme Postman, Insomnia, ou curl

### Exemples de requêtes

```bash
# Via le Gateway
curl http://localhost:4000/api/users
curl http://localhost:4000/api/products

# Directement sur les services
curl http://localhost:5001/users
curl http://localhost:5002/products
```

## 🔐 Variables d'environnement

Chaque service possède son fichier `.env` :

### Gateway (.env)
```env
PORT=4000
USERS_SERVICE_URL=http://localhost:5001
PRODUCTS_SERVICE_URL=http://localhost:5002
```

### Service Users (.env)
```env
PORT=5001
```

### Service Products (.env)
```env
PORT=5002
```

## 📦 Scripts disponibles

```bash
npm install              # Installe toutes les dépendances
npm run dev              # Démarre tous les services en dev
npm run dev:frontend     # Démarre uniquement le frontend
npm run dev:gateway      # Démarre uniquement le gateway
npm run dev:services     # Démarre uniquement les microservices
npm run build:frontend   # Build le frontend pour la production
```

## 🏗️ Avantages de cette architecture

1. **Séparation des préoccupations** : Chaque service a une responsabilité unique
2. **Scalabilité** : Les services peuvent être mis à l'échelle indépendamment
3. **Maintenabilité** : Code organisé et facile à maintenir
4. **Mono-repo** : Gestion centralisée des dépendances avec npm workspaces
5. **Sécurité** : Gateway avec Helmet et Rate Limiting
6. **Performance** : Communication optimisée entre services

## 📝 Prochaines étapes

- [ ] Ajouter une base de données (MongoDB, PostgreSQL)
- [ ] Implémenter l'authentification JWT
- [ ] Ajouter des tests unitaires et d'intégration
- [ ] Mettre en place Docker pour la containerisation
- [ ] Configurer CI/CD
- [ ] Ajouter de la documentation API (Swagger)

## 👥 Auteur

Projet FastShop - Architecture Microservices

## 📄 Licence

ISC
