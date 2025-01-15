// src/pages/EditProduct.jsx
import React from 'react';
import Sidebar from '../components/sidebar';
import ProductForm from '../components/productForm';
import Logger from '../components/logger';

export default function EditProduct() {
  return (
    <div className="flex bg-white text-black dark:bg-gray-900 dark:text-white">
      <Logger eventName='page_view' eventData={{page: 'editProduct'}} />
      <Sidebar />
      <div className="flex-1 p-6">
        <ProductForm mode="edit" />
      </div>
    </div>
  );
}