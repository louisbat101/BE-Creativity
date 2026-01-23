import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function AdminDashboard() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch products
      const productsRes = await fetch('http://localhost:5001/api/products');
      const products = await productsRes.json();

      // Fetch orders
      const ordersRes = await fetch('http://localhost:5001/api/orders');
      const orders = await ordersRes.json();

      // Calculate stats
      const pendingOrders = orders.filter(o => o.status === 'pending').length;
      const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        pendingOrders: pendingOrders,
        totalRevenue: totalRevenue
      });
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white">
        <div className="p-6">
          <h1 className="text-2xl font-bold">BE Creative SD</h1>
          <p className="text-sm text-gray-400">Admin Panel</p>
        </div>
        <nav className="mt-8">
          <Link to="/admin/dashboard" className="block px-6 py-3 hover:bg-slate-800 transition">
            Dashboard
          </Link>
          <Link to="/admin/products" className="block px-6 py-3 hover:bg-slate-800 transition">
            Products
          </Link>
          <Link to="/admin/orders" className="block px-6 py-3 hover:bg-slate-800 transition">
            Orders
          </Link>
          <Link to="/admin/payments" className="block px-6 py-3 hover:bg-slate-800 transition">
            Payment Links
          </Link>
          <Link to="/admin/settings" className="block px-6 py-3 hover:bg-slate-800 transition">
            Settings
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-left px-6 py-3 hover:bg-red-600 transition mt-8"
          >
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-gray-600 text-sm font-bold mb-2">Total Products</h3>
              <p className="text-3xl font-bold text-green-600">{stats.totalProducts}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-gray-600 text-sm font-bold mb-2">Total Orders</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.totalOrders}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-gray-600 text-sm font-bold mb-2">Pending Orders</h3>
              <p className="text-3xl font-bold text-yellow-600">{stats.pendingOrders}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-gray-600 text-sm font-bold mb-2">Total Revenue</h3>
              <p className="text-3xl font-bold text-purple-600">${stats.totalRevenue.toFixed(2)}</p>
            </div>
          </div>

          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link to="/admin/products" className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg text-center transition">
                Manage Products
              </Link>
              <Link to="/admin/payments" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-center transition">
                Create Payment Link
              </Link>
              <Link to="/admin/orders" className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg text-center transition">
                View Orders
              </Link>
              <Link to="/admin/settings" className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg text-center transition">
                Settings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
