import React, { useEffect, useState } from 'react';
import api from './api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,  ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';

const COLORS = ['#4C72B0', '#55A868', '#C44E52', '#8172B2', '#CCB974'];

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/dashboard-analytics/')
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load dashboard data.');
        setLoading(false);
        console.error(err);
      });
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

return (
    <div className="card">
      <h2>Analytics Dashboard</h2>

      <div className="revenue-box">
        💰 Total Revenue (Completed Orders): ₹{data.total_revenue.toLocaleString()}
      </div>

      <div className="chart-row">
        <div className="chart-box">
          <h3>Top Selling Products</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.top_products}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="quantity" fill="#4C72B0" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h3>Revenue by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.revenue_by_category}
                dataKey="revenue"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(entry) => `${entry.category}: ₹${entry.revenue}`}
              >
                {data.revenue_by_category.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h3>Order Status Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.status_breakdown}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(entry) => `${entry.status}: ${entry.count}`}
              >
                {data.status_breakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;