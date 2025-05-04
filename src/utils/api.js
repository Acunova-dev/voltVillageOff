import axios from 'axios';

export const API_BASE_URL = 'https://voltvillage-api.onrender.com/api/v1';

// Set the default token in localStorage
const DEFAULT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDYzNTQwMDcsInN1YiI6IjMifQ.1pAAb83MU1CdtWWcZ_TPTTv3U-l55_Bw4Y219Z2KkB8';
localStorage.setItem('token', DEFAULT_TOKEN);

const client = axios.create({
  baseURL: API_BASE_URL,
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const auth = {
  register: (data) => client.post('/users/users/', data),
  login: (creds) => client.post('/users/login/', creds),
};

export const items = {
  getAll: (params) => client.get('/items/', { params }),
  getById: (id) => client.get(`/items/${id}`),
  create: (data) => client.post('/items/', data),
  update: (id, data) => client.put(`/items/${id}`, data),
  delete: (id) => client.delete(`/items/${id}`),
};

export default client;