import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Row, Col, Skeleton, Tooltip } from 'antd';
import { 
  FaShoppingCart, FaBoxes, FaUsers, FaChartLine, 
  FaCog, FaFileInvoiceDollar, FaArrowUp, FaArrowDown 
} from 'react-icons/fa';
import { io } from 'socket.io-client';
import './Dashboard.css';
import Navbar from "../NavBar/Navbar1.js";

const socket = io('http://localhost:5002');

const Dashboard = () => {
  const navigate = useNavigate();
  const [todaysSales, setTodaysSales] = useState(0);
  const [salesTrend, setSalesTrend] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [monthlyRevenueTrend, setMonthlyRevenueTrend] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [productsTrend, setProductsTrend] = useState(0);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchTodaysSales();
    fetchMonthlyRevenue();
    fetchProductsStats();

    socket.on('connect', () => {
      console.log('Connected to dashboard server');
    });

    socket.on('newSale', (data) => {
      const today = new Date().toISOString().split('T')[0];
      if (data.Date === today) {
        setTodaysSales(prevSales => {
          const newTotal = data.dailyTotal || (prevSales + data.Total);
          const trendValue = prevSales > 0 ? ((newTotal - prevSales) / prevSales) * 100 : 100;
          setSalesTrend(trendValue);
          return newTotal;
        });
      }
    });

    socket.on('monthlyRevenueUpdated', (data) => {
      setMonthlyRevenue(data.total);
      setMonthlyRevenueTrend(data.trend);
    });

    return () => {
      socket.off('newSale');
      socket.off('monthlyRevenueUpdated');
    };
  }, []);

  const fetchTodaysSales = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(`http://localhost:5002/api/sales/daily?date=${today}`);
      const data = await response.json();
      setTodaysSales(data.total || 0);
      setSalesTrend(data.trend || 0);
    } catch (error) {
      console.error('Error fetching today\'s sales:', error);
      setTodaysSales(0);
      setSalesTrend(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthlyRevenue = async () => {
    try {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();
      
      const response = await fetch(`http://localhost:5002/api/sales/monthly?month=${currentMonth}&year=${currentYear}`);
      const data = await response.json();
      
      setMonthlyRevenue(data.total || 0);
      setMonthlyRevenueTrend(data.trend || 0);
    } catch (error) {
      console.error('Error fetching monthly revenue:', error);
      setMonthlyRevenue(0);
      setMonthlyRevenueTrend(0);
    }
  };

  const fetchProductsStats = async () => {
    try {
      const response = await fetch('http://localhost:5002/api/products');
      const data = await response.json();
      setTotalProducts(data.total || 0);
      setProductsTrend(data.trend || 0);
    } catch (error) {
      console.error('Error fetching products stats:', error);
      setTotalProducts(0);
      setProductsTrend(0);
    }
  };

  const stats = [
    {
      title: "Today's Sales",
      value: todaysSales.toLocaleString('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }),
      trend: salesTrend,
      period: "vs previous sale"
    },
    {
      title: "Total Products",
      value: totalProducts.toString(),
      trend: productsTrend,
      period: "vs last week"
    },
    {
      title: "Total Employees",
      value: "12",
      trend: 0,
      period: "no change"
    },
    {
      title: "Monthly Revenue",
      value: monthlyRevenue.toLocaleString('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }),
      trend: monthlyRevenueTrend,
      period: "vs last month"
    }
  ];

  const menuBlocks = [
    { 
      key: "pos", 
      icon: <FaShoppingCart size={30} />, 
      label: "POS",
      description: "Process sales and transactions"
    },
    { 
      key: "products", 
      icon: <FaBoxes size={30} />, 
      label: "Products",
      description: "Manage your product catalog"
    },
    { 
      key: "inventory", 
      icon: <FaBoxes size={30} />, 
      label: "Inventory",
      description: "Manage your products and stock"
    },
    { 
      key: "sales", 
      icon: <FaChartLine size={30} />, 
      label: "Sales",
      description: "Track your sales performance"
    },
    { 
      key: "billing", 
      icon: <FaFileInvoiceDollar size={30} />, 
      label: "Billing",
      description: "Handle invoices and payments"
    },
    { 
      key: "employees", 
      icon: <FaUsers size={30} />, 
      label: "Employees",
      description: "Manage your team"
    },
    { 
      key: "reports", 
      icon: <FaChartLine size={30} />, 
      label: "Reports",
      description: "View detailed analytics"
    },
    { 
      key: "settings", 
      icon: <FaCog size={30} />, 
      label: "Settings",
      description: "Configure your workspace"
    }
  ];

  const renderTrend = (trend) => {
    if (trend === 0) return null;
    const isPositive = trend > 0;
    return (
      <div className={`trend ${isPositive ? 'positive' : 'negative'}`}>
        {isPositive ? <FaArrowUp /> : <FaArrowDown />}
        <span>{Math.abs(trend)}%</span>
      </div>
    );
  };

  const renderStats = () => (
    <div className="dashboard-stats">
      {stats.map((stat, index) => (
        <div className="stat-card" key={index}>
          <div className="stat-title">{stat.title}</div>
          {loading ? (
            <Skeleton.Input active size="large" className="stat-skeleton" />
          ) : (
            <>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-footer">
                {renderTrend(stat.trend)}
                <span className="period">{stat.period}</span>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">
        <div className="dashboard-header">
          {renderStats()}
        </div>
        <div className="menu-wrapper">
          <Row gutter={[30, 30]} className="menu-blocks" justify="center">
            {menuBlocks.map(block => (
              <Col xs={24} sm={12} md={8} lg={8} key={block.key}>
                <Tooltip title={block.description} placement="bottom">
                  <Card
                    hoverable
                    className="menu-block"
                    onClick={() => navigate(`/${block.key}`)}
                  >
                    <div className="menu-block-content">
                      {block.icon}
                      <div className="menu-block-text">
                        <h3>{block.label}</h3>
                        <p className="menu-block-description">{block.description}</p>
                      </div>
                    </div>
                  </Card>
                </Tooltip>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;









































































































