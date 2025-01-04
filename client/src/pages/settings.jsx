import React from 'react';
import Sidebar from '../components/sidebar';
import{Link,useNavigate} from 'react-router-dom';
import axios from 'axios';
import Logger from '../components/logger';

export default function Settings(){
    return(
        <div>
            <div className="flex">
                <Logger eventName='page_view' eventData={{page: 'settings'}} />
                <Sidebar />
                <div className="flex-1 p-6">
                    <h1 className="text-3xl font-bold">Settings</h1>
                    <p>Welcome to your settings page. </p>
                    <Link to="/profile" className="text-blue-500 hover:underline">Go to Profile</Link>
                </div>
            </div>
        </div>
    )
}