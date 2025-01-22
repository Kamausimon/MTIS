import React , {useState} from 'react';
import {useParams } from 'react-router-dom';
import {useNavigate} from 'react-router-dom';

export default function ResetPassword() {
    const {token, businessCode}= useParams();
    const navigate = useNavigate();
   const [formData, setFormData] = useState({
     password: '',
     passwordConfirm : '',
   }); 
   const [error, setError] = useState('');
   const [loading, setLoading] = useState(false);

const handleChange = (e) => {
    setFormData({
        ...formData, 
        [e.target.name]: e.target.value
    });
}

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
       
        try{

            if (formData.password !== formData.passwordConfirm) {
                setError("Passwords do not match");
                setLoading(false);
                return;
              }
              
          const response = await fetch(`http://localhost:4000/api/v1/users/resetPassword/${token}/${businessCode}`, {
            method:'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...formData, businessCode
             })
          })
          console.log('response', response)
 
          const data  = await response.json();
          console.log('data', data)
       if(response.ok){
        alert(data.message);
        navigate('/login')
       } else{
        setError(data.message || 'failed to resetPassword')
       }

        }catch(err){
         console.log(err);
         setError(err.response?.data?.message || "Something went wrong.");
        }finally {
            setLoading(false);
        }
    }

    return (
        <div className='min-h-screen bg-slate-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8  text-black dark:bg-gray-900 dark:text-black'>
             <div className='max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg'>
                <div>
                    <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
                        Reset Password
                    </h2>
                </div>
                <form onSubmit={handleResetPassword}>
                    <div className='rounded-md shadow-sm -space-y-px'>
                        <div>
                            <label htmlFor='password' className='sr-only'>
                                Password
                            </label>
                            <input
                                id='password'
                                name='password'
                                type='password'
                                autoComplete='current-password'
                                required
                                className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-slate-500 focus:border-slate-500 focus:z-10 sm:text-sm'
                                placeholder='Password'
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor='passwordConfirm' className='sr-only'>
                                Confirm Password
                            </label>
                            <input
                                id='passwordConfirm'
                                name='passwordConfirm'
                                type='password'
                                autoComplete='current-password'
                                required
                                className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-slate-500 focus:border-slate-500 focus:z-10 sm:text-sm'
                                placeholder='Confirm Password'
                                value={formData.passwordConfirm}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    {error && (
                        <div className='bg-red-100 border-l-4 border-red-500 text-red-700 p-4' role='alert'>
                            <p>{error}</p>
                        </div>
                    )}
                    <div>
                        <button
                            type='submit'
                            className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-slate-600 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500'
                        >
                            <span className='absolute left-0 inset-y-0 flex items-center pl-3'>
                                <svg
                                    className='h-5 w-5 text-slate-500 group-hover:text-slate-400'
                                    xmlns='http://www.w3.org/2000/svg'
                                    viewBox='0 0 20 20'
                                    fill='currentColor'
                                    aria-hidden='true'
                                >
                                    <path
                                        fillRule='evenodd'
                                        d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'  
                                    />
                                </svg>
                            </span>
                            {loading ? (
                                <svg
                                    className='animate-spin h-5 w-5 mr-3 '
                                    xmlns='http://www.w3.org/2000/svg'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                >
                                    <circle
                                        className='opacity-25'
                                        cx='12'
                                        cy='12'
                                        r='10'
                                        stroke='currentColor'
                                        strokeWidth='4'
                                    ></circle>
                                    <path
                                        className='opacity-75'
                                        fill='currentColor'
                                        d='M4 12a8 8 0 018-8'
                                    ></path>
                                </svg>
                            ) : null}
                            Reset Password
                        </button>
                    </div>
                </form>
             </div>
           </div>
    )
}