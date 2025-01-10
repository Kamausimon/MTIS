import React from 'react';
import Sidebar from '../components/sidebar';
import SuppliesForm from '../components/suppliesForm';

export default function CreateSupplier() {
    
  return (
    <div>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6">
          <h1 className="text-3xl font-bold mb-4">Create Supply</h1>
          <SuppliesForm />
        </div>
      </div>
    </div>
  );
}