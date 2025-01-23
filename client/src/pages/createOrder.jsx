import React from 'react';
import Sidebar from '../components/Sidebar';

import OrderForm from '../components/orderForm';

export default function CreateOrder() {
    return(
        <div>
            <div className="flex bg-white text-black dark:bg-gray-900 dark:text-white">
                <Sidebar />
                <div className="flex-1 p-6">
                    <h1 className="text-3xl font-bold">Create Order</h1>
                    <p>Welcome to your create order page. </p>
                    <OrderForm />
                </div>
            </div>
        </div>
    )
}