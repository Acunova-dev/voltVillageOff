import axios from 'axios';

export const API_BASE_URL = '/api/v1';

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

export default client;