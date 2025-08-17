import './About.css';
import React from 'react';
import Navbar from '../../NavBar/Navbar1';
const About = () => {
  return (
    <div className="about-container">
      <div className="about-content">
        <h2>About EasyManager</h2>

        <p>
          <strong>EasyManager</strong> is a powerful and intuitive supermarket management system
          designed to simplify day-to-day operations for business owners. From inventory tracking
          to sales analysis, this platform offers a full suite of features to help streamline store
          management and improve productivity.
        </p>

        <h3>🔍 Key Features</h3>

        <div className="feature-section">
          <h4>🛒 Product Management</h4>
          <p>
            Add, edit, or remove products from your inventory with ease. View stock levels and
            detailed product information in a user-friendly format.
          </p>
        </div>

        <div className="feature-section">
          <h4>💰 Sales Tracking</h4>
          <p>
            Automatically record daily, weekly, and monthly sales. Easily view trends and analyze
            profits with detailed reports.
          </p>
        </div>

        <div className="feature-section">
          <h4>📊 Dashboard & Analytics</h4>
          <p>
            Get real-time insights into store performance, inventory status, and transaction
            history through a clean and interactive dashboard.
          </p>
        </div>

        <div className="feature-section">
          <h4>👥 Employee Management</h4>
          <p>
            Maintain records of employee roles, attendance, and responsibilities. Assign specific
            access levels based on job functions.
          </p>
        </div>

        <div className="feature-section">
          <h4>⚙️ Settings & Configuration</h4>
          <p>
            Customize your preferences including store name, location, business type, and user
            profile with complete control over your environment.
          </p>
        </div>

        <h3>🚀 Our Mission</h3>
        <p>
          At EasyManager, our mission is to empower small and medium-sized businesses with
          technology that improves efficiency and enables smarter decision-making. We aim to
          eliminate manual errors and bring clarity to your store operations.
        </p>

        <h3>🛠 Tech Stack</h3>
        <p>
          EasyManager is built using the MERN stack (MongoDB, Express.js, React.js, Node.js),
          ensuring scalability, speed, and modern UI/UX design principles.
        </p>
      </div>
    </div>
  );
};

export default About;
