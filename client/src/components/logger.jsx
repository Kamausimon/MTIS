import  {useEffect} from 'react';
import axios from 'axios';
import{jwtDecode} from 'jwt-decode';

const Logger = ({eventName, eventData  = {}}) => {
    useEffect(()=> {
        const logEvent = async () => {
            try{
             const token = localStorage.getItem('token');
            const decoded = jwtDecode(token);
            console.log(decoded.role)
             if(!token){
                 return;
             }

                const response = await axios.post('http://localhost:4000/api/v1/analytics/logger',{
                    eventName,
                    eventData,
                    action: 'click',
                    page: window.location.pathname,
                  
                }, {
                    headers: { Authorization: `Bearer ${token}` },
                    'Content-type': 'application/json',
                });
                console.log(response.data);
            }catch(err){
                console.log(err);
                throw new Error(err);
              
            }
        }
        logEvent();
    },[eventName, eventData]); //run again if eventName or eventData changes
    return null; //no need to render anything
};

export default Logger;