import React, {useState, useEffect} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import { jwtDecode} from 'jwt-decode';

export default function OrderForm(){
    const [formData, setFormData] = useState({
        order_date: "",
        order_status: "",
        customer_name: "",
        customer_email: "",
        customer_address: "",
        items: [
            {
                Product_id: "",
                quantity: "",
                price: "",
                subtotal: "",
            },
        ],
        subtotal: "",
        tax: "",
        shipping_cost: "",
        total: "",
        businessCode: "",
    }); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(()=> {
        const fetchProducts = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:4000/api/v1/products/allProducts', {
                    headers: {Authorization: `Bearer ${token}`}
                });
                console.log(response.data);
                if(Array.isArray(response.data.data)){
                    setProducts(response.data.data.products || []);
                } else {
                    setError('Failed to fetch products');
                }
            } catch (err) {
                console.log('error fetching products', err);
                setError('Failed to fetch products');
            }
        };
        fetchProducts();
    }, []); 

    const handleChange = (e, index = null) => {
        const { name, value } = e.target;
    
        if (index !== null) {
            setFormData((prevFormData) => {
                const updatedItems = [...prevFormData.items];
                updatedItems[index][name] = value;
                return { ...prevFormData, items: updatedItems };
            });
        } else {
            setFormData((prevFormData) => ({
                ...prevFormData,
                [name]: value,
            }));
        }
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const decodedToken = jwtDecode(token);
            const businessCode = decodedToken.businessCode;
            const orderData = {...formData, businessCode};
            const response = await axios.post('http://localhost:4000/api/v1/orders/createOrder', orderData, {
                headers: {Authorization: `Bearer ${token}`}
            });
            console.log(response.data);
            navigate('/orders');
        } catch (err) {
            console.log('error creating order', err);
            setError('Failed to create order');
        }
    }
    
    return(
           <div className="dark:bg-gray-800 dark:text-white">
         <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Order Date</label>
                    <input className="mt-1 p-2 w-full border border-gray-300 rounded-md"  type="date" name="order_date" value={formData.order_date} onChange={handleChange} />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Order Status</label>
                   <select className="mt-1 block w-full p-2 border border-gray-300 rounded-md" value={formData.order_status}  onChange={handleChange}>
                          <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                   </select>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Customer Name</label>
                    <input className="mt-1 p-2 w-full border border-gray-300 rounded-md"  type="text" name="customer_name" value={formData.customer_name} onChange={handleChange} />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Customer Email</label>
                    <input className="mt-1 p-2 w-full border border-gray-300 rounded-md"  type="email" name="customer_email" value={formData.customer_email} onChange={handleChange} />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Customer Address</label>
                    <input className="mt-1 p-2 w-full border border-gray-300 rounded-md"  type="text" name="customer_address" value={formData.customer_address} onChange={handleChange} />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Items</label>
                    {products && formData.items.map((item, index) => (
    <div key={index}>
        <input
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            type="text"
            name="Product_id"
            value={item.Product_id}
            onChange={(e) => handleChange(e, index)}
        />
        <input
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            type="number"
            name="quantity"
            value={item.quantity}
            onChange={(e) => handleChange(e, index)}
        />
        <input
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            type="number"
            name="price"
            value={item.price}
            onChange={(e) => handleChange(e, index)}
        />
        <input
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            type="number"
            name="subtotal"
            value={item.subtotal}
            onChange={(e) => handleChange(e, index)}
        />
    </div>
))}

                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Subtotal</label>
                    <input className="mt-1 p-2 w-full border border-gray-300 rounded-md"  type="number" name="subtotal" value={formData.subtotal} onChange={handleChange} />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Tax</label>
                    <input className="mt-1 p-2 w-full border border-gray-300 rounded-md"  type="number" name="tax" value={formData.tax} onChange={handleChange} />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Shipping Cost</label>
                    <input className="mt-1 p-2 w-full border border-gray-300 rounded-md"  type="number" name="shipping_cost" value={formData.shipping_cost} onChange={handleChange} />
                </div>
                <div className="mb-4">
                    <label htmlFor="" className="block text-sm font-medium text-gray-700">Total</label>
                    <input className="mt-1 p-2 w-full border border-gray-300 rounded-md" type="number" name="total" value={formData.total} onChange={handleChange} />
                </div>
                <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">Create Order</button>
         </form>
         {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
           </div>
    )
}