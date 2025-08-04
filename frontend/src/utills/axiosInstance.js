// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://store-rating-system-one.vercel.app/api',
  withCredentials: true,
});

// No interceptor to read localStorage here

export default api;