import React from 'react';
import Sidebar from '../components/Sidebar';
import CategoryForm from '../components/categoryForm';

export default function CreateCategory() {
  return (
    <div>
      <div className="flex bg-white text-black dark:bg-gray-900 dark:text-white">
        <Sidebar />
        <div className="flex-1 p-6">
          <h1 className="text-3xl font-bold mb-4">Create Custom Category</h1>
          <CategoryForm />
        </div>
      </div>
    </div>
  );
}