import React, { useEffect, useState } from 'react';
import api from './api';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    api.get('/products/')
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch products. Check if Django server is running.');
        setLoading(false);
        console.error(err);
      });
  }, []);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  // Unique categories list (dropdown కోసం)
  const categories = ['All', ...new Set(products.map((p) => p.category_name))];

  // Search + Category ఆధారంగా filter చేయడం
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category_name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="card">
      <h2>Product Catalog</h2>

      {/* Search + Filter Controls */}
      <div style={{
        display: 'flex',
        gap: '15px',
        marginBottom: '20px',
        flexWrap: 'wrap',
      }}>
        <input
          type="text"
          placeholder="🔍 Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: '1',
            minWidth: '200px',
            padding: '10px 15px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            fontSize: '14px',
          }}
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            padding: '10px 15px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            fontSize: '14px',
            background: 'white',
          }}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Results Count */}
      <p style={{ color: '#888', fontSize: '14px' }}>
        {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
      </p>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <p style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
          No products match your search.
        </p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '20px',
          marginTop: '20px',
        }}>
          {filteredProducts.map((product) => (
            <div key={product.id} style={{
              border: '1px solid #eee',
              borderRadius: '10px',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              background: 'white',
            }}>
              <div style={{
                height: '180px',
                width: '100%',
                background: '#f4f6f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}>
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                      display: 'block',
                    }}
                  />
                ) : (
                  <span style={{ fontSize: '40px' }}>📦</span>
                )}
              </div>
              <div style={{ padding: '15px' }}>
                <h4 style={{ margin: '0 0 8px 0' }}>{product.name}</h4>
                <span style={{
                  fontSize: '12px',
                  background: '#e8f0fe',
                  color: '#4C72B0',
                  padding: '3px 8px',
                  borderRadius: '10px',
                }}>
                  {product.category_name}
                </span>
                <p style={{ fontSize: '20px', fontWeight: 'bold', margin: '10px 0 5px 0', color: '#2c3e50' }}>
                  ₹{product.price}
                </p>
                <p style={{ fontSize: '13px', color: product.stock > 0 ? '#55A868' : '#C44E52', margin: 0 }}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;