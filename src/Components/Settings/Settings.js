import React, { useEffect } from 'react';
import { Card, Form, Input, Button, Switch, Typography, message } from 'antd';
import Navbar from '../../NavBar/Navbar1';
import './Settings.css';

const Settings = () => {
  const [form] = Form.useForm();
  const { Title } = Typography;

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem('quickmart-settings'));
    if (savedSettings) {
      form.setFieldsValue(savedSettings);
    }
  }, [form]);

  const onFinish = (values) => {
    localStorage.setItem('quickmart-settings', JSON.stringify(values));
    message.success('Settings updated successfully!');
    console.log('Settings updated:', values);
  };

  const onReset = () => {
    form.resetFields();
    message.info('Settings reset to default.');
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
              rules={[{ required: true, message: 'Please enter store name' }]}
            >
              <Input placeholder="Enter store name" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, type: 'email', message: 'Enter a valid email' }]}
            >
              <Input placeholder="Enter email address" />
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

            <Form.Item className="settings-btn-group">
              <Button type="primary" htmlType="submit" className="settings-submit-btn">
                Save Settings
              </Button>
              <Button htmlType="button" onClick={onReset} className="settings-reset-btn" style={{ marginLeft: '12px' }}>
                Reset
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
