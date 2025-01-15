import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Multiselect from 'multiselect-react-dropdown';
import {jwtDecode} from 'jwt-decode';

export default function SuppliesForm() {
    const [formData, setFormData] = useState({
        supplierId: '',
        products: [],
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

    const handleSelectedProducts = (selectedList) => {
        const selectedProductIds = selectedList.map((product)=> {
            return product.id;
        });
        const updatedProducts = selectedProductIds.map((Product_id)=> {
            const existingProduct = formData.products.find((p)=> p.Product_id === Product_id);
            return existingProduct || {Product_id, quantity: 1, price: 0};
        });
        setFormData({...formData, products: updatedProducts});
    }

    const handleRemoveProducts = (removedList) => {
        const removedProductIds = removedList.map((product) => product.id);
        const updatedProducts = formData.products.filter(
            (product) => !removedProductIds.includes(product.Product_id)
        );
        setFormData({ ...formData, products: updatedProducts });
    };

    const handleProductChange = (Product_id, field, value) => {
        const updatedProducts = formData.products.map((product) =>
            product.Product_id === Product_id ? { ...product, [field]: value } : product
        );
        setFormData({ ...formData, products: updatedProducts });
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        if(name === 'products'){
          const selectedProducts = Array.from(e.target.selectedOptions, option => option.value);
          setFormData({...formData, [name]: selectedProducts});
        } else {
          setFormData({...formData, [name]: value});
        }
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
        } 


        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const decodedToken = jwtDecode(token);
            console.log('decoded token',decodedToken);
            const businessCode = decodedToken.businessCode;
            console.log('business code',businessCode);
            const transformedProducts = formData.products.map((product) => ({ products: product }));
            console.log('transormed',transformedProducts);
            const dataToSend = { products: transformedProducts,  ...formData, businessCode};
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
            <form onSubmit={handleSubmit} className='space-y-4 dark:bg-gray-900 dark:text-white'>
                <div className='mt-1 p-2 w-full border border-gray-300 rounded-md dark:bg-gray-900 dark:text-white'>
                    <label htmlFor='supplierId'>Supplier</label>
                    <select name='supplierId' id='supplierId' onChange={handleChange} value={formData.supplierId} required className='dark:bg-gray-900 dark:text-white'>
                        <option value=''>Select Supplier</option>
                        {suppliers.map((supplier) => (
                            <option key={supplier._id} value={supplier._id}>
                                {supplier.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className='mt-1 p-2 w-full border border-gray-300 rounded-md dark:bg-gray-900 dark:text-white'>
                <label htmlFor="productName"> Product</label>
                <div>
                    
                </div>
                <Multiselect 
                style={{
                    chips: { background: '#4CAF50', color: '#fff' },
                    searchBox: { background: 'transparent', color: '#000' },
                    option:{background: '#fff', color: '#000'},
                }}
                isObject={true}
                  options={products.map((product)=> ({id: product._id, name: product.name}))}
                    displayValue="name"
                    onSelect={handleSelectedProducts}
                    onRemove={handleRemoveProducts}
                />
          
                </div>

                {formData.products.map((product) => (
                    <div key={product.Product_id} className="space-y-2 dark:bg-gray-900 dark:text-white">
                        <h3>Product: {products.find((p) => p._id === product.Product_id)?.name}</h3>
                        <label>Quantity</label>
                        <input
                            className='dark:bg-gray-200 dark:text-black'
                            type="number"
                            min="1"
                            value={product.quantity}
                            onChange={(e) => handleProductChange(product.Product_id, 'quantity', e.target.value)}
                            required
                        />
                        <label>Price</label>
                        <input
                        className='dark:bg-gray-200 dark:text-black'
                            type="number"
                            min="0"
                            value={product.price}
                            onChange={(e) => handleProductChange(product.Product_id, 'price', e.target.value)}
                            required
                        />
                    </div>
                ))}

                <div>
                    <button type='submit' className='bg-blue-500 text-white px-4 py-2 rounded' disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
            </form>
            {error && <p className='text-red-500'>{error}</p>}
            {loading && <p>Submitting...</p>}
        </div>
    );
}
