// src/pages/CreateProduct.jsx
import React from 'react';
import Sidebar from '../components/sidebar';
import ProductForm from '../components/productForm';


export default function CreateProduct() {
  return (
    <div className="flex bg-white text-black dark:bg-gray-900 dark:text-white">
  
      <Sidebar />
      <div className="flex-1 p-6">
        <ProductForm mode="create" />
      </div>
    </div>
  );
}