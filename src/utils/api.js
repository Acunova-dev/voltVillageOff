import axios from 'axios';

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
  login: (creds) => client.post('/auth/login/json', creds),
};

export const items = {
  getAll: (params) => client.get('/items/', { params }),
  getById: (id) => client.get(`/items/${id}`),
  create: (data) => client.post('/items/', data),
  update: (id, data) => client.put(`/items/${id}`, data),
  delete: (id) => client.delete(`/items/${id}`),
  getMyItems: () => client.get('/items/my-items/'),
};

export default client;