import React from 'react';
import Sidebar from '../components/sidebar';
import SupplierForm from '../components/supplierForm';


export default function CreateSupplier() {

  return (
    <div>
      <div className="flex bg-white text-black dark:bg-gray-900 dark:text-white">
        <Sidebar />
        <div className="flex-1 p-6">
          <h1 className="text-3xl font-bold mb-4">Create Supplier</h1>
          <SupplierForm />
        </div>
      </div>
    </div>
  );
}