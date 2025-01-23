import React, {useState} from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const url = process.env.REACT_APP_API_URL;


export default function CreateAdmin() {
    const {id, businessCode} = useParams();
 

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        passwordConfirm: ''
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            
            const response = await fetch(`${url}/api/v1/businesses/createAdmin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    businessCode,
                    business: id
                })
            });

            const data = await response.json();
            console.log('data',data);

            if (response.ok) {
                alert(data.message);
                navigate('/login');
            } else {

                setError(data.message || 'Admin creation failed');
            }
        } catch (err) {
            console.error(err);
            setError('Admin creation failed');
        } finally {
            setLoading(false);
        }
    }

    return(
        <div className='min-h-screen bg-slate-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8  text-black dark:bg-gray-900 dark:text-black'>
             <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create Admin
                    </h2>
                </div>
                
             <form onSubmit={handleSubmit}>
                <div className='rounded-md shadow-sm -space-y-px'>
                    <div>
                        <label htmlFor='name' className='sr-only'>Name</label>
                        <input type='text' name='name' id='name' autoComplete='name' required className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-slate-500 focus:border-slate-500 focus:z-10 sm:text-sm' placeholder='Name' onChange={handleChange}/>
                    </div>
                    <div>
                        <label htmlFor='email' className='sr-only'>Email</label>
                        <input type='email' name='email' id='email' autoComplete='email' required className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-slate-500 focus:border-slate-500 focus:z-10 sm:text-sm' placeholder='Email' onChange={handleChange}/>
                    </div>
                    <div>
                        <label htmlFor='password' className='sr-only'>Password</label>
                        <input type='password' name='password' id='password' autoComplete='password' required className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-slate-500 focus:border-slate-500 focus:z-10 sm:text-sm' placeholder='Password' onChange={handleChange}/>
                    </div>
                    <div>
                        <label htmlFor='passwordConfirm' className='sr-only'>Confirm Password</label>
                        <input type='password' name='passwordConfirm' id='passwordConfirm' autoComplete='passwordConfirm' required className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-slate-500 focus:border-slate-500 focus:z-10 sm:text-sm' placeholder='Confirm Password' onChange={handleChange}/>
                    </div>
                </div>
                {error && (
                    <div className='bg-red-100 border-l-4 border-red-500 text-red-700 p-4' role='alert'>
                        <p>{error}</p>
                    </div>
                )}
                <div>
                    <button type='submit' className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-slate-600 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500'>
                        {loading ? (
                            <svg className='animate-spin h-5 w-5 mr-3 ' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                                <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                                <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0c4.418 0 8 3.582 8 8s-3.582 8-8 8-8-3.582-8-8z'></path>
                            </svg>
                        ) : null}
                        Create Admin
                    </button>
                </div>
             </form>
             </div>
            
        </div>
    )
}