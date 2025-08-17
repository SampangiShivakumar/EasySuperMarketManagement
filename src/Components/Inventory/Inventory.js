import React, { useState, useEffect } from 'react';
import { FaBoxes, FaPlus } from 'react-icons/fa';
import Navbar from '../../NavBar/Navbar1';
import './Inventory.css'; // Ensure you have some CSS for styling

const Inventory = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Example fetch — update the URL to your backend API
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error('Failed to fetch products:', err));
  }, []);

  const handleAddProduct = () => {
    // Logic to open a modal or navigate to add-product page
    alert('Redirect to Add Product Page');
  };

  return (
    <div className="inventory-container">
      <Navbar />
      <div className="inventory-content">
        <div className="component-header">
          <h2><FaBoxes /> Inventory Management</h2>
          <button className="add-button" onClick={handleAddProduct}>
            <FaPlus /> Add Product
          </button>
        </div>

        <div className="inventory-grid">
          {products.length === 0 ? (
            <p className="empty-message">No products found.</p>
          ) : (
            products.map((product) => (
              <div key={product._id} className="product-card">
                <h3>{product.name}</h3>
                <p>Category: {product.category}</p>
                <p>Price: ₹{product.price}</p>
                <p>Stock: {product.quantity}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Inventory;
