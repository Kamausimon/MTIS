// src/pages/Dashboard.jsx
import React from 'react';
import Sidebar from '../components/sidebar';
import { Link } from 'react-router-dom';
import Logger from '../components/logger';
import ThemeToggle from '../components/themeToggle';

export default function Dashboard() {
  return (
    <div className="flex bg-white text-black dark:bg-gray-900 dark:text-white">
   <Logger eventName='page_view' eventData={{page: 'dashboard'}} />
      <Sidebar />
      <div className="flex-1 p-6">
           <div className='flex justify-between items-center'>
           <div>
           <h1 className="text-3xl font-bold">Dashboard</h1>
        <p>Welcome to your dashboard. Here you can manage your inventory, view reports, and more.</p>
        <Link to="/profile" className="text-blue-500 hover:underline">Go to Profile</Link>
           </div>
           <div>
            <ThemeToggle />
           </div>
           </div>
      </div>
    </div>
  );
}