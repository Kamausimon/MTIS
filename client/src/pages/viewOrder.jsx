import React, { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function ViewOrder() {
    const { id } = useParams();
    const [order, setOrder] = useState({});
    const [productName, setProductName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('No token found. Please log in again.');
                    setLoading(false);
                    return;
                }

                const response = await axios.get(
                    `http://localhost:4000/api/v1/orders/${id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                setOrder(response.data.data.oneOrder || {});
            } catch (err) {
                console.error(err);
                setError('Failed to fetch the order. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    useEffect(() => {
        const fetchProductName = async () => {
            try {
                const token = localStorage.getItem('token');
                const productData = {};

                // Use Promise.all to handle multiple async requests
                const promises = order.items.map(async (item) => {
                    const response = await axios.get(
                        `http://localhost:4000/api/v1/products/${item.Product_id}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                  
                    productData[item.Product_id] = response.data.data.singleProduct.name;
                });

                await Promise.all(promises);
              
                setProductName(productData);
            } catch (err) {
                console.error(err);
               
            }
        }
        fetchProductName();
    }, [order]);

    const handleEditOrder = () => {
        navigate(`/editOrder/${id}`);
    };

    const handleDeleteOrder = async () => {
        navigate(`/deleteOrder/${id}`);
    };

    const handlePrice = (price) =>  {
        return price.toLocaleString()
    }
    return (
        <div className="flex bg-white text-black dark:bg-gray-900 dark:text-white">
            <Sidebar />
            <div className="flex-1 p-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl mb-6">Order Details</h1>
                    <div className="space-x-2">
                        <button
                            onClick={handleEditOrder}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Edit Order
                        </button>
                        <button
                            onClick={handleDeleteOrder}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Delete Order
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center">
                        <div className="loader" />
                    </div>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    <div className="flex flex-col space-y-2">
                        {order && (
                            <div className="p-4 border rounded-lg shadow">
                                <p>
                                    <strong>Order Id:</strong> {order._id}
                                </p>
                                <p>
                                    <strong>Order Number:</strong> {order.order_number}
                                </p>
                                <p>
                                    <strong>Order Date:</strong> {new Date(order.order_date).toLocaleDateString()}
                                </p>
                                <p>
                                    <strong>Order Status:</strong> {order.order_status}
                                </p>
                                <p>
                                    <strong>Customer Name:</strong> {order.customer_name}
                                </p>
                                <p>
                                    <strong>Customer Email:</strong> {order.customer_email}
                                </p> 
                                <p>
                                    <strong>Products</strong>
                                    {order.items.map((item)=> {
                                        return (
                                            <div key={item.Product_id}>
                                                <p>
                                                    <strong>Product Name:</strong> {productName[item.Product_id]}
                                                </p>
                                                <p>
                                                    <strong>Quantity:</strong> {item.quantity}
                                                </p>
                                                <p>
                                                    <strong>Price:</strong> {handlePrice(item.price)}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </p>

                                <p>
                                    <strong>Subtotal:</strong> {handlePrice(order.subtotal)}
                                </p>

                                <p>
                                    <strong>Tax:</strong> {handlePrice(order.tax)}
                                </p>

                                <p>
                                    <strong>Shipping Cost:</strong> {handlePrice(order.shipping_cost)}
                                </p>
                                    
                                    <p>
                                        <strong>Total:</strong> {handlePrice(order.total)}
                                    </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
