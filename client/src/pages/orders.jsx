import React from 'react';
import Sidebar from '../components/sidebar';
import {Link,useNavigate} from 'react-router-dom';
import axios from 'axios';
import Logger from '../components/logger';

export default function Orders(){
    return(
        <div>
            <div className="flex bg-white text-black dark:bg-gray-900 dark:text-white">
                <Logger eventName='page_view' eventData={{page: 'orders'}} />
                <Sidebar />
                <div className="flex-1 p-6">
                    <h1 className="text-3xl font-bold">Orders</h1>
                    <p>Welcome to your orders page. </p>
                    <Link to="/profile" className="text-blue-500 hover:underline">Go to Profile</Link>
                </div>
            </div>
        </div>
    )
}