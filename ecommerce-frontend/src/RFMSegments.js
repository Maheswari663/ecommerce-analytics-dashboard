import React, { useEffect, useState } from 'react';
import api from './api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

const SEGMENT_COLORS = {
  'Champion / High Value': '#55A868',
  'Loyal Customer': '#4C72B0',
  'At Risk': '#DD8452',
  'Lost Customer': '#C44E52',
};

function RFMSegments() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/rfm-segments/')
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load RFM data.');
        setLoading(false);
        console.error(err);
      });
  }, []);

  if (loading) return <p>Loading RFM analysis...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!data || data.segments.length === 0) return <p>No completed orders found for RFM analysis.</p>;

  return (
    <div className="card">
      <h2>🎯 RFM Customer Segmentation</h2>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px' }}>
        {/* Segment Summary Chart */}
        <div style={{ width: '500px' }}>
          <h3>Customer Segments</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.summary}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="segment" angle={-15} textAnchor="end" height={70} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count">
                {data.summary.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={SEGMENT_COLORS[entry.segment] || '#8884d8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Customer-wise Table */}
      <h3 style={{ marginTop: '30px' }}>Customer Details</h3>
      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%', maxWidth: '800px' }}>
        <thead>
          <tr>
            <th>Customer</th>
            <th>Recency (days)</th>
            <th>Frequency</th>
            <th>Monetary (₹)</th>
            <th>RFM Score</th>
            <th>Segment</th>
          </tr>
        </thead>
        <tbody>
          {data.segments.map((row, index) => (
            <tr key={index}>
              <td>{row.customer}</td>
              <td>{row.recency}</td>
              <td>{row.frequency}</td>
              <td>{row.monetary.toLocaleString()}</td>
              <td>{row.RFM_score}</td>
              <td style={{ color: SEGMENT_COLORS[row.segment] || '#000', fontWeight: 'bold' }}>
                {row.segment}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RFMSegments;