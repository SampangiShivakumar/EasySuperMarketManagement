import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Input, Button, Select, InputNumber, Table, message, List, Avatar, Badge } from 'antd';
import { FaShoppingCart, FaPlus, FaSearch } from 'react-icons/fa';
import Navbar from '../../NavBar/Navbar1';
import './POS.css';

const POS = () => {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [customerType, setCustomerType] = useState('Normal');
  const [gender, setGender] = useState('Male');
  const [payment, setPayment] = useState('Cash');
  const [city, setCity] = useState('Hyderabad');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5002/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      message.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item._id === product._id);
      if (existingItem) {
        return prevCart.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity === 0) {
      setCart(prevCart => prevCart.filter(item => item._id !== productId));
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item._id === productId
            ? { ...item, quantity }
            : item
        )
      );
    }
  };

  const calculateTotal = () => {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.05; // 5% tax
    return { subtotal, tax, total: subtotal + tax };
  };

  const generateInvoiceId = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${year}${month}${day}-${random}`;
  };

  const handleCheckout = async () => {
    try {
      const { subtotal, tax, total } = calculateTotal();
      const sale = {
        InvoiceID: generateInvoiceId(),
        Date: new Date().toISOString().split('T')[0],
        CustomerType: customerType,
        Gender: gender,
        ProductLine: cart[0]?.category || 'General',
        UnitPrice: subtotal / cart.reduce((sum, item) => sum + item.quantity, 1),
        Quantity: cart.reduce((sum, item) => sum + item.quantity, 0),
        Tax: tax,
        Total: total,
        Payment: payment,
        City: city
      };

      const response = await fetch('http://localhost:5002/api/sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sale),
      });

      if (response.ok) {
        // Update product stock
        await Promise.all(cart.map(item =>
          fetch(`http://localhost:5002/api/products/${item._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              stock: item.stock - item.quantity
            })
          })
        ));

        message.success('Sale completed successfully');
        setCart([]); // Clear cart after successful sale
      } else {
        throw new Error('Failed to process sale');
      }
    } catch (error) {
      message.error('Failed to process sale: ' + error.message);
    }
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchText.toLowerCase()) ||
    product.category.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="pos-container">
      <Navbar />
      <div className="pos-content">
        <div className="component-header">
          <h2><FaShoppingCart /> Point of Sale</h2>
        </div>
        <Row gutter={[24, 24]}>
          <Col span={16}>
            <Card title={
              <Input
                placeholder="Search products"
                prefix={<FaSearch />}
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                style={{ width: 300 }}
              />
            }>
              <List
                loading={loading}
                grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4 }}
                dataSource={filteredProducts}
                renderItem={product => (
                  <List.Item>
                    <Card
                      hoverable
                      onClick={() => product.stock > 0 && addToCart(product)}
                      className="product-card"
                    >
                      <Badge count={product.stock} overflowCount={999}>
                        <Avatar 
                          shape="square" 
                          size={64} 
                          style={{ backgroundColor: '#1890ff' }}
                        >
                          {product.name[0]}
                        </Avatar>
                      </Badge>
                      <div className="product-info">
                        <h4>{product.name}</h4>
                        <p>{product.category}</p>
                        <p className="price">₹{product.price.toFixed(2)}</p>
                      </div>
                    </Card>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Cart">
              <div style={{ marginBottom: 16 }}>
                <Select
                  style={{ width: '100%', marginBottom: 8 }}
                  value={customerType}
                  onChange={setCustomerType}
                >
                  <Select.Option value="Member">Member</Select.Option>
                  <Select.Option value="Normal">Normal</Select.Option>
                </Select>
                <Select
                  style={{ width: '100%', marginBottom: 8 }}
                  value={gender}
                  onChange={setGender}
                >
                  <Select.Option value="Male">Male</Select.Option>
                  <Select.Option value="Female">Female</Select.Option>
                </Select>
                <Select
                  style={{ width: '100%', marginBottom: 8 }}
                  value={payment}
                  onChange={setPayment}
                >
                  <Select.Option value="Cash">Cash</Select.Option>
                  <Select.Option value="Credit">Credit</Select.Option>
                  <Select.Option value="E-wallet">E-wallet</Select.Option>
                </Select>
                <Select
                  style={{ width: '100%', marginBottom: 8 }}
                  value={city}
                  onChange={setCity}
                >
                  <Select.Option value="Hyderabad">Hyderabad</Select.Option>
                  <Select.Option value="Mumbai">Mumbai</Select.Option>
                  <Select.Option value="Bengaluru">Bengaluru</Select.Option>
                </Select>
              </div>
              <Table
                dataSource={cart}
                pagination={false}
                columns={[
                  { title: 'Item', dataIndex: 'name' },
                  {
                    title: 'Quantity',
                    dataIndex: 'quantity',
                    render: (quantity, record) => (
                      <InputNumber
                        min={0}
                        max={record.stock + quantity}
                        value={quantity}
                        onChange={(value) => updateQuantity(record._id, value)}
                      />
                    )
                  },
                  { 
                    title: 'Price',
                    dataIndex: 'price',
                    render: price => `₹${price.toFixed(2)}`
                  },
                  {
                    title: 'Total',
                    render: (_, record) => `₹${(record.price * record.quantity).toFixed(2)}`
                  }
                ]}
                summary={pageData => {
                  const { subtotal, tax, total } = calculateTotal();
                  return (
                    <>
                      <Table.Summary.Row>
                        <Table.Summary.Cell colSpan={3}>Subtotal</Table.Summary.Cell>
                        <Table.Summary.Cell>₹{subtotal.toFixed(2)}</Table.Summary.Cell>
                      </Table.Summary.Row>
                      <Table.Summary.Row>
                        <Table.Summary.Cell colSpan={3}>Tax (5%)</Table.Summary.Cell>
                        <Table.Summary.Cell>₹{tax.toFixed(2)}</Table.Summary.Cell>
                      </Table.Summary.Row>
                      <Table.Summary.Row>
                        <Table.Summary.Cell colSpan={3}>Total</Table.Summary.Cell>
                        <Table.Summary.Cell>
                          <strong>₹{total.toFixed(2)}</strong>
                        </Table.Summary.Cell>
                      </Table.Summary.Row>
                    </>
                  );
                }}
              />
              <div style={{ marginTop: 16 }}>
                <Button 
                  type="primary" 
                  block 
                  onClick={handleCheckout}
                  disabled={cart.length === 0}
                >
                  Complete Sale
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default POS;
