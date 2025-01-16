import React , {useState, useEffect} from 'react';
import Sidebar from '../components/sidebar';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';


export default function Orders(){
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    useEffect(()=> {
        const fetchOrders = async()=> {
            try{
                const token = localStorage.getItem('token');
                if(!token){
                    setError('No token found');
                    setLoading(false);
                    return;
                }

                const response = await axios.get('http://localhost:4000/api/v1/orders/getAllOrders',{
                    headers: {Authorization: `Bearer ${token}`},
                });
             
                if(Array.isArray(response.data.data.allOrders)){
                    setOrders(response.data.data.allOrders || []);}else {
                        setError('Failed to fetch orders');
                    }
             
            }catch(err){
                console.log(err);
                setError('Failed to fetch orders');
            }finally{
                setLoading(false);
            }
        }
        fetchOrders();
    }, []);

    const handleDate = (date) => {
        const newDate = new Date(date);
        return newDate.toISOString().split('T')[0];
    }

    const handleCreateOrder = () => {
        navigate('/createOrder');
    }

    const handleView = (orderId) => {
        navigate(`/viewOrder/${orderId}`);
    }


    return(
        <div>
            <div className="flex bg-white text-black dark:bg-gray-900 dark:text-white">
            
                <Sidebar />
                <div className="flex-1 p-6">
                 <div className='flex justify-between items-center'>
                      <div>
                            <h1 className='text-3xl font-bold mb-4'>Orders</h1>
                            <p className='text-sm'>Here you can view all your orders</p>
                      </div>
                      
                      <div>
                      <button onClick={handleCreateOrder} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>          
                                    Create new Order            
                          </button>
                      </div>
                 </div>
                 {loading ?(
                    <p>Loading...</p>
                 ): error ? (
                    <p className='text-red-500'>{error}</p>
                 ): (
                    <>
                        <table className='min-w-full bg-white text-black dark:bg-gray-900 dark:text-white'>
                            <thead>
                                <tr>
                                    <th className='py-2 px-4 border-b border-gray-200'>Order Number</th>
                                    <th  className='py-2 px-4 border-b border-gray-200'>Customer Name</th>
                                    <th  className='py-2 px-4 border-b border-gray-200'>Customer Email</th>
                                    <th  className='py-2 px-4 border-b border-gray-200'>Order Date</th>
                                    <th  className='py-2 px-4 border-b border-gray-200'>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order)=>(
                                    <tr key={order._id}>
                                        <td className="py-2 px-4 border-b border-gray-200">{order.order_number}</td>
                                        <td className="py-2 px-4 border-b border-gray-200">{order.customer_name}</td>
                                        <td className="py-2 px-4 border-b border-gray-200">{order.customer_email}</td>
                                        <td className="py-2 px-4 border-b border-gray-200">{handleDate(order.createdAt)}</td>
                                        <td className="py-2 px-4 border-b border-gray-200">
                                            <button onClick={()=>handleView(order._id)} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>                            
                                                    View 
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                 ) }


                </div>
            </div>
        </div>
    )
}