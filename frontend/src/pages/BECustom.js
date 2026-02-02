import React, { useState, useEffect } from 'react';
import ProductList from '../components/ProductList';
import { subcategoryAPI } from '../services/api';

export default function BECustom() {
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const response = await subcategoryAPI.getByCategory('BE Custom');
        setSubcategories(response.data);
      } catch (err) {
        console.error('Failed to fetch subcategories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubcategories();
  }, []);

  return (
    <div>
      <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold">BE Custom</h1>
          <p className="text-lg mt-2">Custom Made Products</p>
        </div>
      </div>

      {/* Subcategories Filter */}
      {!loading && subcategories.length > 0 && (
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedSubcategory(null)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  selectedSubcategory === null
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All Products
              </button>
              {subcategories.map(sub => (
                <button
                  key={sub._id}
                  onClick={() => setSelectedSubcategory(sub.name)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    selectedSubcategory === sub.name
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <ProductList category="BE Custom" subcategory={selectedSubcategory} />
    </div>
  );
}

