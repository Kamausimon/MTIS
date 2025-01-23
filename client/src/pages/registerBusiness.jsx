import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const url = process.env.REACT_APP_API_URL;

export default function RegisterBusiness() {
    const [formData, setFormData] = useState({
        businessName: '',
        businessType: '',
        email: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit=  async(e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
           
            const response = await axios.post(`${url}/api/v1/businesses/registerBusiness`, formData);
            localStorage.setItem('token', response.data.token);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    }
    return(
         <div className='min-h-screen bg-slate-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8  text-black dark:bg-gray-900 dark:text-white'>

            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
                 <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Register your business
                    </h2>
                 </div>

                 <form className='mt-8 space-y-6'  onSubmit={handleSubmit}>
                        <div className='rounded-md shadow-sm -space-y-px'>
                            <div>
                                <label htmlFor='businessName' className='sr-only'>Business Name</label>
                                <input type='text' name='businessName' id='businessName' autoComplete='businessName' required className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-slate-500 focus:border-slate-500 focus:z-10 sm:text-sm' placeholder='Business Name' onChange={handleChange}/>
                            </div>
                            <div>
                                <label htmlFor='businessType' className='sr-only'>Business Type</label>
                                <input type='text' name='businessType' id='businessType' autoComplete='businessType' required className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-slate-500 focus:border-slate-500 focus:z-10 sm:text-sm' placeholder='Business Type' onChange={handleChange}/>
                            </div>
                            <div>
                                <label htmlFor='email' className='sr-only'>Email</label>
                                <input type='email' name='email' id='email' autoComplete='email' required className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-slate-500 focus:border-slate-500 focus:z-10 sm:text-sm' placeholder='Email' onChange={handleChange}/>
                            </div>
                        </div>
                        {error && (
                            <div className='bg-red-100 border-l-4 border-red-500 text-red-700 p-4' role='alert'>
                                <p>{error}</p>
                            </div>
                        )}
                        <div>
                            <button type='submit' className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-slate-600 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500'>
                                {loading ? 'Loading...' : 'Register'}
                            </button>
                        </div>
                 </form>
                
                  </div>

         </div>
    )
}