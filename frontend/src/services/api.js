import axios from 'axios';

//const API_URL = 'https://my-fullstack-app-production-39ac.up.railway.app/api'; // Your live Railway URL
const API_URL = 'http://localhost:8080/api/';

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor to add the JWT to every request if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;