import React, {useState, useEffect} from 'react';
import Sidebar from '../components/sidebar'
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import {useParams} from 'react-router-dom';


export default function ViewOrder() {
    const {id} = useParams();
    const [order, setOrder] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(()=>{
        const fetchOrder = async () => {
            try{
               const token = localStorage.getItem('token');
                if(!token){
                     setError('No token found');
                     setLoading(false);
                     return;
                }

                const response = await axios.get(`http://localhost:4000/api/v1/orders/${id}`, {headers: {Authorization: `Bearer ${token}`}});
                   console.log(response.data.data.oneOrder);
                
                setOrder(response.data.data.oneOrder || {});
            }catch(err){
                console.log(err);
                setError('Failed to fetch order');

            }
        }
        fetchOrder();
    }, [id]);

    const navigate = useNavigate();
    const handleEditOrder = () => {
        navigate('/editOrder');
    }
    const handleDeleteOrder = async () => {
        navigate('/deleteOrder');
    }
    return (
        <div className='flex bg-white text-black dark:bg-gray-900 dark:text-white'>
            <Sidebar />
            <div className='flex-1 p-6'>
                 <div className='flex justify-between items-center'> 
                 <div>
                    <h1 className='text-2xl mb-6'>Order </h1>
                   </div>
                   <div>
                       <button onClick={handleEditOrder} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'> 
                           edit order
                       </button>
                       <button onClick={handleDeleteOrder} className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'>
                           delete order
                       </button>
                   </div>
                </div>
                {loading ? (
                    <p>Loading ...</p>
                ): error? (
                    <p className='text-red-500'>{error}</p>
                ): (
                    <div className='flex flex-col'>
                          {order && (
                            <div> 
                                <p>Order Id: {order._id}</p>
                                <p>Order_number{order.order_number}</p>
                                <p>Order Date: {order.order_date}</p>
                                <p>Order Status: {order.orderStatus}</p>
                                <p>customer name: {order.customer_name}</p>
                                <p>customer email: {order.customer_email}</p>

                                </div>
                          )}
                    </div>
                )}

            </div>
                
        </div>
    )
}