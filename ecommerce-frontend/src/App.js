import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation, Navigate } from 'react-router-dom';
import './App.css';
import ProductList from './ProductList';
import Dashboard from './Dashboard';
import RFMSegments from './RFMSegments';
import SalesPrediction from './SalesPrediction';
import Login from './Login';
import Register from './Register';
import Welcome from './Welcome';
import Landing from './Landing';


function NavBar({ username, isStaff, onLogout }) {
  const location = useLocation();

  const linkStyle = (path) => ({
    color: location.pathname === path ? '#6C5CE7' : '#6B7280',
    textDecoration: 'none',
    padding: '9px 18px',
    borderRadius: '10px',
    fontWeight: '600',
    fontSize: '14px',
    backgroundColor: location.pathname === path ? '#F0EEFF' : 'transparent',
  });

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '8px',
      background: '#FFFFFF',
      padding: '14px 20px',
      flexWrap: 'wrap',
      boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
    }}>
      {isStaff ? (
        <>
          <Link to="/" style={linkStyle('/')}>📊 Dashboard</Link>
          <Link to="/rfm" style={linkStyle('/rfm')}>🎯 RFM Segments</Link>
          <Link to="/prediction" style={linkStyle('/prediction')}>📈 Sales Prediction</Link>
          <Link to="/products" style={linkStyle('/products')}>📦 Products</Link>
        </>
      ) : (
        <Link to="/" style={linkStyle('/')}>🏠 Home</Link>
      )}
      <span style={{ marginLeft: '20px', color: '#9CA3AF', fontSize: '14px' }}>👤 {username}</span>
      <button onClick={onLogout} style={{
        background: '#FEF2F2',
        color: '#DC2626',
        border: 'none',
        padding: '8px 18px',
        borderRadius: '10px',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '13px',
      }}>
        Logout
      </button>
    </nav>
  );
}

function App() {
  const [username, setUsername] = React.useState(localStorage.getItem('username'));
  const [isStaff, setIsStaff] = React.useState(localStorage.getItem('isStaff') === 'true');

  const handleLoginSuccess = (name, staffStatus) => {
    setUsername(name);
    setIsStaff(staffStatus);
  };

  const onLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    localStorage.removeItem('isStaff');
    setUsername(null);
    setIsStaff(false);
  };

  return (
    <Router>
      <header className="app-header">
        <h1>E-commerce Analytics Dashboard</h1>
      </header>

      {username && <NavBar username={username} isStaff={isStaff} onLogout={onLogout} />}

      <div className="section-container">
        <Routes>
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/register" element={<Register onLoginSuccess={handleLoginSuccess} />} />

          <Route path="/" element={!username ? <Landing /> : isStaff ? <Dashboard /> : <Welcome username={username} />} />
          <Route path="/rfm" element={
            username && isStaff ? <RFMSegments /> : <Navigate to="/" />
          } />
          <Route path="/prediction" element={
            username && isStaff ? <SalesPrediction /> : <Navigate to="/" />
          } />
          <Route path="/products" element={
            username && isStaff ? <ProductList /> : <Navigate to="/" />
          } />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;