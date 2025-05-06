import axios from 'axios';
import rateLimiter from './rateLimiter';

export const API_BASE_URL = 'https://voltvillage-api.onrender.com/api/v1';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token
client.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Add request interceptor to check rate limit
client.interceptors.request.use(
  async (config) => {
    if (!rateLimiter.isRequestAllowed()) {
      throw new Error('Request blocked due to rate limiting');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      // Clear invalid token
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export const auth = {
  register: (data) => client.post('/users/users/', data),
  login: async (credentials) => {
    try {
      if (!rateLimiter.isRequestAllowed()) {
        throw new Error('Too many login attempts. Please wait a moment.');
      }
      return await client.post('/auth/login/json', credentials);
    } catch (error) {
      if (error.message.includes('rate limiting')) {
        throw new Error('Too many attempts. Please wait a moment before trying again.');
      }
      throw error;
    }
  },
};

export const items = {
  getAll: async (params) => {
    try {
      const response = await client.get('/items/', { params });
      // Return the array directly as that's what the API returns
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getById: (id) => client.get(`/items/${id}`),
  create: (data) => client.post('/items/', data),
  update: (id, data) => client.put(`/items/${id}`, data),
  delete: (id) => client.delete(`/items/${id}`),
  getMyItems: () => client.get('/items/my-items/'),
};

export const requests = {
  getAll: (params) => client.get('/requests/', { params }),
  getById: (id) => client.get(`/requests/${id}`),
  create: (data) => client.post('/requests/', data),
  update: (id, data) => client.put(`/requests/${id}`, data),
  delete: (id) => client.delete(`/requests/${id}`),
  getMyRequests: () => client.get('/requests/my-requests/'),
  makeOffer: (requestId, data) => client.post(`/requests/${requestId}/offers`, data),
  getOffers: (requestId) => client.get(`/requests/${requestId}/offers`),
};

export default client;