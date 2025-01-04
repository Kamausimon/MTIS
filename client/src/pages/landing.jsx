import React from 'react';
import { Link } from 'react-router-dom';
import Footer from './Footer';
import Logger from '../components/logger';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200">
      <Logger eventName='page_view' eventData={{page: 'landing'}} />
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-slate-800">MTIS</h1>
            </div>
            <div className="flex space-x-4">
              <Link to="/login" className="text-slate-700 hover:bg-slate-100 px-3 py-2 rounded-md">Login</Link>
              <Link to="/signup" className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md">Sign Up</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-slate-900 sm:text-5xl md:text-6xl">
            <span className="block">Manage Your Business</span>
            <span className="block text-blue-600">Like Never Before</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-slate-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Streamline your business operations with our powerful inventory management system.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link to="/signup" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="p-6 border rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-slate-900">Real-time Tracking</h3>
              <p className="mt-2 text-slate-500">Monitor your inventory levels in real-time with advanced analytics.</p>
            </div>
            {/* Feature 2 */}
            <div className="p-6 border rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-slate-900">Smart Alerts</h3>
              <p className="mt-2 text-slate-500">Get notified when stock levels are low or need attention.</p>
            </div>
            {/* Feature 3 */}
            <div className="p-6 border rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-slate-900">Easy Integration</h3>
              <p className="mt-2 text-slate-500">Seamlessly connect with your existing business tools.</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}