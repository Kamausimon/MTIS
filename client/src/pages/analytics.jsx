import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

export default function Analytics() {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found');
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:4000/api/v1/analytics/getAnalytics', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAnalyticsData(response.data.data.analytics);
      } catch (err) {
        console.log(err);
        setError('Failed to fetch analytics data');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []); // Run once when the component mounts

  const chartData = {
    labels: analyticsData.map(item => item._id.eventName),
    datasets: [
      {
        label: 'Event Count',
        data: analyticsData.map(item => item.count),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <div className="flex bg-white text-black dark:bg-gray-900 dark:text-white">
        <Sidebar />
        <div className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-4">Analytics Dashboard</h1>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <>
              <Bar data={chartData} />
              <table className="min-w-full bg-white mt-6">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b border-gray-200">Event Name</th>
                    <th className="py-2 px-4 border-b border-gray-200">Count</th>
                    <th className="py-2 px-4 border-b border-gray-200">User Agent</th>
                    <th className="py-2 px-4 border-b border-gray-200">IP Address</th>
                    <th className="py-2 px-4 border-b border-gray-200">Page</th>
                    <th className="py-2 px-4 border-b border-gray-200">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {analyticsData.map((item) => (
                    <tr key={item._id}>
                      <td className="py-2 px-4 border-b border-gray-200">{item.eventName}</td>
                      <td className="py-2 px-4 border-b border-gray-200">{item.count}</td>
                      <td className="py-2 px-4 border-b border-gray-200">{item.userAgent}</td>
                      <td className="py-2 px-4 border-b border-gray-200">{item.ipAddress}</td>
                      <td className="py-2 px-4 border-b border-gray-200">{item.page}</td>
                      <td className="py-2 px-4 border-b border-gray-200">{item.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </div>
  );
}