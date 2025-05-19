import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';
import '../Login/Login.css';
import { storeCredentials } from '../../services/AuthService';

const Signup = () => {
  const [userData, setUserData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!userData.username || !userData.password || !userData.email) {
        setError('All fields are required');
        return;
      }
      if (userData.password !== userData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      
      const user = await storeCredentials(userData);
      navigate('/login', { replace: true });
    } catch (err) {
      setError(err.message || 'An error occurred during signup');
      console.error('Signup error:', err);
    }
  };

  const handleGoogleSignup = () => {
    // Implement Google OAuth here
    // For demo, we'll just show an alert
    alert('Google Sign up will be implemented here');
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Create New Account</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={userData.username}
            onChange={(e) => setUserData({...userData, username: e.target.value})}
          />
          <input
            type="email"
            placeholder="Email"
            value={userData.email}
            onChange={(e) => setUserData({...userData, email: e.target.value})}
          />
          <input
            type="password"
            placeholder="Password"
            value={userData.password}
            onChange={(e) => setUserData({...userData, password: e.target.value})}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={userData.confirmPassword}
            onChange={(e) => setUserData({...userData, confirmPassword: e.target.value})}
          />
          <button type="submit">Create Account</button>
          <div className="divider">
            <span>OR</span>
          </div>
          <button 
            type="button" 
            className="google-btn"
            onClick={handleGoogleSignup}
          >
            <img src="/google-icon.png" alt="Google" />
            Sign up with Google
          </button>
          <div className="login-link">
            Already have an account? <span onClick={() => navigate('/login')}>Login</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
