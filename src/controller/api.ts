import axios from 'axios';
import { jwtDecode } from "jwt-decode"
import { forceLogout } from "../utils/logout";

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5056';

// Função para validar token
const isValidToken = (token: string): boolean => {
  if (!token || typeof token !== 'string') return false
  const parts = token.split('.')
  return parts.length === 3 && parts.every(part => part && part.length > 0)
}

const api = axios.create({
    baseURL: API_BASE,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: false,
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        if (!isValidToken(token)) {
          console.warn("Token inválido detectado, removendo...");
          forceLogout();
          return Promise.reject("Token inválido");
        }

        const decoded: any = jwtDecode(token);

        if (decoded.exp * 1000 < Date.now()) {
          forceLogout();
          return Promise.reject("Token expirado");
        }

        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error("Erro ao decodificar token:", error);
        forceLogout();
        return Promise.reject("Token inválido");
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  response => response,

  (error) => {
    if (error.response?.status === 401) {
      forceLogout();
    }
    return Promise.reject(error);
  }
);

const googleAuth = {
  login: (googleData: {
    email: string,
    name: string,
    googleId: string,
    picture?: string
  }) => api.post('/login/google', googleData),
  
  register: async (googleData: {
    email: string,
    name: string,
    googleId: string,
    picture?: string,
    isOver16: boolean
  }) => {
    try {
      return await api.post('/usuario/google', googleData)
    } catch (error: any) {
      if (error.response?.status === 409) {
        throw new Error('Usuário já cadastrado com este e-mail do Google')
      }
      throw error
    }
  }
}

export { googleAuth }
export default api;
