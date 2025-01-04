import React, {useState, useEffect} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import { jwtDecode} from 'jwt-decode';


export default function CategoryForm() {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        parent: "",
        level: 1,
        businessCode: "",   
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [categories, setCategories] = useState([]);
  
    const navigate = useNavigate();

    useEffect(()=> {
        //fetch categories and filter parent catgories
        const fetchCategories = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:4000/api/v1/categories/allCategories', {
                    headers: {Authorization: `Bearer ${token}`}
                });
                console.log(response.data);
                const parentCategories = response.data.data;
                const filtered = parentCategories.filter((category) => category.level === 0);

                if(Array.isArray(response.data.data)){
                    setCategories(filtered || []);
                } else {
                    setError('Failed to fetch categories');
                }
            } catch (err) {
                console.log('error fetching categories', err);
                setError('Failed to fetch categories');
            }
        };
        fetchCategories();
    }, []);


    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const decodedToken = jwtDecode(token);
            const businessCode = decodedToken.businessCode;
    const dataToSend = {...formData, businessCode};

            const response = await axios.post('http://localhost:4000/api/v1/categories/createCategory', dataToSend, {
                headers: {Authorization: `Bearer ${token}`}
            });
            console.log(response.data);
            navigate('/categories');
        } catch (err) {
            console.log('error creating category', err);
            setError('Failed to create category');
        } finally {
            setLoading(false);
    }}

    return(
     <div>
        <h1 className="text-3xl font-bold">Create Category</h1>
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" name="name" id="name" className="mt-1 p-2 w-full border border-gray-300 rounded-md" onChange={handleChange} required />
            </div>
            <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <input type="text" name="description" id="description" className="mt-1 p-2 w-full border border-gray-300 rounded-md" onChange={handleChange} required />
            </div>
            <div className="mb-4">
                <label htmlFor="parent" className="block text-sm font-medium text-gray-700">Parent Category</label>
                <select name="parent" id="parent" className="mt-1 p-2 w-full border border-gray-300 rounded-md" onChange={handleChange} required>
                    <option value="">Select Parent Category</option>
                    {categories.map((category) => (
                        <option key={category._id} value={category._id}>{category.name}</option>
                    ))}
                </select>
            </div>
            <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">Create Category</button>
        </form>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
     </div>    
   
    )
}