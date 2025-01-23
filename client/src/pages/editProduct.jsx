// src/pages/EditProduct.jsx
import React from 'react';
import Sidebar from '../components/Sidebar';
import ProductForm from '../components/productForm';


export default function EditProduct() {
  return (
    <div className="flex bg-white text-black dark:bg-gray-900 dark:text-white">
   
      <Sidebar />
      <div className="flex-1 p-6">
        <ProductForm mode="edit" />
      </div>
    </div>
  );
}