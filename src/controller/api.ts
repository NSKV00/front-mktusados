import axios from 'axios';

declare const VITE_API_BASE: string | undefined;

const API_BASE = (typeof VITE_API_BASE !== 'undefined' && VITE_API_BASE) ? VITE_API_BASE : 'http://localhost:5056';

const api = axios.create({
    baseURL: API_BASE,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
})

export default api;