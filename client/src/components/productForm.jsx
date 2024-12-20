// src/components/ProductForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function ProductForm({ mode }) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    categoryId: '',
    stock: '',
    low_stock_threshold: '',
    image_url: ''
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (mode === 'edit' && id) {
      const fetchProduct = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`http://localhost:4000/api/v1/products/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setFormData(response.data.data.product);
        } catch (err) {
          setError('Failed to fetch product');
        }
      };

      fetchProduct();
    }
  }, [mode, id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange= async (e) => {
    const file = e.target.files[0];
    if(!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try{
       const token = localStorage.getItem('token');
         const response = await axios.post('http://localhost:4000/api/v1/products/upload', formData, {
            headers: { Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',}
         }); setFormData({
              ...formData,
              image_url: response.data.data.imageUrl
         })
      }catch(err){
     setError(err.response?.data?.message || 'Failed to upload image');
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (mode === 'create') {
        await axios.post('http://localhost:4000/api/v1/products', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.patch(`http://localhost:4000/api/v1/products/${id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      navigate('/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6">{mode === 'create' ? 'Create Product' : 'Edit Product'}</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
            <label className='block text-sm font-medium text-gray-700'>description</label>
            <input 
            type='text'
            name='description'
            value={formData.description}
            onChange={handleChange}
            required
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
            />
        </div>
  
    <div>
            <label className="block text-sm font-medium text-gray-700">categoryId</label>
            <select
              type="text"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              <option value="">Select Category</option>
                

                </select>
    </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Stock</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Low Stock Threshold</label>
          <input
            type="number"
            name="low_stock_threshold"
            value={formData.low_stock_threshold}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
  

        <div>
            <label className="block text-sm font-medium text-gray-700">Image upload</label>
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Saving...' : 'Save Product'}
        </button>
      </form>
    </div>
  );
}