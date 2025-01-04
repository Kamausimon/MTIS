import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const Sidebar = () => {
  const location = useLocation();
  const [role, setRole] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setRole(decodedToken.role); // Assuming the role is stored in the token
    }
  }, []);

  const links = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/profile', label: 'Profile' },
    { to: '/products', label: 'Products' },
    { to: '/supplies', label: 'Supplies' },
    { to: '/categories', label: 'Categories' },
    { to: '/settings', label: 'Settings' },
    { to: '/analytics', label: 'Analytics', roles: ['admin', 'manager'] },
    { to: '/orders', label: 'Orders', roles: ['admin', 'manager'] },
    { to: '/logout', label: 'Logout' },
  ];

  return (
    <div className="h-screen bg-gray-800 text-white w-64 flex flex-col sticky top-0">
      <div className="flex items-center justify-center h-16 bg-gray-900">
        <h1 className="text-2xl font-bold">MTIS</h1>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-2">
        {links.map((link) => {
          if (link.roles && !link.roles.includes(role)) {
            return null;
          }
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`block px-4 py-2 rounded-md text-sm font-medium ${
                location.pathname === link.to
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;