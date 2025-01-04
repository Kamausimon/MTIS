// src/pages/CreateProduct.jsx
import React from 'react';
import Sidebar from '../components/sidebar';
import ProductForm from '../components/productForm';
import Logger from '../components/logger';

export default function CreateProduct() {
  return (
    <div className="flex">
      <Logger eventName='page_view' eventData={{page: 'createProduct'}} />
      <Sidebar />
      <div className="flex-1 p-6">
        <ProductForm mode="create" />
      </div>
    </div>
  );
}