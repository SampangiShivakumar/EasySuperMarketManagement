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
  const [form] = Form.useForm();  const [editingId, setEditingId] = useState(null);
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
      const response = await fetch('http://localhost:5002/api/products', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch products');
      }
      
      const data = await response.json();
      
      if (!data || !Array.isArray(data.products)) {
        throw new Error('Invalid response format from server');
      }

      // Extract products array from response and validate product properties
      const validatedProducts = data.products.map(product => ({
        _id: product._id || '',
        productId: product.productId || '',
        name: product.name || '',
        category: product.category || '',
        price: typeof product.price === 'number' ? product.price : 0,
        costPrice: typeof product.costPrice === 'number' ? product.costPrice : 0,
        stock: typeof product.stock === 'number' ? product.stock : 0,
        description: product.description || '',
        expirationDate: product.expirationDate || null,
        lowStockThreshold: product.lowStockThreshold || 0
      }));
      
      setProducts(validatedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      message.error(error.message || 'Failed to fetch products');
      setProducts([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };
  const filteredProducts = products.filter(product => {
    const searchLower = searchText.toLowerCase();
    return (
      (product.name || '').toLowerCase().includes(searchLower) ||
      (product.productId || '').toLowerCase().includes(searchLower) ||
      (product.category || '').toLowerCase().includes(searchLower)
    );
  });

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
    {      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      sorter: (a, b) => (a.price || 0) - (b.price || 0),
      render: (price) => `₹${(price || 0).toFixed(2)}`,
    },
    {
      title: 'Cost',
      dataIndex: 'costPrice',
      key: 'costPrice',
      sorter: (a, b) => (a.costPrice || 0) - (b.costPrice || 0),
      render: (price) => `₹${(price || 0).toFixed(2)}`,
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      sorter: (a, b) => a.stock - b.stock,
      render: (stock, record) => ({
        children: stock,
        props: {
          style: {
            color: stock <= (record.lowStockThreshold || 0) ? 'red' : 'inherit'
          }
        }
      })
    },
    {
      title: 'Expires',
      dataIndex: 'expirationDate',
      key: 'expirationDate',
      render: (date) => date ? new Date(date).toLocaleDateString() : 'N/A',
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
    // Format the expiration date for the input if it exists
    const formattedRecord = {
      ...record,
      expirationDate: record.expirationDate ? new Date(record.expirationDate).toISOString().split('T')[0] : undefined
    };
    form.setFieldsValue(formattedRecord);
    setEditingId(record._id);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      Modal.confirm({
        title: 'Delete Product',
        content: 'Are you sure you want to delete this product?',
        okText: 'Yes',
        cancelText: 'No',
        onOk: async () => {
          const response = await fetch(`http://localhost:5002/api/products/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to delete product');
          }

          // Update local state immediately
          setProducts(prev => prev.filter(product => product._id !== id));
          message.success('Product deleted successfully');
        }
      });
    } catch (error) {
      console.error('Failed to delete product:', error);
      message.error(error.message || 'Failed to delete product. Please try again.');
    }
  };

  const handleModalOk = () => {
    form.validateFields()
      .then(async (values) => {
        try {
          const url = editingId 
            ? `http://localhost:5002/api/products/${editingId}`
            : 'http://localhost:5002/api/products';
          
          const method = editingId ? 'PUT' : 'POST';            // Convert numeric fields and ensure they are valid
          const stock = parseInt(values.stock || 0);
          const lowStockThreshold = parseInt(values.lowStockThreshold || 0);
          const price = parseFloat(values.price || 0);
          const costPrice = parseFloat(values.costPrice || 0);

          if (isNaN(stock) || isNaN(lowStockThreshold) || isNaN(price) || isNaN(costPrice)) {
            throw new Error('Invalid numeric values provided');
          }

          // Prepare the data for submission
          const submissionData = {
            ...values,
            _id: editingId,
            price,
            costPrice,
            stock,
            lowStockThreshold
          };console.log('Submitting data:', submissionData); // Debug log
          
          const response = await fetch(url, {
            method,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(submissionData),
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.error('Server error:', errorData); // Debug log
            throw new Error(errorData.message || 'Failed to save product');
          }
          
          const savedProduct = await response.json();
          console.log('Server response:', savedProduct); // Debug log
          
          // Update local state immediately for better UX
          if (editingId) {
            setProducts(prev => prev.map(p => 
              p._id === editingId ? savedProduct.product : p
            ));
            // Refetch products to ensure consistency
            await fetchProducts();
          } else {
            setProducts(prev => [...prev, savedProduct.product]);
          }
          
          message.success(`Product ${editingId ? 'updated' : 'added'} successfully`);
          setIsModalVisible(false);
          form.resetFields();
          setEditingId(null);
        } catch (error) {
          console.error('Failed to save product:', error);
          message.error(error.message || 'Failed to save product. Please try again.');
        }
      })
      .catch((info) => {
        console.log('Form validation failed:', info);
        message.error('Please check the form fields and try again.');
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
        >          <Form
            form={form}
            layout="vertical"
            initialValues={{
              productId: generateProductId(),
              stock: 0,
              price: 0,
              costPrice: 0,
              lowStockThreshold: 0
            }}
            preserve={false}
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
            </Form.Item>            <Form.Item
              name="stock"
              label="Stock"
              rules={[
                { required: true, message: 'Please input the stock quantity!' },
                { type: 'number', message: 'Please input a valid number!' }
              ]}
            >
              <InputNumber 
                style={{ width: '100%' }} 
                min={0}
                parser={value => value ? parseInt(value, 10) : 0}
                formatter={value => value.toString()}
              />
            </Form.Item>
            <Form.Item
              name="description"
              label="Description"
            >
              <Input.TextArea />
            </Form.Item>
            <Form.Item
              name="expirationDate"
              label="Expiration Date"
            >
              <Input type="date" />
            </Form.Item>            <Form.Item
              name="lowStockThreshold"
              label="Low Stock Alert Threshold"
              tooltip="System will notify when stock falls below this number"
              rules={[
                { required: true, message: 'Please set a low stock threshold!' },
                { type: 'number', message: 'Please input a valid number!' }
              ]}
            >
              <InputNumber 
                style={{ width: '100%' }} 
                min={0}
                parser={value => value ? parseInt(value, 10) : 0}
                formatter={value => value.toString()}
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default Products;