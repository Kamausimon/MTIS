import React, { useState, useEffect } from "react";
import Sidebar from "../components/sidebar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [supplierProducts, setSupplierProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          "http://localhost:4000/api/v1/suppliers/getAllSuppliers",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const suppliersData = response.data.data.suppliers || [];
        setSuppliers(suppliersData);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch suppliers");
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  useEffect(() => {
    const fetchProductsForSuppliers = async () => {
      try {
        const token = localStorage.getItem("token");
        const productsBySupplier = {};

        await Promise.all(
          suppliers.map(async (supplier) => {
            const productIds = supplier.products.map((p) => p.Product_id);
            const productPromises = productIds.map((id) =>
              axios
                .get(`http://localhost:4000/api/v1/products/${id}`, {
                  headers: { Authorization: `Bearer ${token}` },
                })
                .then((res) => res.data.data.singleProduct)
            );
            const products = await Promise.all(productPromises);
            productsBySupplier[supplier._id] = products;
          })
        );

        setSupplierProducts(productsBySupplier);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch products");
      }
    };

    if (suppliers.length > 0) {
      fetchProductsForSuppliers();
    }
  }, [suppliers]);

  const handleCreate = () => {
    navigate("/createSupplier");
  };

  return (
    <div>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-4">Create Suppliers</h1>
              <p className="text-sm">Welcome to your suppliers page.</p>
              <p className="text-sm mb-4">
                Here you can view all suppliers and create new ones.
              </p>
            </div>
            <div>
              <button
                onClick={handleCreate}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Create Supplier
              </button>
            </div>
          </div>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b border-gray-200">Name</th>
                  <th className="py-2 px-4 border-b border-gray-200">Phone</th>
                  <th className="py-2 px-4 border-b border-gray-200">Email</th>
                  <th className="py-2 px-4 border-b border-gray-200">
                    Products
                  </th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((supplier) => (
                  <tr key={supplier._id}>
                    <td className="py-2 px-4 border-b border-gray-200">
                      {supplier.name}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      {supplier.phone}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      {supplier.email}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      {supplierProducts[supplier._id] &&
                      supplierProducts[supplier._id].length > 0 ? (
                        <ul>
                          {supplierProducts[supplier._id].map((product, index) => (
                            <li key={index}>{product.name}</li>
                          ))}
                        </ul>
                      ) : (
                        "No products"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
