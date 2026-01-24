import React, { useContext, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { paymentAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function AdminPayments() {
  const [paymentLinks, setPaymentLinks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    amount: ''
  });
  const [loading, setLoading] = useState(false);
  const { token } = useContext(AuthContext);

  const fetchPaymentLinks = useCallback(async () => {
    try {
      const response = await paymentAPI.getAll(token);
      setPaymentLinks(response.data);
    } catch (err) {
      console.error('Failed to fetch payment links:', err);
    }
  }, [token]);

  useEffect(() => {
    fetchPaymentLinks();
  }, [fetchPaymentLinks]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await paymentAPI.createLink(formData, token);
      setFormData({ name: '', description: '', amount: '' });
      setShowForm(false);
      fetchPaymentLinks();
    } catch (err) {
      console.error('Failed to create payment link:', err);
      alert('Failed to create payment link. Check your Stripe configuration.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this payment link?')) {
      try {
        await paymentAPI.delete(id, token);
        fetchPaymentLinks();
      } catch (err) {
        console.error('Failed to delete:', err);
      }
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
          <Link to="/admin/orders" className="block px-6 py-3 hover:bg-slate-800 transition">
            Orders
          </Link>
          <Link to="/admin/payments" className="block px-6 py-3 bg-slate-800">
            Payment Links
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Payment Links</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition"
          >
            {showForm ? 'Cancel' : 'Create Link'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">Create Payment Link</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Link Name</label>
                <input
                  type="text"
                  placeholder="e.g., Product A Payment"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded px-4 py-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Description</label>
                <textarea
                  placeholder="Link description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-gray-300 rounded px-4 py-2"
                  rows="3"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 font-bold mb-2">Amount (USD)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full border border-gray-300 rounded px-4 py-2"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg transition disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Payment Link'}
              </button>
            </form>
          </div>
        )}

        {/* Payment Links List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {paymentLinks.map(link => (
            <div key={link._id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-2">{link.name}</h3>
              <p className="text-gray-600 mb-2">{link.description}</p>
              <p className="text-2xl font-bold text-green-600 mb-4">${link.amount}</p>
              <div className="space-y-2">
                <a
                  href={link.paymentLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded text-center transition"
                >
                  View Link
                </a>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(link.paymentLink);
                    alert('Link copied to clipboard!');
                  }}
                  className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 rounded transition"
                >
                  Copy Link
                </button>
                <button
                  onClick={() => handleDelete(link._id)}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {paymentLinks.length === 0 && !showForm && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">No payment links yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition"
            >
              Create First Link
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
