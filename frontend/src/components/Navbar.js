import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

export default function Navbar() {
  const { cart } = useContext(CartContext);
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  return (
    <nav className="bg-blue-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-blue-300">
              BE Creative SD
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/be-natural" className="hover:text-blue-300 transition">
              BE Natural
            </Link>
            <Link to="/be-custom" className="hover:text-blue-300 transition">
              BE Custom
            </Link>
            <Link to="/cart" className="hover:text-blue-300 transition relative">
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link to="/admin" className="hover:text-yellow-400 transition font-bold">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
