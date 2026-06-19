import axios from 'axios';
 

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
 
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && !token.startsWith('mock_token_')) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
 
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error.response?.data;
    const mensaje =
      data?.error ||
      (data?.detalles && Object.values(data.detalles)[0]) ||
      'Ocurrió un error al conectar con el servidor';
 
    return Promise.reject(new Error(mensaje));
  }
);