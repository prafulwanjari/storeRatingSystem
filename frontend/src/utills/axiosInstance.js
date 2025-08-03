import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://store-rating-system-lovat.vercel.app/api', // include full backend URL
  withCredentials: true,
});

// Auto add token if you want
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosInstance;