import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const url = process.env.REACT_APP_API_URL;

export default function EditOrder() {
  const [formData, setFormData] = useState({
    order_number: '',
    order_date: '',
    order_status: '',

  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found. Please log in again.');
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${url}/api/v1/orders/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFormData(response.data.data.oneOrder || {});
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch the order. Please try again later.');
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { order_number, order_date, order_status} = formData;

    if (!order_number || !order_date || !order_status ) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `${url}/api/v1/orders/${id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.status === 'success') {
        navigate(`/viewOrder/${id}`);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to update order. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDate = () => {
    const date  = new Date();
    return date.toISOString().split('T')[0];
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Order</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Order Number:
              <input
                type="text"
                name="order_number"
                value={formData.order_number || ''}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Order Date:
              <input
                type="date"
                name="order_date"
                value={handleDate(formData.order_date) || ''}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status:
            <select value={formData.order_status} name="order_status" onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
            </select>
            </label>
          </div>
   
          <button
            type="submit"
            disabled={loading}
            className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Saving...' : 'Update Order'}
          </button>
        </form>
      )}
    </div>
  );
}
