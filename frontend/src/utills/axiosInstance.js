// import axios from 'axios';

// const axiosInstance = axios.create({
//   baseURL: 'http://localhost:5000/api', // include full backend URL
//   withCredentials: true,
// });

// // Auto add token if you want
// axiosInstance.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// export default axiosInstance;




// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://store-rating-system-one.vercel.app/api',
  withCredentials: true,
});

// No interceptor to read localStorage here

export default api;