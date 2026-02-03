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
      {/* Hero Section - Blue Wood Board Style */}
      <div className="bg-gradient-to-b from-blue-950 via-blue-900 to-blue-950 text-white py-32 relative overflow-hidden" style={{
        backgroundImage: `
          linear-gradient(135deg, 
            #0f3a7d 0%, #1e3a8a 15%, #1e40af 25%, 
            #1e3a8a 35%, #0f3a7d 50%, #1e3a8a 65%, 
            #1e40af 75%, #1e3a8a 85%, #0f3a7d 100%
          ),
          repeating-linear-gradient(
            90deg,
            transparent 0px,
            transparent 3px,
            rgba(0, 0, 0, 0.15) 3px,
            rgba(0, 0, 0, 0.15) 4px,
            transparent 4px,
            transparent 7px,
            rgba(0, 0, 0, 0.08) 7px,
            rgba(0, 0, 0, 0.08) 8px
          ),
          repeating-linear-gradient(
            0deg,
            transparent 0px,
            transparent 2px,
            rgba(255, 255, 255, 0.08) 2px,
            rgba(255, 255, 255, 0.08) 3px,
            transparent 3px,
            transparent 5px,
            rgba(255, 255, 255, 0.04) 5px,
            rgba(255, 255, 255, 0.04) 6px
          ),
          repeating-linear-gradient(
            45deg,
            transparent 0px,
            transparent 1px,
            rgba(139, 90, 43, 0.1) 1px,
            rgba(139, 90, 43, 0.1) 2px
          )
        `,
        backgroundSize: '100% 100%, 100% 100%, 100% 100%, 100% 100%',
        textShadow: '3px 3px 8px rgba(0, 0, 0, 0.6), 0 0 15px rgba(59, 130, 246, 0.4)'
      }}>
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <h1 className="text-7xl font-black mb-4 tracking-wider" style={{
            textShadow: '4px 4px 12px rgba(0, 0, 0, 0.7), 0 0 20px rgba(96, 165, 250, 0.6), 2px 2px 0 rgba(139, 90, 43, 0.3)',
            letterSpacing: '2px'
          }}>BE Creative SD</h1>
          <p className="text-3xl mb-8 opacity-95 font-semibold" style={{
            textShadow: '2px 2px 6px rgba(0, 0, 0, 0.5)'
          }}>Premium Natural & Custom Products</p>
          <div className="space-x-4 flex justify-center flex-wrap gap-4">
            <Link to="/be-natural" className="bg-white text-blue-900 px-8 py-4 rounded-lg font-bold hover:bg-blue-50 transition shadow-2xl hover:shadow-2xl hover:scale-105 transform">
              Explore Natural
            </Link>
            <Link to="/be-custom" className="bg-blue-700 border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-600 transition shadow-2xl hover:shadow-2xl hover:scale-105 transform">
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
