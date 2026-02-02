// Stripe Service - Temporarily disabled due to npm auth issues
// import { loadStripe } from '@stripe/js';

// Real implementation (will be active after npm packages installed)
// const STRIPE_PUBLIC_KEY = process.env.REACT_APP_STRIPE_PUBLIC_KEY || 'pk_test_51234567890';
// export const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

export const createPaymentIntent = async (amount, cartItems) => {
  try {
    const API_URL = window.API_CONFIG?.getApiUrl?.() || 'https://be-creativity-api.onrender.com/api';
    const response = await fetch(`${API_URL}/payments/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100),
        items: cartItems,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create payment intent');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};
