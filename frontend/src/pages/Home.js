import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductList from '../components/ProductList';

export default function Home() {
  const [introduction, setIntroduction] = useState(
    'Welcome to BE Creativity SD! Discover our premium collection of natural and custom products designed to inspire your creativity. Explore our curated selection and find the perfect products for your needs.'
  );

  useEffect(() => {
    // Fetch introduction from backend/localStorage
    const savedIntro = localStorage.getItem('homeIntroduction');
    if (savedIntro) {
      setIntroduction(savedIntro);
    }
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">BE Creativity SD</h1>
          <p className="text-xl mb-8">Premium Natural & Custom Products</p>
          <div className="space-x-4">
            <Link to="/be-natural" className="bg-white text-green-600 px-8 py-3 rounded-lg font-bold hover:bg-green-50 transition">
              Explore Natural
            </Link>
            <Link to="/be-custom" className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-blue-600 transition">
              Explore Custom
            </Link>
          </div>
        </div>
      </div>

      {/* Introduction Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-white rounded-lg shadow-md p-8">
            <p className="text-lg text-gray-700 leading-relaxed">{introduction}</p>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Featured Products</h2>
        <ProductList category={null} />
      </div>
    </div>
  );
}
