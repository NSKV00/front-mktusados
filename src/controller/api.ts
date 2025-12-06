import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { forceLogout } from "../utils/logout";

const API_BASE = import.meta.env.VITE_API_BASE || "https://api-c-atha.onrender.com";

const isValidToken = (token: string): boolean => {
  if (!token) return false;
  const parts = token.split(".");
  return parts.length === 3 && parts.every((p) => p.length > 0);
};

export const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

/* ----------------------------------------------------------
   INTERCEPTOR REQUEST → valida token e injeta Authorization
-----------------------------------------------------------*/
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        if (!isValidToken(token)) {
          console.warn("Token malformado → Logout");
          forceLogout();
          return Promise.reject("Token malformado");
        }

        const decoded: any = jwtDecode(token);

        if (decoded.exp * 1000 < Date.now()) {
          console.warn("Token expirado → Logout");
          forceLogout();
          return Promise.reject("Token expirado");
        }

        config.headers.Authorization = `Bearer ${token}`;
      } catch (err) {
        console.error("Erro analisando token → Logout");
        forceLogout();
        return Promise.reject("Token inválido");
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("401 recebido do servidor → Logout automático");
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
