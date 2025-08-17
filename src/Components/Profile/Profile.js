import React, { useState, useEffect } from 'react';
import { Card, Avatar, Button, Form, Input, message } from 'antd';
import { UserOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../NavBar/Navbar1';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      const parsedUser = JSON.parse(user);
      setUserData(parsedUser);
      form.setFieldsValue(parsedUser);
    } else {
      message.error('No user data found');
      navigate('/login');
    }
  }, [form, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  const handleSave = async (values) => {
    try {
      const updatedUser = { ...userData, ...values };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      setUserData(updatedUser);
      setIsEditing(false);
      message.success('Profile updated successfully!');
    } catch (error) {
      message.error('Failed to update profile');
    }
  };

  if (!userData) {
    return null;
  }

  return (
    <div className="profile-container">
      <Navbar />
      <div className="profile-content">
        <Card className="profile-card">
          <div className="profile-header">
            <Avatar size={100} icon={<UserOutlined />} />
            <h2>{userData.username}</h2>
          </div>
          
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSave}
            className="profile-form"
            initialValues={userData}
          >
            <Form.Item
              name="username"
              label="Username"
              rules={[{ required: true, message: 'Username is required' }]}
            >
              <Input disabled={!isEditing} />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Email is required' },
                { type: 'email', message: 'Please enter a valid email' }
              ]}
            >
              <Input disabled={!isEditing} />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Phone Number"
              rules={[
                { required: true, message: 'Phone number is required' },
                { pattern: /^[0-9-+()]{10,}$/, message: 'Please enter a valid phone number' }
              ]}
            >
              <Input disabled={!isEditing} />
            </Form.Item>

            <Form.Item
              name="shopAddress"
              label="Shop Address"
              rules={[{ required: true, message: 'Shop address is required' }]}
            >
              <Input.TextArea 
                disabled={!isEditing}
                rows={3}
                placeholder="Enter your shop address"
              />
            </Form.Item>

            <div className="profile-actions">
              {isEditing ? (
                <>
                  <Button 
                    type="primary" 
                    icon={<SaveOutlined />}
                    htmlType="submit"
                  >
                    Save Changes
                  </Button>
                  <Button onClick={() => {
                    setIsEditing(false);
                    form.setFieldsValue(userData);
                  }}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button 
                  type="primary" 
                  icon={<EditOutlined />}
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
              )}
              <Button danger onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
