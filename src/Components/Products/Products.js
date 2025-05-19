import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Space, Modal, Form, InputNumber, Select, message } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { io } from 'socket.io-client';
import Navbar from '../../NavBar/Navbar1';

const socket = io('http://localhost:5002');

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState(null);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchProducts();
    
    socket.on('productUpdated', (update) => {
      if (update.type === 'added') {
        setProducts(prev => [...prev, update.product]);
        message.success('New product added');
      } else if (update.type === 'updated') {
        setProducts(prev => prev.map(p => 
          p._id === update.product._id ? update.product : p
        ));
        message.success('Product updated');
      } else if (update.type === 'deleted') {
        setProducts(prev => prev.filter(p => p._id !== update.productId));
        message.success('Product deleted');
      }
    });

    return () => socket.disconnect();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5002/api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      // Extract products array from response and validate product properties
      const productsArray = Array.isArray(data.products) ? data.products : [];
      const validatedProducts = productsArray.map(product => ({
        _id: product._id || '',
        productId: product.productId || '',
        name: product.name || '',
        category: product.category || '',
        price: product.price !== undefined ? Number(product.price) : 0,
        costPrice: product.costPrice !== undefined ? Number(product.costPrice) : 0,
        stock: product.stock !== undefined ? Number(product.stock) : 0,
        description: product.description || ''
      }));
      setProducts(validatedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      message.error('Failed to fetch products');
      setProducts([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchText.toLowerCase()) ||
    product.productId.toLowerCase().includes(searchText.toLowerCase()) ||
    product.category.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'Product ID',
      dataIndex: 'productId',
      key: 'productId',
      sorter: (a, b) => a.productId.localeCompare(b.productId),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      filters: [
        { text: 'Electronics', value: 'Electronics' },
        { text: 'Food & Beverages', value: 'Food & Beverages' },
        { text: 'Fashion', value: 'Fashion' },
        { text: 'Home & Lifestyle', value: 'Home & Lifestyle' },
        { text: 'Health & Beauty', value: 'Health & Beauty' },
      ],
      onFilter: (value, record) => record.category === value,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      sorter: (a, b) => a.price - b.price,
      render: (price) => `₹${price.toFixed(2)}`,
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      sorter: (a, b) => a.stock - b.stock,
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
    setEditingId(null);
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    form.setFieldsValue(record);
    setEditingId(record._id);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5002/api/products/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete product');
    } catch (error) {
      message.error('Failed to delete product: ' + error.message);
    }
  };

  const handleModalOk = () => {
    form.validateFields()
      .then(async (values) => {
        try {
          const url = editingId 
            ? `http://localhost:5002/api/products/${editingId}`
            : 'http://localhost:5002/api/products';
          
          const method = editingId ? 'PUT' : 'POST';
          
          const response = await fetch(url, {
            method,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
          });

          if (!response.ok) throw new Error('Failed to save product');
          
          setIsModalVisible(false);
          form.resetFields();
          setEditingId(null);
        } catch (error) {
          message.error('Failed to save product: ' + error.message);
        }
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const generateProductId = () => {
    const prefix = 'PRD';
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${prefix}${random}`;
  };

  return (
    <div className="products-container">
      <Navbar />
      <div className="products-content">
        <div className="component-header">
          <h2>Products Management</h2>
          <Space>
            <Input
              placeholder="Search products"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 300 }}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              Add Product
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredProducts}
          loading={loading}
          rowKey="_id"
        />

        <Modal
          title={editingId ? "Edit Product" : "Add New Product"}
          visible={isModalVisible}
          onOk={handleModalOk}
          onCancel={() => {
            setIsModalVisible(false);
            form.resetFields();
            setEditingId(null);
          }}
        >
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              productId: generateProductId(),
              stock: 0,
            }}
          >
            <Form.Item
              name="productId"
              label="Product ID"
              rules={[{ required: true }]}
            >
              <Input disabled={editingId !== null} />
            </Form.Item>
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true }]}
            >
              <Select>
                <Select.Option value="Electronics">Electronics</Select.Option>
                <Select.Option value="Food & Beverages">Food & Beverages</Select.Option>
                <Select.Option value="Fashion">Fashion</Select.Option>
                <Select.Option value="Home & Lifestyle">Home & Lifestyle</Select.Option>
                <Select.Option value="Health & Beauty">Health & Beauty</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="price"
              label="Selling Price"
              rules={[{ required: true }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                step={0.01}
                formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/₹\s?|(,*)/g, '')}
              />
            </Form.Item>
            <Form.Item
              name="costPrice"
              label="Cost Price"
              rules={[{ required: true }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                step={0.01}
                formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/₹\s?|(,*)/g, '')}
              />
            </Form.Item>
            <Form.Item
              name="stock"
              label="Stock"
              rules={[{ required: true }]}
            >
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>
            <Form.Item
              name="description"
              label="Description"
            >
              <Input.TextArea />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default Products;