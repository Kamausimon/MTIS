import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Multiselect from 'multiselect-react-dropdown';
import {jwtDecode} from 'jwt-decode';

export default function SuppliesForm() {
    const [formData, setFormData] = useState({
        supplierId: '',
        productId: '',
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

    useEffect(()=> {
        const fetchSuppliers = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:4000/api/v1/suppliers/getAllSuppliers', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setSuppliers(response.data.data.suppliers || []);
            } catch (err) {
                console.log('error fetching suppliers', err);
                setError('Failed to fetch suppliers');
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
                console.log('error fetching products', err);
                setError('Failed to fetch products');
            }
        };
        fetchProducts();
    }, []);

   const multiselectOptions = products.map((product) => ({ name: product.name, id: product._id }));

    const handleChangeMultiSelect = (selectedList) => {
        const selectedProductIds = selectedList.map((product) => product.id);
        setFormData({ ...formData, products: selectedProductIds });
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
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
            console.log('response', response.data);
            navigate('/supplies');
        } catch (err) {
            console.log('error creating supply', err);
            setError('Failed to create supply');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
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
                  selectedValues = {formData.products.map((product) => ({name: product.name, id: product._id}))}
                    options={multiselectOptions}
                    displayValue="name"
                    onSelect={handleChangeMultiSelect}
                    onRemove={handleChangeMultiSelect}
                  />
                </div>

                <div>
                    <label htmlFor='quantity'>Quantity</label>
                    <input type='number' name='quantity' id='quantity' onChange={handleChange} value={formData.quantity} required />
                </div>
               
               <div>
                    <label htmlFor='price'>Price</label>
                    <input type='number' name='price' id='price' onChange={handleChange} value={formData.price} required />
                </div>

                <div>
                    <label htmlFor='date'>Date</label>
                    <input type='date' name='date' id='date' onChange={handleChange} value={formData.date} required />
                </div>

                <div>
                    <button type='submit' className='bg-blue-500 text-white px-4 py-2 rounded'>
                        {loading ? 'Loading...' : 'Submit'}
                    </button>
               </div>
                
            </form>
        </div>
    )
     

}