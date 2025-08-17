import React, { createContext, useState, useContext, useEffect, useCallback, useMemo } from 'react';
import { Routes, Route, Navigate, HashRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GOOGLE_CLIENT_ID } from './config/auth.config';
import Dashboard from './Dashbord/Dashboard.js';
import POS from './Components/POS/POS.js';
import Inventory from './Components/Inventory/Inventory.js';
import Sales from './Components/sales/Sales.jsx';
import Employees from './Components/Employees/Employees.js';
import Reports from './Components/Reports/Reports.js';
import Settings from './Components/Settings/Settings.js';
import Billing from './Components/Billing/Billing.js';
import Products from './Components/Products/Products.js';
import Login from './Components/Login/Login.js';
import Signup from './Components/Signup/Signup';
import Profile from './Components/Profile/Profile';
import Home from './Components/Home';
import ErrorBoundary from './Components/shared/ErrorBoundary';
import About from './Components/About/About';
import Team from './Components/Team/Team';
import Contact from './Components/Contact/Contact';
import './App.css';

// Helper functions
const getTodayKey = () => new Date().toISOString().split('T')[0];

const safeNumberFormat = (number, decimals = 2) => {
  if (number === 0) return '0.00';
  if (number == null) return '0.00';
  try {
    const parsed = parseFloat(String(number).replace(/[^\d.-]/g, ''));
    if (!Number.isFinite(parsed)) return '0.00';
    return parsed.toFixed(decimals);
  } catch {
    return '0.00';
  }
};

const loadTodaySales = () => {
  try {
    const today = getTodayKey();
    const saved = localStorage.getItem(`sales_${today}`);
    return saved ? Number(saved) : 0;
  } catch {
    return 0;
  }
};

// Sales Context
const SalesContext = createContext({
  todaySales: 0,
  updateTodaySales: () => console.log('Default context used - not initialized')
});

const useSales = () => {
  const context = useContext(SalesContext);
  if (!context) {
    console.warn('Sales context not found - check provider');
    return { todaySales: 0, updateTodaySales: () => {} };
  }
  return context;
};

const SalesProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [todaySales, setTodaySales] = useState(() => {
    try {
      return loadTodaySales();
    } catch (err) {
      setError(err);
      return 0;
    }
  });

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const updateTodaySales = useCallback((amount, isAbsolute = false) => {
    setTodaySales(prev => {
      const newTotal = isAbsolute ? Number(safeNumberFormat(amount)) : prev + Number(safeNumberFormat(amount));
      const finalAmount = Number(safeNumberFormat(newTotal));
      const today = getTodayKey();
      localStorage.setItem(`sales_${today}`, String(finalAmount));
      return finalAmount;
    });
  }, []);

  const value = useMemo(() => ({
    todaySales,
    updateTodaySales
  }), [todaySales, updateTodaySales]);

  useEffect(() => {
    const today = getTodayKey();
    const checkDate = () => {
      const now = getTodayKey();
      if (now !== today) {
        setTodaySales(0);
        localStorage.setItem(`sales_${now}`, '0');
      }
    };
    const interval = setInterval(checkDate, 60000);
    return () => clearInterval(interval);
  }, []);

  if (error) return <div>Error loading sales data. Please refresh.</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <SalesContext.Provider value={value}>
      {children}
    </SalesContext.Provider>
  );
};

// Auth Helper
const isAuthenticated = () => localStorage.getItem('isAuthenticated') === 'true';

// Protected Route
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  return children;
};

const App = () => {
  return (
    <ErrorBoundary>
      <HashRouter>
        <GoogleOAuthProvider 
        clientId={GOOGLE_CLIENT_ID}
        onScriptLoadError={() => {
          console.error('Failed to load Google OAuth script');
        }}
        onScriptLoadSuccess={() => {
          console.log('Google OAuth script loaded successfully');
        }}
      >
        <SalesProvider>
          <div className="App">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="/about" element={<About />} />
                <Route path="/team" element={<Team />} />
                <Route path="/contact" element={<Contact />} />
                <Route
                  path="/pos"
                  element={
                    <ProtectedRoute>
                      <POS />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/inventory"
                  element={
                    <ProtectedRoute>
                      <Inventory />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/sales"
                  element={
                    <ProtectedRoute>
                      <Sales />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/employees"
                  element={
                    <ProtectedRoute>
                      <Employees />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reports"
                  element={
                    <ProtectedRoute>
                      <Reports />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/billing"
                  element={
                    <ProtectedRoute>
                      <Billing />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/products"
                  element={
                    <ProtectedRoute>
                      <Products />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </div>
        </SalesProvider>
      </GoogleOAuthProvider>
      </HashRouter>
    </ErrorBoundary>
  );
};

export { safeNumberFormat, useSales };
export default App;
