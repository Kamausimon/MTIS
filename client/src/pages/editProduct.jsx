// src/pages/EditProduct.jsx
import React from 'react';
import Sidebar from '../components/sidebar';
import ProductForm from '../components/productForm';

export default function EditProduct() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <ProductForm mode="edit" />
      </div>
    </div>
  );
}