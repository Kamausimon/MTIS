import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import {jwtDecode}from 'jwt-decode';

export default function ProductForm({ mode }) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    categoryId: '',
    stock: '',
    low_stock_threshold: '',
    image_url: '',
    businessCode: '',
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setFormData((prevFormData) => ({
        ...prevFormData,
        businessCode: decodedToken.businessCode,
      }));
    }

    const fetchCategories = async () => {
      try {
          const token = localStorage.getItem('token');
          const response = await axios.get('http://localhost:4000/api/v1/categories/allCategories', {
          headers: { Authorization:  `Bearer ${token}` }
          });
         const childCategories = response.data.data;
         const filtered = childCategories.filter((category) => category.level === 1);

          if(Array.isArray(response.data.data)){
          setCategories(filtered || []);} else{
          
              setError('Failed to fetch categories');
          }
      } catch (err) {
          console.log('error fetching categories', err);
          setError('Failed to fetch categories');
      }
  };

  fetchCategories();


    if (mode === 'edit' && id) {
      const fetchProduct = async () => {
        try {
          const response = await axios.get(`http://localhost:4000/api/v1/products/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
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
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const token = localStorage.getItem('token');
    const fileName = encodeURIComponent(file.name);
    const fileType = encodeURIComponent(file.type);

    console.log('token', token);
    console.log('fileName', fileName);
    console.log('fileType', fileType);

    try {
      // Step 1: Request pre-signed URL from backend
      const token = localStorage.getItem('token');
      const presignedUrlResponse = await axios.get('http://localhost:4000/api/v1/presigned-url', {
        headers: { Authorization: `Bearer ${token}` },
        params: { filename: file.name, fileType: file.type },
      });

      const { url, key } = presignedUrlResponse.data;

      // Step 2: Upload file to S3 using pre-signed URL
      await axios.put(url, file, {
        headers: { 'Content-Type': file.type },
      });

      // Step 3: Update formData with the S3 object key or URL
      setFormData((prev) => ({
        ...prev,
        image_url: key, // Or the full S3 URL if preferred
      }));
      console.log('Image uploaded successfully:', key);
    } catch (err) {
      console.error('Error uploading image:', err);
      console.error('Error uploading image:', err.response);
      setError('Failed to upload image');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.description || !formData.categoryId || !formData.stock || !formData.low_stock_threshold) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (mode === 'create') {
        await axios.post(
          'http://localhost:4000/api/v1/products/create',
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.patch(
          `http://localhost:4000/api/v1/products/${id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      navigate('/products');
    } catch (err) {
      console.error('Error saving product:', err);
      setError('Failed to save product');
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
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
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
          <label className="block text-sm font-medium text-gray-700">Image Upload</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
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
