import React from 'react';
import { Link } from 'react-router-dom';

function Landing() {
  return (
    <div style={{
      minHeight: '85vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      padding: '40px 20px',
      background: 'linear-gradient(135deg, #eef2f8 0%, #f8fafc 100%)',
      borderRadius: '16px',
    }}>
      <div style={{
        fontSize: '70px',
        marginBottom: '15px',
        filter: 'drop-shadow(0 4px 10px rgba(76,114,176,0.3))',
      }}>
        📊
      </div>

      <h1 style={{
        fontSize: '38px',
        fontWeight: '800',
        marginBottom: '12px',
        background: 'linear-gradient(135deg, #4C72B0, #55A868)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}>
        E-commerce Analytics Dashboard
      </h1>

      <p style={{
        fontSize: '17px',
        color: '#5a6b7d',
        maxWidth: '540px',
        marginBottom: '40px',
        lineHeight: '1.6',
      }}>
        Track sales, understand your customers with RFM segmentation,
        forecast revenue using machine learning, and manage your product
        catalog — all in one powerful dashboard.
      </p>

      <div style={{ display: 'flex', gap: '18px', marginBottom: '55px' }}>
        <Link to="/login" style={{
          padding: '14px 36px',
          background: 'linear-gradient(135deg, #4C72B0, #55A868)',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '50px',
          fontWeight: 'bold',
          fontSize: '15px',
          boxShadow: '0 6px 18px rgba(76,114,176,0.35)',
          transition: 'transform 0.2s',
        }}>
          Login →
        </Link>

        <Link to="/register" style={{
          padding: '14px 36px',
          background: 'white',
          color: '#4C72B0',
          textDecoration: 'none',
          borderRadius: '50px',
          fontWeight: 'bold',
          fontSize: '15px',
          border: '2px solid #4C72B0',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        }}>
          Create Account
        </Link>
      </div>

      <div style={{
        display: 'flex',
        gap: '25px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        maxWidth: '700px',
      }}>
        {[
          { icon: '🎯', title: 'RFM Segmentation', desc: 'Identify your best customers' },
          { icon: '📈', title: 'Sales Forecasting', desc: 'ML-powered predictions' },
          { icon: '📦', title: 'Product Catalog', desc: 'Manage inventory with ease' },
          { icon: '🔐', title: 'Secure Access', desc: 'Role-based authentication' },
        ].map((feature, i) => (
          <div key={i} style={{
            background: 'white',
            padding: '20px 18px',
            borderRadius: '14px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
            width: '150px',
          }}>
            <div style={{ fontSize: '30px', marginBottom: '8px' }}>{feature.icon}</div>
            <h4 style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#2c3e50' }}>{feature.title}</h4>
            <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Landing;