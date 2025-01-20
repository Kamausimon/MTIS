import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export default function Profile() {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    role: '',
    businessCode: ''
  });
  const [passwordData, setPasswordData] = useState({
    passwordCurrent: '',
    password: '',
    passwordConfirm: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
//   const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const decodedToken = jwtDecode(token);
      const id = decodedToken.id;
      const response = await axios.get(`http://localhost:4000/api/v1/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserData(response.data.data.user);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch user data');
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        'http://localhost:4000/api/v1/users/updateMe',
        userData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Profile updated successfully');
      setUserData(response.data.data.user);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        'http://localhost:4000/api/v1/users/updatePassword',
        passwordData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    
      setSuccess('Password updated successfully');
      setPasswordData({
        passwordCurrent: '',
        password: '',
        passwordConfirm: ''
      });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Password update failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4 sm:px-6 lg:px-8  dark:bg-gray-900 dark:text-white">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Profile Details</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
              {success}
            </div>
          )}

          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={userData.name}
                onChange={(e) => setUserData({...userData, name: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={userData.email}
                disabled
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Business Code</label>
              <input
                type="text"
                value={userData.businessCode}
                disabled
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm"
                readOnly
              />
            </div>
          
          </form>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Change Password</h2>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Current Password</label>
              <input
                type="password"
                value={passwordData.passwordCurrent}
                onChange={(e) => setPasswordData({...passwordData, passwordCurrent: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                value={passwordData.password}
                onChange={(e) => setPasswordData({...passwordData, password: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
              <input
                type="password"
                value={passwordData.passwordConfirm}
                onChange={(e) => setPasswordData({...passwordData, passwordConfirm: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}