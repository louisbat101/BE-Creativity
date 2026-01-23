import React from 'react';
import ProductList from '../components/ProductList';

export default function BECustom() {
  return (
    <div>
      <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold">BE Custom</h1>
          <p className="text-lg mt-2">Custom Made Products</p>
        </div>
      </div>
      <ProductList category="BE Custom" />
    </div>
  );
}
