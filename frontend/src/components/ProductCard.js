import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      <div className="h-48 flex items-center justify-center bg-gray-200 overflow-hidden">
        {product.images && product.images[0] ? (
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-400 text-4xl">📦</span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800">{product.name}</h3>
        <p className="text-gray-600 text-sm mt-2">{product.description}</p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-2xl font-bold text-green-600">${product.price}</span>
          <button
            onClick={handleAddToCart}
            className={`${
              justAdded 
                ? 'bg-blue-500 hover:bg-blue-600' 
                : 'bg-green-500 hover:bg-green-600'
            } text-white px-4 py-2 rounded transition`}
          >
            {justAdded ? '✓ Added!' : 'Add to Cart'}
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-2">Stock: {product.stock}</p>
      </div>
    </div>
  );
}
