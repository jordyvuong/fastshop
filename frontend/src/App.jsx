import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [products, setProducts] = useState([])
  const [users, setUsers] = useState([])

  useEffect(() => {
    // Récupération des produits via le gateway
    axios.get('/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Erreur produits:', err))

    // Récupération des utilisateurs via le gateway
    axios.get('/api/users')
      .then(res => setUsers(res.data))
      .catch(err => console.error('Erreur utilisateurs:', err))
  }, [])

  return (
    <div className="app">
      <header className="header">
        <h1>🛒 FastShop</h1>
        <p>Architecture Microservices - Mono-repo</p>
      </header>

      <main className="main">
        <section className="section">
          <h2>Produits</h2>
          <div className="grid">
            {products.map(product => (
              <div key={product.id} className="card">
                <h3>{product.name}</h3>
                <p>{product.price} €</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <h2>Utilisateurs</h2>
          <div className="grid">
            {users.map(user => (
              <div key={user.id} className="card">
                <h3>{user.name}</h3>
                <p>{user.email}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
