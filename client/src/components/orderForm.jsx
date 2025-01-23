import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import Multiselect from "multiselect-react-dropdown";

const url = process.env.REACT_APP_API_URL;

export default function OrderForm() {
  const [formData, setFormData] = useState({
    order_date: "",
    customer_name: "",
    customer_email: "",
    customer_address: "",
    items: [],
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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${url}/api/v1/products/allProducts`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.data.data) {
          setProducts(response.data.data.products || []);
        } else {
          setError("Failed to fetch products");
        }
      } catch (err) {
        setError("Failed to fetch products");
      }
    };
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));    
  }

  const multiSelectOptions = products.map((product) => ({
    name: product.name,
    id: product._id,
    price: product.price, // Ensure `price` is part of the product object
  }));

  const handleChangeMultiSelect = (selectedList) => {
    const updatedItems = selectedList.map((product) => ({
      Product_id: product.id,
      product_name: product.name,
      price: product.price,
      quantity: 1, // Default quantity
      item_subtotal: product.price,
    }));
    setFormData((prevFormData) => ({
      ...prevFormData,
      items: updatedItems,
    }));
  };

  useEffect(() => {
    const calculateSubtotal = () => {
      const subtotal = formData.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      setFormData((prevData) => ({ ...prevData, subtotal }));
    };

    calculateSubtotal();
  }, [formData.items]);

  useEffect(() => {
    const calculateTotal = () => {
      const total = parseFloat(formData.subtotal || 0) + parseFloat(formData.tax || 0) + parseFloat(formData.shipping_cost || 0);
      setFormData((prevData) => ({ ...prevData, total }));
    };

    calculateTotal();
  }, [formData.subtotal, formData.tax, formData.shipping_cost]);

  const handleItemChange = (index, field, value) => {
    setFormData((prevFormData) => {
      const updatedItems = [...prevFormData.items];
      updatedItems[index][field] = value;
      if (field === "quantity") {
        updatedItems[index].item_subtotal =
          updatedItems[index].price * parseFloat(value || 0);
      }
      return {
        ...prevFormData,
        items: updatedItems,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      const businessCode = decodedToken.businessCode;
      const  transformedProducts = formData.items.map((product) => ({
        Product_id: product.Product_id,
        product_name: product.product_name,
        quantity: product.quantity,
        price: product.price,
        item_subtotal: product.item_subtotal,
      }));
      const orderData = { ...formData,  businessCode, items: transformedProducts };
      const response = await axios.post(
        `${url}/api/v1/orders/createOrder`,
        orderData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response.data);
      navigate("/orders");
    } catch (err) {
        console.error(err);
      setError("Failed to create order");
    }
  };

  return (
    <div >
        {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4 dark:bg-gray-900 dark:text-black">
      <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Order Date</label>
                    <input className="mt-1 p-2 w-full border border-gray-300 rounded-md"  type="date" name="order_date" value={formData.order_date} onChange={handleChange} />
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
        {/* Other form fields */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Items</label>
          <Multiselect
            style={{
                chips: { background: '#4CAF50', color: '#fff' },
                searchBox: { background: 'transparent', color: '#000' },
                option:{background: '#fff', color: '#000'},
            }}
            options={multiSelectOptions}
            displayValue="name"
            onSelect={handleChangeMultiSelect}
            onRemove={handleChangeMultiSelect}
            placeholder="Select Products"
          />
          {formData.items.map((item, index) => (
            <div key={index} className="mt-2">
              <div className="flex gap-4">
                <span>{item.product_name}</span>
                <input
                  type="number"
                  className="mt-1 p-2 w-24 border border-gray-300 rounded-md"
                  placeholder="Quantity"
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(index, "quantity", e.target.value)
                  }
                />
                <span className="mt-1 p-2 w-24 border border-gray-300 rounded-md">Price: {item.price}</span>
                <span className="mt-1 p-2 w-24 border border-gray-300 rounded-md">Subtotal: {item.item_subtotal}</span>
              </div>
            </div>
          ))}
        </div>
        {/* Other form fields */}
        <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Subtotal</label>
                    <input className="mt-1 p-2 w-full border border-gray-300 rounded-md"  type="number" name="subtotal" value={formData.subtotal} readOnly />
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
                    <input className="mt-1 p-2 w-full border border-gray-300 rounded-md" type="number" name="total" value={formData.total} readOnly />
                </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
          Create Order
        </button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
