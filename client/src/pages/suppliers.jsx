import React, {useState, useEffect} from 'react';
import Sidebar from '../components/sidebar';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';


export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [products, setProducts] = useState([]);


  const navigate = useNavigate();


  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found');
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:4000/api/v1/suppliers/getAllSuppliers', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuppliers(response.data.data.suppliers || []);
      } catch (err) {
        console.log(err);
        setError('Failed to fetch suppliers');
      } finally {
        setLoading(false);
      }
    };
    fetchSuppliers();    
    }, []);

    useEffect(() => {
      const fetchProductDetails = async () => {
        try {
          const token = localStorage.getItem("token");
          console.log("Fetching suppliers...");
    
          // Fetch suppliers
          const { data } = await axios.get(
            "http://localhost:4000/api/v1/suppliers/getAllSuppliers",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          console.log("Suppliers fetched:", data);
    
          if (data?.data?.suppliers) {
            setSuppliers(data.data.suppliers);
    
            // Extract product IDs
            const productIds = data.data.suppliers.flatMap((supplier) =>
              supplier.products.map((product) => product.Product_id)
            );
            console.log("Product IDs extracted:", productIds);
    
            // Fetch product details
            const productPromises = productIds.map((id) =>
              axios
                .get(`http://localhost:4000/api/v1/products/${id}`, {
                  headers: { Authorization: `Bearer ${token}` },
                })
                .then((res) => res.data.data)
            );
            const products = await Promise.all(productPromises);
            console.log("Products fetched:", products);
    
            setProducts(products);
          } else {
            console.log("No suppliers found.");
            setError("No suppliers found");
          }
        } catch (err) {
          console.error("Error fetching data:", err);
          setError("Failed to fetch products");
        }
      };
    
      fetchProductDetails();
    }, []);
    

   const handleCreate =() => {
     navigate('/createSupplier');
   } 



   return (
    <div>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6">
           <div className="flex justify-between items-center">
               <div>
               <h1 className="text-3xl font-bold mb-4">Create Suppliers</h1>
          <p className="text-sm">Welcome to your suppliers page.</p>
          <p className="text-sm mb-4">Here you can view all suppliers and create new ones.</p>
               </div>
                <div>
                  <button onClick={handleCreate} className=' mt-4 px-4 py-2 bg-blue-600 text-white rounded-md'>Create Supplier</button>
                </div>
           </div>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <>
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b border-gray-200">Name</th>
                    <th className="py-2 px-4 border-b border-gray-200">Phone</th>
                    <th className="py-2 px-4 border-b border-gray-200">Email</th>
                    <th className="py-2 px-4 border-b border-gray-200">products</th>
                  </tr>
                </thead>
                <tbody>
                  {suppliers.map((supplier) => (
                    <tr key={supplier._id}>
                      <td className="py-2 px-4 border-b border-gray-200">{supplier.name}</td>
                      <td className="py-2 px-4 border-b border-gray-200">{supplier.phone}</td>
                       <td className="py-2 px-4 border-b border-gray-200">{supplier.email}</td>
                       <td className="py-2 px-4 border-b border-gray-200">
                  {supplier.products && supplier.products.length > 0 ? (
                     <ul>
                      {products.map((product, index) => (
                       <li key={index}>{product.singleProduct.name}</li>
                          ))}
                       </ul>
                           ) : (
                             'No products'
                                 )}
                               </td>

                    </tr>
                  ))}
                </tbody>
              </table>
         
           
            </>
          )}
        </div>
      </div>
    </div>
  );
}