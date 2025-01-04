import React, { useEffect, useState } from 'react';
import Sidebar from '../components/sidebar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found');
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:4000/api/v1/categories/allCategories', {
          headers: { Authorization: `Bearer ${token}` },
        });
     const childCategories = response.data.data;
     const filtered = childCategories.filter((category) => category.level === 1);

        if (Array.isArray(response.data.data)) {
          setCategories(filtered || []);
        } else {
          setError('Failed to fetch categories');
        }
      } catch (err) {
        console.log(err);
        setError('Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleClick = () => {
  navigate('/createCategory');
  }

  return (
    <div>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6">
          <h1 className="text-3xl font-bold mb-4">Create Custom Categories</h1>
          <p className="text-sm">Welcome to your categories page.</p>
          <p className="text-sm mb-4">Here you can view all categories and create custom categories.</p>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <>
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b border-gray-200">Name</th>
                    <th className="py-2 px-4 border-b border-gray-200">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category._id}>
                      <td className="py-2 px-4 border-b border-gray-200">{category.name}</td>
                      <td className="py-2 px-4 border-b border-gray-200">{category.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button onClick={()=>handleClick()}  
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Create custom Category
              </button>
           
            </>
          )}
        </div>
      </div>
    </div>
  );
}