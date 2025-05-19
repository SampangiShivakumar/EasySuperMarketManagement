import React from 'react';
import { Card, Form, Input, Button, Switch, Typography } from 'antd';
import Navbar from '../../NavBar/Navbar1';
import './Settings.css';

const Settings = () => {
  const [form] = Form.useForm();
  const { Title } = Typography;

  const onFinish = (values) => {
    console.log('Settings updated:', values);
  };

  return (
    <div className="settings-container">
      <Navbar />
      <div className="settings-content">
        <Title level={2} className="settings-title">Settings</Title>
        <Card className="settings-card">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              storeName: 'My Store',
              email: 'store@example.com',
              darkMode: false,
              notifications: true
            }}
          >
            <Form.Item
              name="storeName"
              label="Store Name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, type: 'email' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="darkMode"
              label="Dark Mode"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            <Form.Item
              name="notifications"
              label="Enable Notifications"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="settings-submit-btn">
                Save Settings
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
