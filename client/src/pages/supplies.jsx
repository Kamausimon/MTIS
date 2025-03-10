import React ,{useState, useEffect} from 'react';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

const url = process.env.REACT_APP_API_URL;

export default function Supplies() {
  const [supplies, setSupplies] = useState([]);
  const [productName, setProductName] = useState('');
  const [supplierName, setSupplierName] = useState('');
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
        const response = await axios.get(`${url}/api/v1/supplies/getAllSupplies`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      
        const suppliesData = response.data.data || [];
        console.log('suppliesData', suppliesData);
       
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

  useEffect(() => {
    const fetchProductName = async () => {
      try {
        const token = localStorage.getItem('token');
        const productData = {};
  
        // Use Promise.all to handle multiple async requests
        const promises = supplies.map(async (supply) => {
           supply.products.forEach(async (product) => {
            const productId = product.Product_id // Assuming productId is an object with $oid
        
         console.log('productId', productId);
  
            const response = await axios.get(`${url}/api/v1/products/${productId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
    
            const productName = response.data.data.singleProduct.name;
          
        console.log('productName', productName);
    
            productData[supply._id] = productName; // Assuming _id is an object with $oid
           });
        });
  
        // Wait for all requests to complete
        await Promise.all(promises);
  
   
        setProductName(productData);
      } catch (err) {
        console.error('Error fetching product names:', err);
        setError('Failed to fetch product names');
      }
    };
  
    fetchProductName();
  }, [supplies]);
  
  
useEffect(()=> {
  const fetchSupplierName = async () => {
    try {
      const token = localStorage.getItem('token');
      const supplierData = {};

      const promises = supplies.map(async (supply) => {
        const supplierId = supply.supplierId;
  

        const response = await axios.get(`${url}/api/v1/suppliers/${supplierId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

     
        const supplierName = response.data.data.oneSupplier.name;
  

        supplierData[supply._id] = supplierName;
      });

      await Promise.all(promises);

   
      setSupplierName(supplierData);
    } catch (err) {
      console.error('Error fetching supplier names:', err);
      setError('Failed to fetch supplier names');
    }
  }
  fetchSupplierName();
}, [supplies]);

  const handleDate = (date)=> {
    const newDate = new Date(date);
    return newDate.toISOString().split('T')[0];
  }

  const handleCreateSupply = () => {
    navigate('/createSupply');};

   return(
         <div className="flex">
             
              <Sidebar />
              <div className="flex-1 p-6 bg-white text-black dark:bg-gray-900 dark:text-white">
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
                   <p className='text-red-500'>{error}</p>
                 ) : (
                     <table className='table-auto w-full bg-white dark:bg-gray-900 dark:text-white'>
                        <thead>
                          <tr>
                            <th className='py-2 px-4 border-b border-gray-200 '>Supplier</th>
                            <th className='py-2 px-4 border-b border-gray-200'>Product</th>
                            <th  className='py-2 px-4 border-b border-gray-200' >Quantity</th>
                            <th  className='py-2 px-4 border-b border-gray-200'>Price</th>
                            <th  className='py-2 px-4 border-b border-gray-200'>date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {supplies.length > 0 ? (
                            supplies.map((supply) => (
                              <tr key={supply._id}>
                                <td className="py-2 px-4 border-b border-gray-200">{supplierName[supply._id] || 'Loading...'}</td>
                                <td className="py-2 px-4 border-b border-gray-200">
                               {productName[supply._id] || 'Loading...'}
                                </td>
                                <td className="py-2 px-4 border-b border-gray-200">{supply.products.map((product)=> {
                                    return <div key={product.Product_id}>{product.quantity}</div>
                                })}</td>
                                <td className="py-2 px-4 border-b border-gray-200">{supply.products.map((product)=> {
                                return   <div key={product.Product_id}>{product.price}</div>
                                })}</td>
                                <td className='py-2 px-4 border-b border-gray-200'>{handleDate(supply.date)}</td>
                              </tr>
                            ))
                          ) : (
                             <p>No supplies found</p>
                          )
                          }
                        </tbody>
                     </table>
                 )}
               
              </div>
            </div>
   )
}