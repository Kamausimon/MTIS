import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function SupplierForm() {
    const[formData, setFormData] = useState({
        name: "",
        contact_name: "",
        email: "",
        address: "",
        city: "",
        phone: "",
        website: "",
        products: [],
        businessCode: "",
        notes: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [products, setProducts] = useState([]);


    const navigate = useNavigate();

     useEffect(()=> {
        const fetchProducts  = async()=> {

            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:4000/api/v1/products/allProducts', {
                    headers: {Authorization: `Bearer ${token}`}
                });
                console.log(response.data);
                const products = response.data.data;

                if(Array.isArray(response.data.data)){
                    setProducts(products || []);
                } else {
                    setError('Failed to fetch products');
                }
            } catch (err) {
                console.log('error fetching products', err);
                setError('Failed to fetch products');
            }
        }    
        fetchProducts();
    
    
    })

    return (
          <div>
            <h1>create Supplier</h1>
          </div>
    )
}
