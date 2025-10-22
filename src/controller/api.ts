import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5056';

const api = axios.create({
    baseURL: API_BASE,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: false,
})

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
