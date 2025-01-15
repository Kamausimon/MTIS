import React, { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';


export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:4000/api/v1/products/allProducts', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProducts(response.data.data.products || []);
      } catch (err) {
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleEdit = (productId) => {
    navigate(`/products/edit/${productId}`);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:4000/api/v1/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(products.filter((product) => product._id !== productId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete product');
  };}

  return (
    <div className="flex bg-white text-black dark:bg-gray-900 dark:text-white">

      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p>Welcome to your products page. </p>
        <Link to="/profile" className="text-blue-500 hover:underline">Go to Profile</Link>

        {loading ? (
          <p>Loading products...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="mt-6 "> 
          <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold mb-4">Products</h2> 
            <Link to="/products/create" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Create Product
          </Link>
          </div>
       
            <ul className="space-y-4">
              {products.length > 0 ? (
                products.map((product) => (
                  <li key={product._id} className="p-4 border rounded-md shadow-sm">
                    <h3 className="text-xl font-semibold">{product.name}</h3>
                    <p>Description:{product.description}</p>
                    <p>Price: ksh {product.price}</p>
                    <p>Stock: {product.stock}</p>
                    {product.stock < product.low_stock_threshold && (
                      <p className="text-red-500">Low stock</p>
                    )}
                    {product.image_url && (
                      <img src={product.image_url} alt={product.name} className="w-32 h-32 object-contain rounded-md mt-2" />
                    )}
                    <div className='mt-4 flex space-x-4'>
                      <button onClick={() => handleEdit(product._id)} className="bg-blue-500 text-white px-4 py-2 rounded-md">
                        Edit
                      </button>

                        <button onClick={() => handleDelete(product._id)} className="bg-red-500 text-white px-4 py-2 rounded-md">
                        Delete
                        </button>
                    </div>
                  </li>
                ))
              ) : (
                <p>No products found</p>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}