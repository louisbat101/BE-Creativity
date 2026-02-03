import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductList from '../components/ProductList';

export default function Home() {
  const [introduction, setIntroduction] = useState(
    'Welcome to BE Creative SD! Discover our premium collection of natural and custom products designed to inspire your creativity. Explore our curated selection and find the perfect products for your needs.'
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
      {/* Hero Section - Wood Board Style */}
      <div className="bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 text-white py-20 relative overflow-hidden" style={{
        backgroundImage: `
          linear-gradient(90deg, rgba(30, 58, 138, 0.9) 0%, rgba(37, 99, 235, 0.9) 50%, rgba(30, 58, 138, 0.9) 100%),
          repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.1) 2px, rgba(0, 0, 0, 0.1) 4px),
          repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255, 255, 255, 0.05) 1px, rgba(255, 255, 255, 0.05) 2px)
        `,
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
      }}>
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <h1 className="text-6xl font-bold mb-4" style={{
            textShadow: '3px 3px 6px rgba(0, 0, 0, 0.5), 0 0 10px rgba(147, 197, 253, 0.5)'
          }}>BE Creative SD</h1>
          <p className="text-2xl mb-8 opacity-90">Premium Natural & Custom Products</p>
          <div className="space-x-4 flex justify-center flex-wrap gap-4">
            <Link to="/be-natural" className="bg-white text-blue-700 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition shadow-lg hover:shadow-xl">
              Explore Natural
            </Link>
            <Link to="/be-custom" className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-blue-800 transition shadow-lg">
              Explore Custom
            </Link>
          </div>
        </div>
      </div>

      {/* Introduction Section */}
      <div className="bg-gradient-to-b from-blue-50 to-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-white rounded-lg shadow-md p-8 border-l-4 border-blue-600">
            <p className="text-lg text-gray-700 leading-relaxed">{introduction}</p>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center text-blue-900">Featured Products</h2>
        <ProductList category={null} />
      </div>
    </div>
  );
}
