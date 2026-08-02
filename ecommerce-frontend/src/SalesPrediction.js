import React, { useEffect, useState } from 'react';
import api from './api';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

function SalesPrediction() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/sales-prediction/')
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load prediction data.');
        setLoading(false);
        console.error(err);
      });
  }, []);

  if (loading) return <p>Loading prediction...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (data.error) return <p style={{ color: '#DD8452' }}>{data.error}</p>;

  // Actual + Predicted data ని ఒకే chart కి కలపడం
  const combined = [
    ...data.actual.map((d) => ({ date: d.date, actual: d.revenue, predicted: null })),
    ...data.predicted.map((d) => ({ date: d.date, actual: null, predicted: d.revenue })),
  ];

  return (
    <div className="card">
      <h2>📈 Sales Prediction (Next 7 Days)</h2>
      <p style={{ color: '#666' }}>
        Trend: <strong style={{ color: data.trend === 'increasing' ? '#55A868' : '#C44E52' }}>
          {data.trend === 'increasing' ? '📈 Increasing' : '📉 Decreasing'}
        </strong>
      </p>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={combined}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" angle={-30} textAnchor="end" height={70} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="actual" stroke="#4C72B0" strokeWidth={2} name="Actual Revenue" connectNulls />
          <Line type="monotone" dataKey="predicted" stroke="#DD8452" strokeWidth={2} strokeDasharray="5 5" name="Predicted Revenue" connectNulls />
        </LineChart>
      </ResponsiveContainer>

      <p style={{ fontSize: '13px', color: '#999', marginTop: '10px' }}>
        * Prediction based on Linear Regression using historical daily revenue data.
      </p>
    </div>
  );
}

export default SalesPrediction;