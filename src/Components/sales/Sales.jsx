import React, { useState, useEffect, useCallback } from 'react';
import { Table, Input, Space, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { io } from 'socket.io-client';
import { useSales } from '../../App';
import Navbar from '../../NavBar/Navbar1';
import dayjs from 'dayjs';

const socket = io('http://localhost:5002');

const Sales = () => {
  const [sales, setSales] = useState([]);  // Initialize as empty array
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const { updateTodaySales } = useSales();

  const fetchTodaySales = useCallback(async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(`http://localhost:5002/api/sales/daily?date=${today}`);
      if (!response.ok) throw new Error('Failed to fetch daily sales');
      const data = await response.json();
      updateTodaySales(data.total, true); // true means set absolute value
    } catch (error) {
      console.error('Error fetching daily sales:', error);
    }
  }, [updateTodaySales]);

  const fetchSales = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5002/api/sales');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Ensure data is always an array
      const salesArray = Array.isArray(data) ? data : [];
      // Ensure all sales have valid properties
      const processedData = salesArray.map(sale => ({
        InvoiceID: sale.InvoiceID || '',
        Date: sale.Date || '',
        CustomerType: sale.CustomerType || '',
        Gender: sale.Gender || '',
        ProductLine: sale.ProductLine || '',
        Total: sale.Total !== undefined && sale.Total !== null ? Number(sale.Total) : 0,
        Payment: sale.Payment || '',
        City: sale.City || ''
      }));
      setSales(processedData);
    } catch (error) {
      console.error('Error fetching sales:', error);
      message.error('Failed to fetch sales: ' + error.message);
      setSales([]); // Set to empty array on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSales();
    fetchTodaySales();

    socket.on('connect', () => {
      console.log('Connected to sales server');
    });

    socket.on('newSale', (data) => {
      setSales(prev => [data, ...prev]);
      // Update today's sales with the daily total from server
      if (data.dailyTotal !== undefined) {
        updateTodaySales(data.dailyTotal, true); // true means set absolute value
      }
      message.success('New sale recorded');
    });

    socket.on('salesUpdated', (data) => {
      if (data.type === 'added') {
        setSales(prev => [data.sale, ...prev]);
        if (data.dailyTotal !== undefined) {
          updateTodaySales(data.dailyTotal, true); // true means set absolute value
        }
      }
    });

    return () => {
      socket.off('newSale');
      socket.off('salesUpdated');
      socket.disconnect();
    };
  }, [fetchSales, fetchTodaySales, updateTodaySales]);

  const formatDate = (dateString) => {
    try {
      return dayjs(dateString).format('YYYY-MM-DD');
    } catch (error) {
      return dateString;
    }
  };

  const formatCurrency = (value) => {
    // Ensure we have a valid number
    if (value === undefined || value === null || isNaN(value)) {
      return '₹0.00';
    }
    const number = typeof value === 'string' ? parseFloat(value) : value;
    return `₹${number.toFixed(2)}`;
  };

  const columns = [
    {
      title: 'Invoice ID',
      dataIndex: 'InvoiceID',
      key: 'InvoiceID',
      sorter: (a, b) => a.InvoiceID?.localeCompare(b.InvoiceID || ''),
    },
    {
      title: 'Date',
      dataIndex: 'Date',
      key: 'Date',
      render: (text) => formatDate(text),
      sorter: (a, b) => new Date(a.Date || 0) - new Date(b.Date || 0),
    },
    {
      title: 'Customer Type',
      dataIndex: 'CustomerType',
      key: 'CustomerType',
      filters: [
        { text: 'Member', value: 'Member' },
        { text: 'Normal', value: 'Normal' },
      ],
      onFilter: (value, record) => record.CustomerType === value,
    },
    {
      title: 'Product Line',
      dataIndex: 'ProductLine',
      key: 'ProductLine',
    },
    {
      title: 'Total',
      dataIndex: 'Total',
      key: 'Total',
      sorter: (a, b) => (a.Total || 0) - (b.Total || 0),
      render: (text) => formatCurrency(text),
    },
    {
      title: 'Payment',
      dataIndex: 'Payment',
      key: 'Payment',
      filters: [
        { text: 'Credit', value: 'Credit' },
        { text: 'Cash', value: 'Cash' },
        { text: 'E-wallet', value: 'E-wallet' },
      ],
      onFilter: (value, record) => record.Payment === value,
    },
    {
      title: 'City',
      dataIndex: 'City',
      key: 'City',
      filters: [
        { text: 'Hyderabad', value: 'Hyderabad' },
        { text: 'Mumbai', value: 'Mumbai' },
        { text: 'Bengaluru', value: 'Bengaluru' },
      ],
      onFilter: (value, record) => record.City === value,
    }
  ];

  const filteredSales = sales.filter(sale => 
    (sale.InvoiceID || '').toLowerCase().includes(searchText.toLowerCase()) ||
    (sale.CustomerType || '').toLowerCase().includes(searchText.toLowerCase()) ||
    (sale.ProductLine || '').toLowerCase().includes(searchText.toLowerCase()) ||
    (sale.City || '').toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="sales-container">
      <Navbar />
      <div className="sales-content">
        <div className="component-header">
          <h2>Sales Management</h2>
          <Space>
            <Input
              placeholder="Search sales"
              prefix={<SearchOutlined />}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 300 }}
            />
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredSales}
          loading={loading}
          rowKey="InvoiceID"
          onChange={(pagination, filters, sorter) => {
            console.log('Table params:', { pagination, filters, sorter });
          }}
        />
      </div>
    </div>
  );
};

export default Sales;
