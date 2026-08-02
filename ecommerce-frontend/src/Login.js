import React, { useState } from 'react';
import api from './api';
import { useNavigate, Link } from 'react-router-dom';

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    api.post('/login/', { username, password })
      .then((response) => {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('username', response.data.username);
        localStorage.setItem('isStaff', response.data.is_staff);
        onLoginSuccess(response.data.username, response.data.is_staff);
        navigate('/');
      })
      .catch((err) => {
        setError('Invalid username or password');
      });
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '80vh',
    }}>
      <form onSubmit={handleSubmit} style={{
        background: 'white',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        width: '320px',
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '25px' }}>🔐 Login</h2>

        {error && <p style={{ color: '#C44E52', fontSize: '14px' }}>{error}</p>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{
            width: '100%', padding: '10px', marginBottom: '15px',
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
            width: '100%', padding: '10px', marginBottom: '20px',
            border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box',
          }}
        />

        <button type="submit" style={{
          width: '100%', padding: '12px', background: '#4C72B0', color: 'white',
          border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer',
          fontSize: '15px',
        }}>
          Login
        </button>

        <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '13px' }}>
          New here? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;