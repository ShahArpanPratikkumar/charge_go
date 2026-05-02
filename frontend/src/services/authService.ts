import api from './api';

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    phone?: string;
    photo?: string;
    walletBalance: number;
    isProfileComplete: boolean;
    role: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    token: string;
    user: AuthUser;
    isProfileComplete?: boolean;
}

// ── Register ───────────────────────────────────────────────────────────────
export const registerUser = async (data: {
    name: string;
    email: string;
    phone?: string;
    password: string;
}): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/register', data);
    return res.data;
};

// ── Login ──────────────────────────────────────────────────────────────────
export const loginUser = async (data: {
    email: string;
    password: string;
}): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/login', data);
    return res.data;
};

// ── Get Current User ───────────────────────────────────────────────────────
export const getMe = async (): Promise<AuthUser> => {
    const res = await api.get<{ success: boolean; user: AuthUser }>('/auth/me');
    return res.data.user;
};

// ── Persist token to localStorage ─────────────────────────────────────────
export const saveToken = (token: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('isLoggedIn', 'true');
};

// ── Clear all auth state ───────────────────────────────────────────────────
export const clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('chargego_user');
};
