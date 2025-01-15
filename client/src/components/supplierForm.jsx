import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import Multiselect from 'multiselect-react-dropdown';

export default function SupplierForm() {
  const [formData, setFormData] = useState({
    name: '',
    contact_name: '',
    email: '',
    address: '',
    city: '',
    phone: '',
    website: '',
    products: [],
    notes: ''
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:4000/api/v1/products/allProducts', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(response.data.data.products || []);
      } catch (err) {
        console.log('error fetching products', err);
        setError('Failed to fetch products');
      }
    };
    fetchProducts();
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'products') {
      const selectedProducts = Array.from(e.target.selectedOptions, option => option.value);
      setFormData({ ...formData, [name]: selectedProducts });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const multiselectOptions = products.map((product) => ({ name: product.name, id: product._id }));

  const handleChangeMultiSelect = (selectedList) => {
    const selectedProductIds = selectedList.map((product) => product.id);
    setFormData({ ...formData, products: selectedProductIds });
  };
  


  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const decodedToken = jwtDecode(token);
        const businessCode = decodedToken.businessCode;
        const transformedProducts = formData.products.map((product) => ({Product_id: product}));
        const dataToSend  = {businessCode, ...formData, products: transformedProducts};
      const response = await axios.post('http://localhost:4000/api/v1/suppliers/createSupplier', dataToSend, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response.data);
      navigate('/suppliers'); // Redirect to suppliers page after successful submission
    } catch (err) {
      console.log('error creating supplier', err);
      setError('Failed to create supplier');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
            
    <div>
            <label htmlFor="contact_name" className="block text-sm font-medium text-gray-700">Contact Name</label>
            <input
              type="text"
              name="contact_name"
              id="contact_name"
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              value={formData.contact_name}
              onChange={handleChange}
              ></input>
    </div>

           <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              value={formData.email}
              onChange={handleChange}
              ></input>
           </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
          <input
            type="text"
            name="address"
            id="address"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
          <input
            type="text"
            name="city"
            id="city"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="text"
            name="phone"
            id="phone"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="website" className="block text-sm font-medium text-gray-700">Website</label>
          <input
            type="text"
            name="website"
            id="website"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            value={formData.website}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="products" className="block text-sm font-medium text-gray-700">Products</label>
          <Multiselect
  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
  style={{
    chips: { background: '#4CAF50', color: '#fff' },
    searchBox: { background: 'transparent', color: '#000' },
    option:{background: '#fff', color: '#000'},
}}
  isObject={true}
  options={multiselectOptions}
  selectedValues= { formData.products.map((productId) => {
    const product = products.find((p) => p._id === productId);
    return product ? { name: product.name, id: product._id } : null;
  }).filter(Boolean)}
  onSelect={handleChangeMultiSelect}
  onRemove={handleChangeMultiSelect}
  displayValue="name"
/>

        </div>
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
          <input
            type="text"
            name="notes"
            id="notes"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            value={formData.notes}
            onChange={handleChange}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Saving...' : 'Create Supplier'}
        </button>
      </form>
      {error && <p className="text-red-500">{error}</p>}
      {loading && <p>Loading...</p>}
    </div>
  );
}