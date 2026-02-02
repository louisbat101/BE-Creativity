import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { StripePaymentWrapper } from '../components/StripePayment';

export default function Checkout() {
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  useEffect(() => {
    if (cart.length === 0 && !orderPlaced) {
      navigate('/cart');
    }
  }, [cart, navigate, orderPlaced]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentSuccess = async (paymentIntent) => {
    const order = {
      customer: {
        name: customerInfo.name,
        email: customerInfo.email,
        address: customerInfo.address,
        city: customerInfo.city,
        state: customerInfo.state,
        zip: customerInfo.zip
      },
      items: cart,
      totalAmount: total,
      paymentData: {
        paymentIntentId: paymentIntent.id,
        amount: total,
        status: 'completed'
      }
    };

    try {
      // Send order to backend
      const API_URL = window.API_CONFIG?.getApiUrl?.() || 'https://be-creativity-api.onrender.com/api';
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });

      if (!response.ok) {
        console.error('Failed to save order to backend');
      } else {
        const savedOrder = await response.json();
        console.log('Order saved:', savedOrder._id);
        // Also save to localStorage for display
        localStorage.setItem('lastOrder', JSON.stringify(savedOrder));
      }
    } catch (err) {
      console.error('Error saving order:', err);
    }

    setOrderPlaced(true);
    clearCart();

    setTimeout(() => {
      navigate('/');
    }, 3000);
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-4xl font-bold text-green-600 mb-4">✅ Payment Successful!</h1>
          <p className="text-gray-700 mb-2">Thank you for your order, {customerInfo.name}!</p>
          <p className="text-gray-600 mb-6">A confirmation email has been sent to {customerInfo.email}</p>
          <div className="bg-gray-100 p-4 rounded mb-6 text-left">
            <h3 className="font-semibold mb-2">Order Summary:</h3>
            <div className="space-y-1 text-sm">
              {cart.length > 0 && cart.map((item) => (
                <p key={item.id}>{item.name} x {item.quantity}: ${(item.price * item.quantity).toFixed(2)}</p>
              ))}
              <p className="border-t pt-2 mt-2">Subtotal: ${subtotal.toFixed(2)}</p>
              <p>Tax: ${tax.toFixed(2)}</p>
              <p className="font-bold text-lg text-green-600">Total: ${total.toFixed(2)}</p>
            </div>
          </div>
          <p className="text-gray-500 text-sm mb-6">Redirecting to home in 3 seconds...</p>
          <a href="/" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
            Continue Shopping
          </a>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-6">Add some products before checking out.</p>
          <a href="/" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
            Continue Shopping
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Customer Information */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Shipping Information</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={customerInfo.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={customerInfo.email}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Address *</label>
                <input
                  type="text"
                  name="address"
                  value={customerInfo.address}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-green-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={customerInfo.city}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">State *</label>
                  <input
                    type="text"
                    name="state"
                    value={customerInfo.state}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-green-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">ZIP Code *</label>
                <input
                  type="text"
                  name="zip"
                  value={customerInfo.zip}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-green-500"
                  required
                />
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-lg shadow-md h-fit">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Order Summary</h2>
            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between border-b pb-2">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (8%):</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-green-600 mt-4 pt-4 border-t">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Section */}
        <div className="mt-8">
          {paymentError && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              ❌ {paymentError}
            </div>
          )}
          <StripePaymentWrapper
            amount={total}
            cartItems={cart}
            customerInfo={customerInfo}
            onSuccess={handlePaymentSuccess}
            onError={setPaymentError}
          />
        </div>
      </div>
    </div>
  );
}
