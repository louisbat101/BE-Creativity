import axios from 'axios';

// Get API URL dynamically - check every time since config.js may not be loaded yet
const getApiUrl = () => {
  // Try the global config (from public/config.js) first
  if (typeof window !== 'undefined' && window.API_CONFIG && typeof window.API_CONFIG.getApiUrl === 'function') {
    const url = window.API_CONFIG.getApiUrl();
    console.log('🔗 Using API_CONFIG:', url);
    return url;
  }
  
  // Fallback: detect hostname
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log('🔗 Using localhost:', 'http://localhost:5001/api');
      return 'http://localhost:5001/api';
    }
  }
  
  // Default to production API
  console.log('🔗 Using production API:', 'https://be-creativity-api.onrender.com/api');
  return 'https://be-creativity-api.onrender.com/api';
};

// Don't cache API_URL - call getApiUrl() for each request
// This ensures we always have the correct URL based on current hostname

export const authAPI = {
  login: (password) => axios.post(`${getApiUrl()}/auth/admin-login`, { password }),
  verify: (token) => axios.get(`${getApiUrl()}/auth/verify`, {
    headers: { Authorization: `Bearer ${token}` }
  })
};

export const productAPI = {
  getAll: (category) => {
    const url = category ? `${getApiUrl()}/products?category=${category}` : `${getApiUrl()}/products`;
    return axios.get(url);
  },
  getById: (id) => axios.get(`${getApiUrl()}/products/${id}`),
  create: (data, token) => axios.post(`${getApiUrl()}/products`, data, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  update: (id, data, token) => axios.put(`${getApiUrl()}/products/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  delete: (id, token) => axios.delete(`${getApiUrl()}/products/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
};

export const subcategoryAPI = {
  getByCategory: (category) => axios.get(`${getApiUrl()}/subcategories/${category}`),
  getAll: () => axios.get(`${getApiUrl()}/subcategories`),
  create: (data, token) => axios.post(`${getApiUrl()}/subcategories`, data, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  update: (id, data, token) => axios.put(`${getApiUrl()}/subcategories/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  delete: (id, token) => axios.delete(`${getApiUrl()}/subcategories/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
};

export const orderAPI = {
  create: (data) => axios.post(`${getApiUrl()}/orders`, data),
  getById: (id) => axios.get(`${getApiUrl()}/orders/${id}`),
  getAll: (token) => axios.get(`${getApiUrl()}/orders`, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  updateStatus: (id, status, token) => axios.put(`${getApiUrl()}/orders/${id}/status`, { status }, {
    headers: { Authorization: `Bearer ${token}` }
  })
};

export const paymentAPI = {
  createLink: (data, token) => axios.post(`${getApiUrl()}/payments/create-link`, data, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  getAll: (token) => axios.get(`${getApiUrl()}/payments`, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  delete: (id, token) => axios.delete(`${getApiUrl()}/payments/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
};
