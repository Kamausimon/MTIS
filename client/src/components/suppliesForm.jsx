import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Multiselect from 'multiselect-react-dropdown';
import {jwtDecode} from 'jwt-decode';

export default function SuppliesForm() {
    const [formData, setFormData] = useState({
        supplierId: '',
        products: [],
        quantity: '',
        price: '',
        date: '',
        businessCode: ''
    });

    const [suppliers, setSuppliers] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:4000/api/v1/suppliers/getAllSuppliers', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setSuppliers(response.data.data.suppliers || []);
            } catch (err) {
                console.error('Error fetching suppliers:', err.response?.data || err.message);
                setError(err.response?.data?.message || 'Failed to fetch suppliers');
            }
        };
        fetchSuppliers();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:4000/api/v1/products/allProducts', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setProducts(response.data.data.products || []);
            } catch (err) {
                console.error('Error fetching products:', err.response?.data || err.message);
                setError(err.response?.data?.message || 'Failed to fetch products');
            }
        };
        fetchProducts();
    }, []);

    const multiselectOptions = products.map((product) => ({ name: product.name, id: product._id }));

    const handleChangeMultiSelect = (selectedList) => {
        const selectedProductIds = selectedList.map((product) => product.id);
        setFormData((prevFormData) => ({ ...prevFormData, products: selectedProductIds }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.supplierId || !formData.products.length || !formData.quantity || !formData.price || !formData.date) {
            setError('All fields are required.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const decodedToken = jwtDecode(token);
            const businessCode = decodedToken.businessCode;
            const dataToSend = { businessCode, ...formData };
            const response = await axios.post('http://localhost:4000/api/v1/supplies/registerSupply', dataToSend, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log(response);
            navigate('/supplies');
        } catch (err) {
            console.error('Error creating supply:', err.response?.data || err.message);
            setError(err.response?.data?.message || 'Failed to create supply');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSubmit} className='space-y-4'>
                <div className='mt-1 p-2 w-full border border-gray-300 rounded-md'>
                    <label htmlFor='supplierId'>Supplier</label>
                    <select name='supplierId' id='supplierId' onChange={handleChange} value={formData.supplierId} required>
                        <option value=''>Select Supplier</option>
                        {suppliers.map((supplier) => (
                            <option key={supplier._id} value={supplier._id}>
                                {supplier.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor='productId'>Product</label>
                    <Multiselect
                        className='mt-1 p-2 w-full border border-gray-300 rounded-md'
                        isObject={true}
                        selectedValues={formData.products.map((productId) => {
                            const product = products.find((p) => p._id === productId);
                            return product ? { name: product.name, id: product._id } : null;
                        }).filter(Boolean)}
                        options={multiselectOptions}
                        displayValue="name"
                        onSelect={handleChangeMultiSelect}
                        onRemove={handleChangeMultiSelect}
                    />
                </div>

                <div>
                    <label htmlFor='quantity' className='block text-sm font-medium text-gray-700'>Quantity</label>
                    <input className="mt-1 p-2 w-full border border-gray-300 rounded-md" type='number' name='quantity' id='quantity' onChange={handleChange} value={formData.quantity} required />
                </div>

                <div>
                    <label htmlFor='price' className='block text-sm font-medium text-gray-700'>Price</label>
                    <input className="mt-1 p-2 w-full border border-gray-300 rounded-md" type='number' name='price' id='price' onChange={handleChange} value={formData.price} required />
                </div>

                <div>
                    <label htmlFor='date' className='block text-sm font-medium text-gray-700'>Date</label>
                    <input className="mt-1 p-2 w-full border border-gray-300 rounded-md" type='date' name='date' id='date' onChange={handleChange} value={formData.date} required />
                </div>

                <div>
                    <button type='submit' className='bg-blue-500 text-white px-4 py-2 rounded' disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
            </form>
        </div>
    );
}
