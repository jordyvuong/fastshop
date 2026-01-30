import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function App() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [productsRes, ordersRes] = await Promise.all([
          axios.get(`${API_URL}/api/products`),
          axios.get(`${API_URL}/api/orders`)
        ]);

        setProducts(productsRes.data);
        setOrders(ordersRes.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="app">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <h1>🛒 FastShop</h1>
        <p>E-Commerce Microservices Platform</p>
      </header>

      <main className="main">
        <section className="section">
          <h2>📦 Products</h2>
          <div className="grid">
            {products.length === 0 ? (
              <p>No products available</p>
            ) : (
              products.map(product => (
                <div key={product.id} className="card">
                  <h3>{product.name}</h3>
                  <p className="description">{product.description}</p>
                  <p className="price">${product.price.toFixed(2)}</p>
                  <p className="stock">Stock: {product.stock}</p>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="section">
          <h2>📋 Orders</h2>
          <div className="grid">
            {orders.length === 0 ? (
              <p>No orders yet</p>
            ) : (
              orders.map(order => (
                <div key={order.id} className="card">
                  <h3>Order #{order.id}</h3>
                  <p>Product ID: {order.productId}</p>
                  <p>Quantity: {order.quantity}</p>
                  <p className="price">Total: ${order.totalPrice.toFixed(2)}</p>
                  <p className="status">Status: {order.status}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
