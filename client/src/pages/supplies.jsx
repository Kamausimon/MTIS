import React ,{useState, useEffect} from 'react';
import Sidebar from '../components/sidebar';
import Logger from '../components/logger';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';


export default function Supplies() {
  const [supplies, setSupplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
 
  useEffect(() => {
    const fetchSupplies = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found');
          setLoading(false);
          return;
        }
        const response = await axios.get('http://localhost:4000/api/v1/supplies/getAllSupplies', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const suppliesData = response.data.data.supplies || [];
        setSupplies(suppliesData);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch supplies');
      } finally {
        setLoading(false);
      }
    }
    fetchSupplies();
  }, []);

  const handleCreateSupply = () => {
    navigate('/createSupply');};

   return(
         <div className="flex">
              <Logger eventName='page_view' eventData={{page: 'supplies'}} />
              <Sidebar />
              <div className="flex-1 p-6">
               <div className='flex justify-between items-center'>
                <div>
                <h1 className="text-3xl font-bold">Supplies records</h1>
                 <p className='text-sm '>Welcome to your supplies records page</p>
                 <p className='text-sm mb-4'>Here you can view all supplies record and create new ones </p>
                </div>

                <div>
                  <button onClick={handleCreateSupply} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
                    Create Supply
                  </button>
                </div>
               </div>
                 {loading ? (
                  <p>Loading...</p>
                 ) : error ?(
                   <p className='text-red-too'>{error}</p>
                 ) : (
                     <table className='table-auto w-full bg-white'>
                        <thead>
                          <tr>
                            <th className='py-2 px-4 border-b border-gray-200'>Supplier</th>
                            <th className='py-2 px-4 border-b border-gray-200'>Product</th>
                            <th  className='py-2 px-4 border-b border-gray-200' >Quantity</th>
                            <th  className='py-2 px-4 border-b border-gray-200'>Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {supplies.map((supply) => (
                            <tr key={supply._id}>
                              <td className="py-2 px-4 border-b border-gray-200">{supply.supplierId}</td>
                              <td className="py-2 px-4 border-b border-gray-200">{supply.productId}</td>
                              <td className="py-2 px-4 border-b border-gray-200">{supply.quantity}</td>
                              <td className="py-2 px-4 border-b border-gray-200">{supply.price}</td>
                            </tr>
                          ))}
                        </tbody>
                     </table>
                 )}
               
              </div>
            </div>
   )
}