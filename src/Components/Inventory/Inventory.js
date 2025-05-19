import React, { useState } from 'react';
import { FaBoxes, FaPlus } from 'react-icons/fa';
import Navbar from '../../NavBar/Navbar1';

const Inventory = () => {
  const [products, setProducts] = useState([]);

  return (
    <div className="inventory-container">
      <Navbar />
      <div className="inventory-content">
        <div className="component-header">
          <h2><FaBoxes /> Inventory Management</h2>
          <button className="add-button"><FaPlus /> Add Product</button>
        </div>
        <div className="inventory-grid">
          {/* Product list will go here */}
        </div>
      </div>
    </div>
  );
};

export default Inventory;
