import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, message, Divider } from 'antd';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import './Login.css';
import { verifyCredentials } from '../../services/AuthService';

/**
 * @typedef {Object} LoginState
 * @property {string} email
 * @property {string} password
 * @property {string} [error]
 */

/**
 * Login component for user authentication
 * @returns {React.ReactElement}
 */
const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const user = await verifyCredentials(values.username, values.password);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('currentUser', JSON.stringify(user));
      message.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      message.error(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <h1>Login to Quick Mart Manager</h1>
        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Log in
            </Button>
          </Form.Item>
        </Form>

        <Divider>Or</Divider>

        <div className="google-login-container">
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              console.log('Google Sign-In Success:', credentialResponse);
              try {
                const decoded = jwtDecode(credentialResponse.credential);
                console.log('Decoded token:', decoded);
                
                // Store the basic user info
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('currentUser', JSON.stringify({
                  email: decoded.email,
                  name: decoded.name,
                  picture: decoded.picture
                }));
                
                message.success('Google login successful!');
                navigate('/dashboard');
              } catch (error) {
                console.error('Error processing Google sign-in:', error);
                message.error('Failed to process Google sign-in');
              }
            }}
            onError={(error) => {
              console.error('Google Sign-In Error:', error);
              message.error('Google sign-in failed. Please try again.');
            }}
            type="standard"
            theme="filled_blue"
            size="large"
            text="signin_with"
            shape="rectangular"
            locale="en"
            useOneTap={false}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
