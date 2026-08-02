import React, { useState } from 'react';
import api from './api';
import { useNavigate, Link } from 'react-router-dom';

function Register({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    api.post('/register/', { username, password, phone, address })
      .then((response) => {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('username', response.data.username);
        localStorage.setItem('isStaff', response.data.is_staff);
        onLoginSuccess(response.data.username, response.data.is_staff);
        navigate('/');
      })
      .catch((err) => {
        setError(err.response?.data?.error || 'Registration failed');
      });
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '85vh',
    }}>
      <form onSubmit={handleSubmit} style={{
        background: 'white',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        width: '320px',
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '25px' }}>📝 Create Account</h2>

        {error && <p style={{ color: '#C44E52', fontSize: '14px' }}>{error}</p>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{
            width: '100%', padding: '10px', marginBottom: '12px',
            border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box',
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: '100%', padding: '10px', marginBottom: '12px',
            border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box',
          }}
        />

        <input
          type="text"
          placeholder="Phone (optional)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{
            width: '100%', padding: '10px', marginBottom: '12px',
            border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box',
          }}
        />

        <input
          type="text"
          placeholder="Address (optional)"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={{
            width: '100%', padding: '10px', marginBottom: '20px',
            border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box',
          }}
        />

        <button type="submit" style={{
          width: '100%', padding: '12px', background: '#55A868', color: 'white',
          border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer',
          fontSize: '15px',
        }}>
          Register
        </button>

        <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '13px' }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;