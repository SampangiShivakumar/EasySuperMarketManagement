import React from 'react';
import { FaChartBar } from 'react-icons/fa';
import Navbar from '../../NavBar/Navbar1';

const Reports = () => {
  return (
    <div className="reports-container">
      <Navbar />
      <div className="reports-content">
        <div className="component-header">
          <h2><FaChartBar /> Business Reports</h2>
        </div>
        <div className="reports-content">
          {/* Reports and analytics will go here */}
        </div>
      </div>
    </div>
  );
};

export default Reports;
