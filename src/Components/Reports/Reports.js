import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { TbReportMoney } from 'react-icons/tb';
import { FaBoxes, FaShoppingCart, FaChartLine } from 'react-icons/fa';
import Navbar from '../../NavBar/Navbar1';
import './Reports.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Reports = () => {
  const [timeRange, setTimeRange] = useState('weekly');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState({
    salesData: [],
    inventoryData: {},
    categoryData: []
  });

  const getDemoData = React.useCallback(() => {
    setIsLoading(true);
    try {
      const today = new Date();
      let salesData = [];
      let dataPoints;
      let baseAmount;
      
      // Generate data based on time range
      switch(timeRange) {
        case 'daily':
          dataPoints = 24; // 24 hours
          baseAmount = 2000; // Base amount per hour
          salesData = Array(dataPoints).fill(null).map((_, index) => {
            const date = new Date();
            date.setHours(today.getHours() - (23 - index));
            // More sales during peak hours (9AM-1PM and 4PM-8PM)
            const hour = date.getHours();
            const peakMultiplier = (hour >= 9 && hour <= 13) || (hour >= 16 && hour <= 20) ? 2 : 1;
            return {
              date: date.toISOString(),
              salesAmount: Math.floor((Math.random() * 1500 + baseAmount) * peakMultiplier)
            };
          });
          break;

        case 'weekly':
          dataPoints = 7; // 7 days
          baseAmount = 25000; // Base amount per day
          salesData = Array(dataPoints).fill(null).map((_, index) => {
            const date = new Date();
            date.setDate(today.getDate() - (6 - index));
            // More sales on weekends
            const dayOfWeek = date.getDay();
            const weekendMultiplier = (dayOfWeek === 0 || dayOfWeek === 6) ? 1.5 : 1;
            return {
              date: date.toISOString(),
              salesAmount: Math.floor((Math.random() * 15000 + baseAmount) * weekendMultiplier)
            };
          });
          break;

        case 'monthly':
          dataPoints = 30; // 30 days
          baseAmount = 20000; // Base amount per day
          salesData = Array(dataPoints).fill(null).map((_, index) => {
            const date = new Date();
            date.setDate(today.getDate() - (29 - index));
            // More sales at month start (salary days) and weekends
            const dayOfMonth = date.getDate();
            const dayOfWeek = date.getDay();
            const salaryDayMultiplier = (dayOfMonth <= 7) ? 1.8 : 1;
            const weekendMultiplier = (dayOfWeek === 0 || dayOfWeek === 6) ? 1.3 : 1;
            return {
              date: date.toISOString(),
              salesAmount: Math.floor((Math.random() * 12000 + baseAmount) * salaryDayMultiplier * weekendMultiplier)
            };
          });
          break;

        case 'yearly':
          dataPoints = 12; // 12 months
          baseAmount = 600000; // Base amount per month
          salesData = Array(dataPoints).fill(null).map((_, index) => {
            const date = new Date();
            date.setMonth(today.getMonth() - (11 - index));
            // More sales during festivals and holidays
            const month = date.getMonth();
            const festiveMultiplier = (month === 9 || month === 10 || month === 11) ? 1.8 : // Festival season
                                    (month === 3 || month === 4) ? 1.4 : // Spring sales
                                    1;
            return {
              date: date.toISOString(),
              salesAmount: Math.floor((Math.random() * 200000 + baseAmount) * festiveMultiplier)
            };
          });
          break;
      }

      // Category data changes based on time range
      const categoryMultiplier = timeRange === 'yearly' ? 12 :
                                timeRange === 'monthly' ? 4 :
                                timeRange === 'weekly' ? 1.5 : 1;
      
      const categories = [
        { 
          category: 'Groceries', 
          count: Math.floor(150 * categoryMultiplier), 
          value: Math.floor(75000 * categoryMultiplier) 
        },
        { 
          category: 'Electronics', 
          count: Math.floor(50 * categoryMultiplier), 
          value: Math.floor(250000 * categoryMultiplier) 
        },
        { 
          category: 'Clothing', 
          count: Math.floor(100 * categoryMultiplier), 
          value: Math.floor(120000 * categoryMultiplier) 
        },
        { 
          category: 'Home & Kitchen', 
          count: Math.floor(80 * categoryMultiplier), 
          value: Math.floor(95000 * categoryMultiplier) 
        },
        { 
          category: 'Beauty', 
          count: Math.floor(60 * categoryMultiplier), 
          value: Math.floor(45000 * categoryMultiplier) 
        }
      ];

      // Calculate total transactions based on time range
      const transactionsMultiplier = timeRange === 'yearly' ? 300 :
                                    timeRange === 'monthly' ? 150 :
                                    timeRange === 'weekly' ? 50 : 1;

      const inventoryData = {
        todaySales: salesData[salesData.length - 1].salesAmount,
        todayTransactions: Math.floor(127 * transactionsMultiplier),
        inventoryValue: Math.floor(585000 * categoryMultiplier),
        totalProducts: Math.floor(440 * categoryMultiplier),
        lowStockCount: Math.floor(12 * (categoryMultiplier / 2))
      };

      setReportData({
        salesData: salesData,
        inventoryData: inventoryData,
        categoryData: categories
      });

    } catch (err) {
      console.error('Error generating demo data:', err);
      setError('Failed to generate demo data');
    } finally {
      setIsLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    getDemoData();
  }, [getDemoData]);  // Chart Data
  const salesChartData = {
    labels: reportData.salesData.map(item => new Date(item.date).toLocaleDateString()),
    datasets: [{
      label: 'Sales Amount',
      data: reportData.salesData.map(item => item.salesAmount),
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.3,
      fill: false
    }]
  };

  const categoryChartData = {
    labels: reportData.categoryData.map(item => item.category),
    datasets: [{
      label: 'Products by Category',
      data: reportData.categoryData.map(item => item.count),
      backgroundColor: [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)',
      ],
    }]
  };

  const inventoryValueChartData = {
    labels: reportData.categoryData.map(item => item.category),
    datasets: [{
      label: 'Inventory Value by Category',
      data: reportData.categoryData.map(item => item.value),
      backgroundColor: [
        'rgba(255, 159, 64, 0.7)',
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)',
      ],
    }]
  };


  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="reports-container">
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 64px)' }}>
            <CircularProgress />
          </Box>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="reports-container">
          <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Alert severity="error">{error}</Alert>
          </Container>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="reports-container">
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box className="reports-header">
            <Typography variant="h4" gutterBottom>
              Store Analytics Dashboard
            </Typography>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="yearly">Yearly</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card className="summary-card sales">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TbReportMoney className="card-icon" />
                  <Typography color="textSecondary" variant="h6">Total Sales</Typography>
                </Box>
                <Typography variant="h4">
                  ₹{reportData.inventoryData.todaySales?.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {reportData.inventoryData.todayTransactions} transactions today
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card className="summary-card inventory">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <FaBoxes className="card-icon" />
                  <Typography color="textSecondary" variant="h6">Inventory Value</Typography>
                </Box>
                <Typography variant="h4">
                  ₹{reportData.inventoryData.inventoryValue?.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {reportData.inventoryData.totalProducts} total products
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card className="summary-card products">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <FaShoppingCart className="card-icon" />
                  <Typography color="textSecondary" variant="h6">Low Stock</Typography>
                </Box>
                <Typography variant="h4">
                  {reportData.inventoryData.lowStockCount}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  items need restock
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card className="summary-card trends">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <FaChartLine className="card-icon" />
                  <Typography color="textSecondary" variant="h6">Categories</Typography>
                </Box>
                <Typography variant="h4">
                  {reportData.categoryData.length}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  product categories
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Sales Trends</Typography>
                <Box sx={{ height: 300 }}>
                  <Line
                    data={salesChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: {
                            display: true,
                            text: 'Sales (₹)'
                          }
                        }
                      }
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Category Distribution</Typography>
                <Box sx={{ height: 300 }}>
                  <Doughnut
                    data={categoryChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Inventory Value by Category</Typography>
                <Box sx={{ height: 300 }}>
                  <Bar
                    data={inventoryValueChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: {
                            display: true,
                            text: 'Value (₹)'
                          }
                        }
                      }
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </div>
    </>
  );
};

export default Reports;
