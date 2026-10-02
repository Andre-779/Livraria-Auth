import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000'

});

api.interceptors.request.use(
  (config) => {
    // Busca o token JWT que seu backend gerou e salvou no localStorage durante o login
    const token = localStorage.getItem('@App:token');
    
    // Se o token existir, injeta ele automaticamente no cabeçalho Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    // Trata falhas antes do envio da requisição
    return Promise.reject(error);
  }
);

export default api;