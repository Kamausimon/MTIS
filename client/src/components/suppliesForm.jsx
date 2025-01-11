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
                setProducts(response.data.data.products || []); //products fetched and set to state
            } catch (err) {
                console.error('Error fetching products:', err.response?.data || err.message);
                setError(err.response?.data?.message || 'Failed to fetch products');
            }
        };
        fetchProducts();
    }, []);

    const handleChange = (e) => {
        const {name, value} = e.target;
        if(name === 'products'){
          const selectedProducts = Array.from(e.target.selectedOptions, option => option.value);
          setFormData({...formData, [name]: selectedProducts});
        } else {
          setFormData({...formData, [name]: value});
        }
      };

    const multiselectOptions = products.map((product) => ({ name: product.name, id: product._id })); //transforming products to multiselect options



    const handleChangeMultiSelect = (selectedList) => {
        const selectedProductIds = selectedList.map((product) => product.id);
    setFormData({...formData, products: selectedProductIds});
    };   

  

    const handleSubmit = async (e) => {
        e.preventDefault();
      if(!formData.supplierId){
        setError('Please select a supplier');
        return;
      }
        if(formData.products.length === 0){
            setError('Please select a product');
            return;
        }  if(formData.quantity <= 0){
            setError('Please enter a valid quantity');
            return;
        }  if(formData.price <= 0){
            setError('Please enter a valid price');
            return;
        }


        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const decodedToken = jwtDecode(token);
            console.log('decoded token',decodedToken);
            const businessCode = decodedToken.businessCode;
            console.log('business code',businessCode);
            const transformedProducts = formData.products.map((product) => ({ Product_id: product }));
            console.log('transormed',transformedProducts);
            const dataToSend = { ...formData, businessCode, products: transformedProducts };
            console.log('data to send',dataToSend);
            const response = await axios.post('http://localhost:4000/api/v1/supplies/registerSupply', dataToSend, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log(response.data);
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
                        options={multiselectOptions}
                        selectedValues={formData.products.map((productId) => {
                            const product = products.find((p) => p._id === productId);
                            return product ? { name: product.name, id: product._id } : null;
                        }).filter(Boolean)}                  
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
                    <button type='submit' className='bg-blue-500 text-white px-4 py-2 rounded' disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
            </form>
        </div>
    );
}
