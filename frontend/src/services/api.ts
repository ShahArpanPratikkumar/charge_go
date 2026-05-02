import axios from 'axios';

// ── Base instance ──────────────────────────────────────────────────────────
const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: { 'Content-Type': 'application/json' },
    timeout: 10_000,
});

// ── Request interceptor: attach JWT from localStorage ──────────────────────
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ── Response interceptor: handle 401 globally ─────────────────────────────
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Clear all auth state and force a re-login
            localStorage.removeItem('token');
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userProfile');
            localStorage.removeItem('chargego_user');
            // Only redirect if not already on auth pages
            const path = window.location.pathname;
            if (path !== '/signin' && path !== '/register' && path !== '/') {
                window.location.href = '/signin';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
