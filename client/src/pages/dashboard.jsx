import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Link } from 'react-router-dom';
import ThemeToggle from '../components/themeToggle';
import axios from 'axios';

const url = process.env.REACT_APP_API_URL;
console.log(url);

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    totalSuppliers: 0,
    totalSupplies: 0,
    totalOrders: 0,
    totalProducts: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found');
          setLoading(false);
          return;
        }

        const response = await axios.get(`${url}/api/v1/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setMetrics(response.data.data.metrics);
        setRecentActivities(response.data.data.recentActivities);
      } catch (err) {
        console.log(err);
        setError('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="flex bg-white text-black dark:bg-gray-900 dark:text-white">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p>Welcome to your dashboard. Here you can manage your inventory, view reports, and more.</p>
            <Link to="/profile" className="text-blue-500 hover:underline">Go to Profile</Link>
          </div>
          <div>
            <ThemeToggle />
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-4">Key Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
              <h3 className="text-xl font-semibold">Total Suppliers</h3>
              <p className="text-2xl">{metrics.totalSuppliers}</p>
            </div>
            <div>
              <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
                <h3 className="text-xl font-semibold">Total Supplies</h3>
                <p className="text-2xl">{metrics.totalSupplies}</p>
              </div>
            </div>
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
              <h3 className="text-xl font-semibold">Total Orders</h3>
              <p className="text-2xl">{metrics.totalOrders}</p>
            </div>
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
              <h3 className="text-xl font-semibold">Total Products</h3>
              <p className="text-2xl">{metrics.totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
          <ul className="space-y-4">
            {recentActivities.map((activity, index) => (
              <li key={index} className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
                {activity}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}