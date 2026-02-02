import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import SubcategoryManager from '../components/SubcategoryManager';

export default function AdminSettings() {
  const { logout, token } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const [introduction, setIntroduction] = useState('');
  const [footerData, setFooterData] = useState({
    email: 'info@becreativity.com',
    phone: '+1 (555) 123-4567',
    hours: 'Mon - Fri, 9AM - 6PM',
    company: 'BE Creative SD',
    address: '123 Creative Street',
    city: 'San Diego, CA 92101',
    country: 'United States',
    disclaimer: 'BE Creative SD is an e-commerce platform offering natural and custom products. All products are provided "as is" without any warranty. We are not responsible for any direct, indirect, incidental, or consequential damages arising from the use of our products or services. Prices and availability are subject to change without notice. By using this website, you agree to our terms and conditions.'
  });
  const [savedMessage, setSavedMessage] = useState('');
  const [activeTab, setActiveTab] = useState('introduction');
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [apiKeys, setApiKeys] = useState({
    stripeSecretKey: '',
    stripePublishableKey: ''
  });
  const [apiError, setApiError] = useState('');
  const [apiSuccess, setApiSuccess] = useState('');

  useEffect(() => {
    // Load introduction from localStorage
    const savedIntro = localStorage.getItem('homeIntroduction');
    if (savedIntro) {
      setIntroduction(savedIntro);
    } else {
      setIntroduction('Welcome to BE Creative SD! Discover our premium collection of natural and custom products designed to inspire your creativity. Explore our curated selection and find the perfect products for your needs.');
    }

    // Load footer data from localStorage
    const savedFooter = localStorage.getItem('footerData');
    if (savedFooter) {
      setFooterData(JSON.parse(savedFooter));
    }

    // Load API keys from localStorage
    const savedApiKeys = localStorage.getItem('apiKeys');
    if (savedApiKeys) {
      setApiKeys(JSON.parse(savedApiKeys));
    }
  }, []);

  const handleSaveIntroduction = () => {
    localStorage.setItem('homeIntroduction', introduction);
    setSavedMessage('✓ Introduction saved successfully!');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  const handleSaveFooter = () => {
    localStorage.setItem('footerData', JSON.stringify(footerData));
    setSavedMessage('✓ Footer saved successfully!');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  const handleFooterChange = (field, value) => {
    setFooterData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSavePassword = () => {
    setPasswordError('');
    setPasswordSuccess('');

    // Validation
    if (!passwordData.currentPassword) {
      setPasswordError('Current password is required');
      return;
    }
    if (!passwordData.newPassword) {
      setPasswordError('New password is required');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    // Get stored password from localStorage
    const storedPassword = localStorage.getItem('adminPassword') || 'admin123';
    
    if (passwordData.currentPassword !== storedPassword) {
      setPasswordError('Current password is incorrect');
      return;
    }

    // Save new password
    localStorage.setItem('adminPassword', passwordData.newPassword);
    setPasswordSuccess('✓ Password changed successfully!');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setTimeout(() => setPasswordSuccess(''), 3000);
  };

  const handleApiKeyChange = (field, value) => {
    setApiKeys(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveApiKeys = async () => {
    setApiError('');
    setApiSuccess('');

    // Validation
    if (!apiKeys.stripeSecretKey.trim()) {
      setApiError('Stripe Secret Key is required');
      return;
    }
    if (!apiKeys.stripePublishableKey.trim()) {
      setApiError('Stripe Publishable Key is required');
      return;
    }

    if (!apiKeys.stripeSecretKey.startsWith('sk_')) {
      setApiError('Secret Key must start with "sk_"');
      return;
    }

    if (!apiKeys.stripePublishableKey.startsWith('pk_')) {
      setApiError('Publishable Key must start with "pk_"');
      return;
    }

    // Save API keys to localStorage
    localStorage.setItem('apiKeys', JSON.stringify(apiKeys));

    // Send Stripe key to backend
    try {
      const response = await fetch('http://localhost:5001/api/settings/stripe-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          secretKey: apiKeys.stripeSecretKey
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to configure Stripe');
      }

      setApiSuccess('✓ Stripe API configured successfully! Products will now sync automatically.');
      setTimeout(() => setApiSuccess(''), 5000);
    } catch (err) {
      setApiError('Failed to connect with Stripe backend: ' + err.message);
      console.error('Error configuring Stripe:', err);
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
          <Link to="/admin/settings" className="block px-6 py-3 bg-slate-800 hover:bg-slate-800 transition">
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
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Settings</h1>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 flex-wrap">
            <button
              onClick={() => setActiveTab('introduction')}
              className={`px-6 py-2 rounded-lg font-bold transition ${activeTab === 'introduction' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
            >
              Home Introduction
            </button>
            <button
              onClick={() => setActiveTab('subcategories')}
              className={`px-6 py-2 rounded-lg font-bold transition ${activeTab === 'subcategories' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 border-2 border-green-500'}`}
            >
              ✨ Subcategories
            </button>
            <button
              onClick={() => setActiveTab('footer')}
              className={`px-6 py-2 rounded-lg font-bold transition ${activeTab === 'footer' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
            >
              Footer Info
            </button>
            <button
              onClick={() => setActiveTab('api')}
              className={`px-6 py-2 rounded-lg font-bold transition ${activeTab === 'api' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
            >
              API Settings
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`px-6 py-2 rounded-lg font-bold transition ${activeTab === 'password' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
            >
              Change Password
            </button>
          </div>

          {savedMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
              {savedMessage}
            </div>
          )}

          {/* Introduction Tab */}
          {activeTab === 'introduction' && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">Home Page Introduction</h2>
              <p className="text-gray-600 mb-4">Edit the introduction text that appears on the home page between the hero section and featured products.</p>
              
              <label className="block mb-4">
                <span className="text-sm font-bold text-gray-700 mb-2 block">Introduction Text</span>
                <textarea
                  value={introduction}
                  onChange={(e) => setIntroduction(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="6"
                  placeholder="Enter the introduction text..."
                />
              </label>

              <button
                onClick={handleSaveIntroduction}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition"
              >
                Save Introduction
              </button>

              {/* Preview */}
              <div className="bg-white rounded-lg shadow-md p-6 mt-8">
                <h3 className="text-2xl font-bold mb-4">Preview</h3>
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <p className="text-lg text-gray-700 leading-relaxed">{introduction}</p>
                </div>
              </div>
            </div>
          )}

          {/* Subcategories Tab */}
          {activeTab === 'subcategories' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Manage Subcategories</h2>
              <p className="text-gray-600 mb-6">Add, edit, or delete subcategories for BE Natural and BE Custom product categories.</p>
              <SubcategoryManager token={token} />
            </div>
          )}

          {/* Footer Tab */}
          {activeTab === 'footer' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Footer Information</h2>
              <p className="text-gray-600 mb-6">Edit the contact information, location, and disclaimer that appear in the website footer.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Contact Info */}
                <div>
                  <h3 className="text-lg font-bold mb-4 text-gray-700">Contact Information</h3>
                  <label className="block mb-3">
                    <span className="text-sm font-bold text-gray-700 mb-1 block">Email</span>
                    <input
                      type="email"
                      value={footerData.email}
                      onChange={(e) => handleFooterChange('email', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Email address"
                    />
                  </label>
                  <label className="block mb-3">
                    <span className="text-sm font-bold text-gray-700 mb-1 block">Phone</span>
                    <input
                      type="tel"
                      value={footerData.phone}
                      onChange={(e) => handleFooterChange('phone', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Phone number"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-bold text-gray-700 mb-1 block">Business Hours</span>
                    <input
                      type="text"
                      value={footerData.hours}
                      onChange={(e) => handleFooterChange('hours', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Mon - Fri, 9AM - 6PM"
                    />
                  </label>
                </div>

                {/* Location Info */}
                <div>
                  <h3 className="text-lg font-bold mb-4 text-gray-700">Location</h3>
                  <label className="block mb-3">
                    <span className="text-sm font-bold text-gray-700 mb-1 block">Company Name</span>
                    <input
                      type="text"
                      value={footerData.company}
                      onChange={(e) => handleFooterChange('company', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Company name"
                    />
                  </label>
                  <label className="block mb-3">
                    <span className="text-sm font-bold text-gray-700 mb-1 block">Street Address</span>
                    <input
                      type="text"
                      value={footerData.address}
                      onChange={(e) => handleFooterChange('address', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Street address"
                    />
                  </label>
                  <label className="block mb-3">
                    <span className="text-sm font-bold text-gray-700 mb-1 block">City & State</span>
                    <input
                      type="text"
                      value={footerData.city}
                      onChange={(e) => handleFooterChange('city', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="City, State ZIP"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-bold text-gray-700 mb-1 block">Country</span>
                    <input
                      type="text"
                      value={footerData.country}
                      onChange={(e) => handleFooterChange('country', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Country"
                    />
                  </label>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-4 text-gray-700">Disclaimer</h3>
                <textarea
                  value={footerData.disclaimer}
                  onChange={(e) => handleFooterChange('disclaimer', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="5"
                  placeholder="Enter disclaimer text..."
                />
              </div>

              <button
                onClick={handleSaveFooter}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition"
              >
                Save Footer
              </button>

              {/* Preview */}
              <div className="bg-slate-900 text-white rounded-lg p-6 mt-8">
                <h3 className="text-2xl font-bold mb-6">Footer Preview</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
                  <div>
                    <h4 className="font-bold mb-2">Contact Info</h4>
                    <p className="text-sm text-gray-300">Email: {footerData.email}</p>
                    <p className="text-sm text-gray-300">Phone: {footerData.phone}</p>
                    <p className="text-sm text-gray-300">Hours: {footerData.hours}</p>
                  </div>
                  <div>
                    <h4 className="font-bold mb-2">Location</h4>
                    <p className="text-sm text-gray-300">{footerData.company}</p>
                    <p className="text-sm text-gray-300">{footerData.address}</p>
                    <p className="text-sm text-gray-300">{footerData.city}</p>
                    <p className="text-sm text-gray-300">{footerData.country}</p>
                  </div>
                </div>
                <div className="border-t border-gray-700 pt-4">
                  <h4 className="font-bold mb-2">Disclaimer</h4>
                  <p className="text-sm text-gray-300">{footerData.disclaimer}</p>
                </div>
              </div>
            </div>
          )}

          {/* API Settings Tab */}
          {activeTab === 'api' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">API Settings</h2>
              <p className="text-gray-600 mb-6">Configure your Stripe API keys to enable payment processing. Get your keys from <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Stripe Dashboard</a>.</p>

              {apiError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
                  {apiError}
                </div>
              )}

              {apiSuccess && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
                  {apiSuccess}
                </div>
              )}

              <div className="max-w-2xl space-y-6">
                {/* Stripe Secret Key */}
                <div>
                  <label className="block mb-2">
                    <span className="text-sm font-bold text-gray-700 mb-2 block">Stripe Secret Key</span>
                    <input
                      type="password"
                      value={apiKeys.stripeSecretKey}
                      onChange={(e) => handleApiKeyChange('stripeSecretKey', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                      placeholder="sk_test_..."
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-1">🔐 Keep this secret. It will be hidden from view.</p>
                </div>

                {/* Stripe Publishable Key */}
                <div>
                  <label className="block mb-2">
                    <span className="text-sm font-bold text-gray-700 mb-2 block">Stripe Publishable Key</span>
                    <input
                      type="text"
                      value={apiKeys.stripePublishableKey}
                      onChange={(e) => handleApiKeyChange('stripePublishableKey', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                      placeholder="pk_test_..."
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-1">This key is safe to share and embed in your frontend code.</p>
                </div>

                <button
                  onClick={handleSaveApiKeys}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition w-full"
                >
                  Save API Keys
                </button>
              </div>

              {/* Info Cards */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-bold text-blue-900 mb-2">📍 Test Keys</h4>
                  <p className="text-sm text-blue-800">Use test keys for development and testing. Stripe will show "Test" in your dashboard when using test keys.</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-bold text-green-900 mb-2">🚀 Live Keys</h4>
                  <p className="text-sm text-green-800">Switch to live keys in production to accept real payments. Keep live keys secure.</p>
                </div>
              </div>

              {/* Setup Instructions */}
              <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-bold text-yellow-900 mb-3">⚡ How to Get Your Keys:</h4>
                <ol className="text-sm text-yellow-800 space-y-2 ml-4">
                  <li>1. Go to <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Stripe Dashboard</a></li>
                  <li>2. Click on "API Keys" in the left sidebar</li>
                  <li>3. Copy your "Secret key" (starts with sk_)</li>
                  <li>4. Copy your "Publishable key" (starts with pk_)</li>
                  <li>5. Paste them into the fields above</li>
                  <li>6. Click "Save API Keys"</li>
                </ol>
              </div>
            </div>
          )}

          {/* Password Tab */}
          {activeTab === 'password' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Change Admin Password</h2>
              <p className="text-gray-600 mb-6">Update your admin login password to keep your account secure.</p>

              {passwordError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
                  {passwordError}
                </div>
              )}

              {passwordSuccess && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
                  {passwordSuccess}
                </div>
              )}

              <div className="max-w-md space-y-4">
                <label className="block">
                  <span className="text-sm font-bold text-gray-700 mb-1 block">Current Password</span>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter current password"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-bold text-gray-700 mb-1 block">New Password</span>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter new password (minimum 6 characters)"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-bold text-gray-700 mb-1 block">Confirm Password</span>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Confirm new password"
                  />
                </label>

                <button
                  onClick={handleSavePassword}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition w-full"
                >
                  Change Password
                </button>
              </div>

              <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>⚠️ Important:</strong> Remember your new password. You will need it to log in next time. The password is stored securely in your browser.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
