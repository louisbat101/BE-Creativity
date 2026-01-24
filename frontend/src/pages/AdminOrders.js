import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const { token } = useContext(AuthContext);

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getAll(token);
      setOrders(response.data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await orderAPI.updateStatus(orderId, newStatus, token);
      fetchOrders();
    } catch (err) {
      console.error('Failed to update order:', err);
    }
  };

  const updatePaymentStatus = async (orderId, newPaymentStatus) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/payment-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ paymentStatus: newPaymentStatus })
      });
      if (response.ok) {
        fetchOrders();
      }
    } catch (err) {
      console.error('Failed to update payment status:', err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white">
        <div className="p-6">
          <h1 className="text-2xl font-bold">BE Creativity</h1>
        </div>
        <nav className="mt-8">
          <Link to="/admin/dashboard" className="block px-6 py-3 hover:bg-slate-800 transition">
            Dashboard
          </Link>
          <Link to="/admin/products" className="block px-6 py-3 hover:bg-slate-800 transition">
            Products
          </Link>
          <Link to="/admin/orders" className="block px-6 py-3 bg-slate-800">
            Orders
          </Link>
          <Link to="/admin/payments" className="block px-6 py-3 hover:bg-slate-800 transition">
            Payment Links
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Orders</h1>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 text-left">Order ID</th>
                <th className="px-6 py-3 text-left">Customer</th>
                <th className="px-6 py-3 text-left">Amount</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Payment Status</th>
                <th className="px-6 py-3 text-left">Card Last 4</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-sm">{order.orderNumber}</td>
                  <td className="px-6 py-4">{order.customer?.name || 'N/A'}</td>
                  <td className="px-6 py-4 font-bold">${order.totalAmount?.toFixed(2) || 0}</td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status || 'pending'}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.paymentStatus || 'pending'}
                      onChange={(e) => updatePaymentStatus(order._id, e.target.value)}
                      className={`border border-gray-300 rounded px-2 py-1 font-semibold ${
                        order.paymentStatus === 'completed' ? 'bg-green-100 text-green-700' :
                        order.paymentStatus === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                      <option value="failed">Failed</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 font-mono">
                    {order.cardLast4 ? `****${order.cardLast4}` : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {orders.length === 0 && (
            <div className="p-8 text-center text-gray-600">
              No orders yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
