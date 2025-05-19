import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from 'antd';
import { 
    UserOutlined,
    PhoneOutlined,
    InfoCircleOutlined,
    TeamOutlined,
    DashboardOutlined
} from '@ant-design/icons';
import './Navbar1.css';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <div className="navbar">
      <div 
        className="navbar-brand" 
        onClick={() => navigate('/home')}
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
      >
        <img 
          src="/manager.jpg" 
          alt="Manager Logo" 
          style={{ 
            height: '45px', 
            width: '45px', 
            marginRight: '12px', 
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            objectFit: 'cover'
          }} 
        />
        <span style={{ 
          fontSize: '1.5rem', 
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          SuperManager
        </span>
      </div>
      <div className="navbar-links">
      <Button 
          className="nav-button team-button"
          onClick={() => navigate('/dashboard')}
          icon={<DashboardOutlined />}
        >
          Dashboard
        </Button>
       
        <Button 
          className="nav-button contact-button"
          onClick={() => navigate('/contact')}
          icon={<PhoneOutlined />}
        >
          Contact
        </Button>
        <Button 
          className="nav-button about-button"
          onClick={() => navigate('/about')}
          icon={<InfoCircleOutlined />}
        >
          About
        </Button>
        <Button 
          className="nav-button team-button"
          onClick={() => navigate('/team')}
          icon={<TeamOutlined />}
        >
          Team
        </Button>
        
      </div>
      <div className="navbar-auth">
        <Button 
          className="auth-button login-button" 
          onClick={() => navigate('/Profile')}
          icon={<UserOutlined />}
        
        >
        Profile
        </Button>
      </div>
    </div>
  );
};

export default Navbar;
