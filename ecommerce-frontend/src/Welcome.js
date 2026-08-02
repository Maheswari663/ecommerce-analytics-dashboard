import React from 'react';

function Welcome({ username }) {
  return (
    <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
      <h2>👋 Welcome, {username}!</h2>
      <p style={{ color: '#666', fontSize: '16px', marginTop: '15px' }}>
        Thanks for registering. This is your customer account.
      </p>
      <p style={{ color: '#999', fontSize: '14px', marginTop: '10px' }}>
        (Analytics dashboard access is restricted to admin/staff users.)
      </p>
    </div>
  );
}

export default Welcome;