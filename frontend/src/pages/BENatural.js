import React from 'react';
import ProductList from '../components/ProductList';

export default function BENatural() {
  return (
    <div>
      <div className="bg-gradient-to-r from-green-400 to-green-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold">BE Natural</h1>
          <p className="text-lg mt-2">Premium Natural Products</p>
        </div>
      </div>
      <ProductList category="BE Natural" />
    </div>
  );
}
