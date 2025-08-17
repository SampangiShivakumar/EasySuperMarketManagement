import React, { useState, useEffect, useCallback } from 'react';
import { Table, Tag, Button, message, Alert, Spin } from 'antd';
import { FaUsers, FaSync } from 'react-icons/fa';
import Navbar from '../../NavBar/Navbar1';
import axios from 'axios';
import './Employees.css';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retrying, setRetrying] = useState(false);

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('http://localhost:5002/api/employees', {
        timeout: 30000
      });
      
      if (response.data && Array.isArray(response.data)) {
        setEmployees(response.data);
        setRetrying(false);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      const errorMessage = error.response?.data?.message || error.message;
      const connectionState = error.response?.data?.connectionState;
      
      setError(
        `Failed to fetch employees: ${errorMessage}${
          connectionState !== undefined ? ` (Database connection state: ${connectionState})` : ''
        }`
      );

      if (error.response?.status === 503) {
        // Database not ready - retry after delay
        if (!retrying) {
          setRetrying(true);
          message.info('Database connection not ready. Retrying in 5 seconds...');
          setTimeout(fetchEmployees, 5000);
        }
      } else {
        message.error('Failed to fetch employees');
      }
    } finally {
      setLoading(false);
    }
  }, [retrying]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const getShiftColor = (shift) => {
    const colors = {
      'Morning': 'green',
      'Day': 'blue',
      'Evening': 'orange',
      'Night': 'purple'
    };
    return colors[shift] || 'default';
  };

  const columns = [
    {
      title: 'Employee ID',
      dataIndex: 'empId',
      key: 'empId',
      sorter: (a, b) => a.empId.localeCompare(b.empId)
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name)
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      sorter: (a, b) => a.age - b.age
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      filters: [
        { text: 'Male', value: 'Male' },
        { text: 'Female', value: 'Female' }
      ],
      onFilter: (value, record) => record.gender === value
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      filters: Array.from(new Set(employees.map(emp => emp.role))).map(role => ({
        text: role,
        value: role
      })),
      onFilter: (value, record) => record.role === value
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      filters: Array.from(new Set(employees.map(emp => emp.department))).map(dept => ({
        text: dept,
        value: dept
      })),
      onFilter: (value, record) => record.department === value
    },
    {
      title: 'Salary',
      dataIndex: 'salary',
      key: 'salary',
      render: (salary) => `₹${salary.toLocaleString()}`,
      sorter: (a, b) => a.salary - b.salary
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone'
    },
    {
      title: 'City',
      dataIndex: 'city',
      key: 'city',
      filters: Array.from(new Set(employees.map(emp => emp.city))).map(city => ({
        text: city,
        value: city
      })),
      onFilter: (value, record) => record.city === value
    },
    {
      title: 'Shift',
      dataIndex: 'shift',
      key: 'shift',
      render: (shift) => (
        <Tag color={getShiftColor(shift)}>
          {shift}
        </Tag>
      ),
      filters: [
        { text: 'Morning', value: 'Morning' },
        { text: 'Day', value: 'Day' },
        { text: 'Evening', value: 'Evening' },
        { text: 'Night', value: 'Night' }
      ],
      onFilter: (value, record) => record.shift === value
    },
    {
      title: 'Join Date',
      dataIndex: 'joinDate',
      key: 'joinDate',
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.joinDate) - new Date(b.joinDate)
    }
  ];

  return (
    <div className="employees-container">
      <Navbar />
      <div className="employees-content">
        <div className="component-header">
          <div className="header-content">
            <h2><FaUsers /> Employee Management</h2>
            {!loading && !error && (
              <Button 
                icon={<FaSync />} 
                onClick={fetchEmployees}
                type="primary"
              >
                Refresh
              </Button>
            )}
          </div>
          {error && (
            <Alert
              message="Error Loading Employees"
              description={error}
              type="error"
              showIcon
              action={
                <Button 
                  icon={<FaSync />}
                  onClick={fetchEmployees}
                  type="primary"
                  loading={retrying}
                >
                  {retrying ? 'Retrying...' : 'Retry'}
                </Button>
              }
            />
          )}
        </div>
        
        <div className="table-container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <Spin size="large" />
              <p>{retrying ? 'Retrying connection...' : 'Loading employees...'}</p>
            </div>
          ) : (
            <Table 
              columns={columns}
              dataSource={employees}
              rowKey="empId"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} employees`
              }}
              scroll={{ x: 1500 }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Employees;
