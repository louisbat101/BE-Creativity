import axios from 'axios';

// Always use Render backend for production, use localhost only if explicitly on localhost
const API_URL = (() => {
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:5001/api';
  }
  // For production (becreativesd.com or any deployed URL), use Render API
  return 'https://be-creativity-api.onrender.com/api';
})();

// Debug log
console.log('🔗 API URL:', API_URL);

export const authAPI = {
  login: (password) => axios.post(`${API_URL}/auth/admin-login`, { password }),
  verify: (token) => axios.get(`${API_URL}/auth/verify`, {
    headers: { Authorization: `Bearer ${token}` }
  })
};

export const productAPI = {
  getAll: (category) => {
    const url = category ? `${API_URL}/products?category=${category}` : `${API_URL}/products`;
    return axios.get(url);
  },
  getById: (id) => axios.get(`${API_URL}/products/${id}`),
  create: (data, token) => axios.post(`${API_URL}/products`, data, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  update: (id, data, token) => axios.put(`${API_URL}/products/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  delete: (id, token) => axios.delete(`${API_URL}/products/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
};

export const subcategoryAPI = {
  getByCategory: (category) => axios.get(`${API_URL}/subcategories/${category}`),
  getAll: () => axios.get(`${API_URL}/subcategories`),
  create: (data, token) => axios.post(`${API_URL}/subcategories`, data, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  update: (id, data, token) => axios.put(`${API_URL}/subcategories/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  delete: (id, token) => axios.delete(`${API_URL}/subcategories/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
};

export const orderAPI = {
  create: (data) => axios.post(`${API_URL}/orders`, data),
  getById: (id) => axios.get(`${API_URL}/orders/${id}`),
  getAll: (token) => axios.get(`${API_URL}/orders`, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  updateStatus: (id, status, token) => axios.put(`${API_URL}/orders/${id}/status`, { status }, {
    headers: { Authorization: `Bearer ${token}` }
  })
};

export const paymentAPI = {
  createLink: (data, token) => axios.post(`${API_URL}/payments/create-link`, data, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  getAll: (token) => axios.get(`${API_URL}/payments`, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  delete: (id, token) => axios.delete(`${API_URL}/payments/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
};
