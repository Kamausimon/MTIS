import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const url = process.env.REACT_APP_API_URL;

export default function Settings() {
  const [settings, setSettings] = useState({
    profile: {
      username: '',
      email: '',
    },
    notifications: {
      emailNotifications: false,
      smsNotifications: false,
    },
    privacy: {
      showProfilePicture: true,
      showLastSeen: false,
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found');
          setLoading(false);
          return;
        }
        const decodedToken = jwtDecode(token);
        const businessCode = decodedToken.businessCode;
        const response = await axios.get(`${url}/api/v1/settings/getSettings`, {
          headers: { Authorization: `Bearer ${token}`, businessCode },
        });
        setSettings(response.data.data);
      } catch (err) {
        console.log(err);
        setError('Failed to fetch settings');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (section, name, value) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [section]: {
        ...prevSettings[section],
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (section) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${url}/api/v1/settings/${section}`, settings[section], {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Settings updated successfully');
    } catch (err) {
      console.log(err);
      setError('Failed to update settings');
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div>
      <div className="flex bg-white text-black dark:bg-gray-900 dark:text-white">
        <Sidebar />
        <div className="flex-1 p-6">
          <h1 className="text-3xl font-bold mb-4">Settings</h1>
          <p>Welcome to your settings page.</p>
          <Link to="/profile" className="text-blue-500 hover:underline">Go to Profile</Link>

          <div className="mt-6">
            <h2 className="text-2xl font-bold mb-4">Profile Settings</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit('profile'); }}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  name="username"
                  value={settings.profile.username}
                  onChange={(e) => handleChange('profile', e.target.name, e.target.value)}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={settings.profile.email}
                  onChange={(e) => handleChange('profile', e.target.name, e.target.value)}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
              </div>
              <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">Save Profile Settings</button>
            </form>
          </div>

          <div className="mt-6">
            <h2 className="text-2xl font-bold mb-4">Notification Settings</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit('notifications'); }}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Email Notifications</label>
                <input
                  type="checkbox"
                  name="emailNotifications"
                  checked={settings.notifications.emailNotifications}
                  onChange={(e) => handleChange('notifications', e.target.name, e.target.checked)}
                  className="mt-1"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">SMS Notifications</label>
                <input
                  type="checkbox"
                  name="smsNotifications"
                  checked={settings.notifications.smsNotifications}
                  onChange={(e) => handleChange('notifications', e.target.name, e.target.checked)}
                  className="mt-1"
                />
              </div>
              <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">Save Notification Settings</button>
            </form>
          </div>

          <div className="mt-6">
            <h2 className="text-2xl font-bold mb-4">Privacy Settings</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit('privacy'); }}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Show Profile Picture</label>
                <input
                  type="checkbox"
                  name="showProfilePicture"
                  checked={settings.privacy.showProfilePicture}
                  onChange={(e) => handleChange('privacy', e.target.name, e.target.checked)}
                  className="mt-1"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Show Last Seen</label>
                <input
                  type="checkbox"
                  name="showLastSeen"
                  checked={settings.privacy.showLastSeen}
                  onChange={(e) => handleChange('privacy', e.target.name, e.target.checked)}
                  className="mt-1"
                />
              </div>
              <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">Save Privacy Settings</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}