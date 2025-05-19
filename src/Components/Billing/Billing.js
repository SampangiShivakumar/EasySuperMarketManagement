import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Space, Modal, Form, DatePicker, InputNumber, Select, message, Row, Col } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { io } from 'socket.io-client';
import Navbar from '../../NavBar/Navbar1';
import './Billing.css';

const socket = io('http://localhost:5002');

const Billing = () => {
  const [bills, setBills] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchBills();

    // Listen for real-time product updates
    socket.on('productUpdated', (update) => {
      if (update.type === 'updated') {
        // Update products list
        setProducts(prev => prev.map(p => 
          p._id === update.product._id ? update.product : p
        ));
        
        // Update selected products if they're modified
        setSelectedProducts(prev => prev.map(p => {
          if (p.productId === update.product._id) {
            return {
              ...p,
              name: update.product.name,
              price: update.product.price,
              stock: update.product.stock
            };
          }
          return p;
        }));
      }
    });

    // Listen for bill updates
    socket.on('billUpdated', (data) => {
      if (data.type === 'added') {
        setBills(prev => [data.bill, ...prev]);
        message.success('New bill created');
      } else if (data.type === 'updated') {
        setBills(prev => prev.map(b => b._id === data.bill._id ? data.bill : b));
        message.success('Bill updated');
      } else if (data.type === 'deleted') {
        setBills(prev => prev.filter(b => b._id !== data.billId));
        message.success('Bill deleted');
      }
    });

    return () => {
      socket.off('productUpdated');
      socket.off('billUpdated');
    };
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5002/api/products');
      const data = await response.json();
      setProducts(Array.isArray(data.products) ? data.products : []);
    } catch (error) {
      message.error('Failed to fetch products');
    }
  };

  const fetchBills = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5002/api/bills');
      const data = await response.json();
      setBills(data);
    } catch (error) {
      message.error('Failed to fetch bills');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Bill No',
      dataIndex: 'billNo',
      key: 'billNo',
      sorter: (a, b) => a.billNo.localeCompare(b.billNo),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
    },
    {
      title: 'Products',
      dataIndex: 'products',
      key: 'products',
      render: (products) => (
        <div>
          {products?.map((p, index) => (
            <div key={index}>
              {p.name} (x{p.quantity}) - ₹{p.price}
            </div>
          ))}
        </div>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      sorter: (a, b) => a.amount - b.amount,
      render: (amount) => `₹${amount.toFixed(2)}`,
    },
    {
      title: 'Payment Method',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      filters: [
        { text: 'Cash', value: 'cash' },
        { text: 'Card', value: 'card' },
        { text: 'Online', value: 'online' },
      ],
      onFilter: (value, record) => record.paymentMethod === value,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span style={{ 
          color: status === 'paid' ? '#52c41a' : 
                 status === 'pending' ? '#faad14' : '#f5222d' 
        }}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
          <Button type="link" danger onClick={() => handleDelete(record._id)}>Delete</Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    form.resetFields();
    setSelectedProducts([]);
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    form.setFieldsValue({
      ...record,
      date: record.date ? new Date(record.date) : null,
    });
    setSelectedProducts(record.products || []);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5002/api/bills/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        message.success('Bill deleted successfully');
        fetchBills();
      } else {
        throw new Error('Failed to delete bill');
      }
    } catch (error) {
      message.error('Failed to delete bill: ' + error.message);
    }
  };

  const addProduct = () => {
    const values = form.getFieldValue('currentProduct');
    if (!values || !values.productId || !values.quantity) {
      message.error('Please select a product and quantity');
      return;
    }

    const product = products.find(p => p._id === values.productId);
    if (!product) {
      message.error('Product not found');
      return;
    }

    // Check if product already exists in selected products
    const existingProduct = selectedProducts.find(p => p.productId === product._id);
    const existingQuantity = existingProduct ? existingProduct.quantity : 0;
    
    // Validate stock
    if (values.quantity + existingQuantity > product.stock) {
      message.error(`Not enough stock. Available: ${product.stock}`);
      return;
    }

    if (existingProduct) {
      // Update existing product quantity
      setSelectedProducts(prev => prev.map(p => 
        p.productId === product._id 
          ? { 
              ...p, 
              quantity: p.quantity + values.quantity,
              total: (p.quantity + values.quantity) * p.price 
            }
          : p
      ));
    } else {
      // Add new product
      const newProduct = {
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: values.quantity,
        stock: product.stock,
        total: product.price * values.quantity
      };
      setSelectedProducts([...selectedProducts, newProduct]);
    }

    // Reset the form fields for next product
    form.setFieldsValue({
      currentProduct: { 
        productId: undefined, 
        quantity: 1 
      }
    });
  };

  const removeProduct = (index) => {
    setSelectedProducts(selectedProducts.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return selectedProducts.reduce((sum, product) => sum + (product.price * product.quantity), 0);
  };

  const generateBillNo = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `BILL-${year}${month}${day}-${random}`;
  };

  const handleModalOk = () => {
    form.submit(); // This will trigger the form's onFinish
  };

  // Filter bills based on search text
  const filteredBills = bills.filter(bill => 
    bill.billNo.toLowerCase().includes(searchText.toLowerCase()) ||
    bill.customer.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="billing-container">
      <Navbar />
      <div className="billing-content">
        <div className="component-header">
          <h2>Billing Management</h2>
          <Space>
            <Input 
              placeholder="Search bills" 
              prefix={<SearchOutlined />} 
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 300 }}
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              Create Bill
            </Button>
          </Space>
        </div>

        <Table 
          columns={columns}
          dataSource={filteredBills}
          loading={loading}
          rowKey="_id"
        />

        <Modal
          title="Bill Details"
          visible={isModalVisible}
          width={800}
          onOk={handleModalOk}
          onCancel={() => setIsModalVisible(false)}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={async (values) => {
              try {
                const billData = {
                  ...values,
                  billNo: values.billNo || generateBillNo(),
                  products: selectedProducts,
                  amount: calculateTotal(),
                  date: values.date.format('YYYY-MM-DD')
                };

                const url = values._id 
                  ? `http://localhost:5002/api/bills/${values._id}`
                  : 'http://localhost:5002/api/bills';
                
                const method = values._id ? 'PUT' : 'POST';
                
                const response = await fetch(url, {
                  method,
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(billData),
                });

                if (!response.ok) {
                  throw new Error('Failed to save bill');
                }
                
                message.success(`Bill ${values._id ? 'updated' : 'created'} successfully`);
                setIsModalVisible(false);
                form.resetFields();
                setSelectedProducts([]);
                fetchBills();
              } catch (error) {
                console.error('Error saving bill:', error);
                message.error('Failed to save bill: ' + error.message);
              }
            }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="billNo"
                  label="Bill No"
                >
                  <Input disabled placeholder="Auto-generated" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="date"
                  label="Date"
                  rules={[{ required: true }]}
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="customer"
                  label="Customer"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="paymentMethod"
                  label="Payment Method"
                  rules={[{ required: true }]}
                >
                  <Select>
                    <Select.Option value="cash">Cash</Select.Option>
                    <Select.Option value="card">Card</Select.Option>
                    <Select.Option value="online">Online</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Add Products">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name={['currentProduct', 'productId']}>
                    <Select
                      placeholder="Select Product"
                      showSearch
                      optionFilterProp="children"
                    >
                      {products.map(product => (
                        <Select.Option key={product._id} value={product._id}>
                          {product.name} - ₹{product.price}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name={['currentProduct', 'quantity']} initialValue={1}>
                    <InputNumber min={1} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Button type="primary" onClick={addProduct}>Add</Button>
                </Col>
              </Row>
            </Form.Item>

            <Table
              dataSource={selectedProducts}
              pagination={false}
              columns={[
                { title: 'Product', dataIndex: 'name' },
                { title: 'Price', dataIndex: 'price', render: (price) => `₹${price}` },
                { title: 'Quantity', dataIndex: 'quantity' },
                { 
                  title: 'Total',
                  render: (_, record) => `₹${(record.price * record.quantity).toFixed(2)}`
                },
                {
                  title: 'Action',
                  render: (_, __, index) => (
                    <Button type="link" danger onClick={() => removeProduct(index)}>
                      Remove
                    </Button>
                  )
                }
              ]}
              summary={() => (
                <Table.Summary.Row>
                  <Table.Summary.Cell colSpan={3}>Total Amount</Table.Summary.Cell>
                  <Table.Summary.Cell>
                    <strong>₹{calculateTotal().toFixed(2)}</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell />
                </Table.Summary.Row>
              )}
            />

            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true }]}
            >
              <Select>
                <Select.Option value="paid">Paid</Select.Option>
                <Select.Option value="pending">Pending</Select.Option>
                <Select.Option value="overdue">Overdue</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default Billing;
