import React from 'react';
import { 
  ShoppingCartOutlined, 
  BarChartOutlined, 
  TeamOutlined, 
  FileTextOutlined,
  DollarOutlined,
  SettingOutlined 
} from '@ant-design/icons';
import Navbar from '../NavBar/Navbar';
import './Home.css';

const Home = () => {
  return (
    <div>
      <div
        className="home-container"
        style={{ backgroundImage: `url('/homepage.avif')`, backgroundSize: 'cover', backgroundPosition: 'center', color: 'white', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', textShadow: '3px 3px 6px rgba(0, 0, 0, 0.8)', color: '#f8f9fa', padding: '0 20px', lineHeight: '1.5' }}>
          Efficiency in every transaction,<br /> clarity in every record —<br /> where Quick Mart Management meets seamless shopping.
        </h1>
      </div>
      <Navbar />
      <div className="features-section">
        <h2>Our Features</h2>
        <div className="features-grid">
          <div className="feature-box">
            <div className="feature-icon">
              <ShoppingCartOutlined />
            </div>
            <h3 className="feature-title">Inventory Management</h3>
            <p className="feature-description">
              Track your stock in real-time with advanced inventory management tools
            </p>
          </div>
          
          <div className="feature-box">
            <div className="feature-icon">
              <BarChartOutlined />
            </div>
            <h3 className="feature-title">Sales Tracking</h3>
            <p className="feature-description">
              Monitor sales performance with detailed analytics and insights
            </p>
          </div>
          
          <div className="feature-box">
            <div className="feature-icon">
              <TeamOutlined />
            </div>
            <h3 className="feature-title">Employee Management</h3>
            <p className="feature-description">
              Efficiently manage staff schedules, roles, and responsibilities
            </p>
          </div>
          
          <div className="feature-box">
            <div className="feature-icon">
              <FileTextOutlined />
            </div>
            <h3 className="feature-title">Comprehensive Reports</h3>
            <p className="feature-description">
              Generate detailed reports for better business decisions
            </p>
          </div>
          
          <div className="feature-box">
            <div className="feature-icon">
              <DollarOutlined />
            </div>
            <h3 className="feature-title">Billing System</h3>
            <p className="feature-description">
              Streamline your billing process with our integrated system
            </p>
          </div>
          
          <div className="feature-box">
            <div className="feature-icon">
              <SettingOutlined />
            </div>
            <h3 className="feature-title">Customizable Settings</h3>
            <p className="feature-description">
              Tailor the system to meet your specific business needs
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;