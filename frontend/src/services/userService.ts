import api from './api';
import type { AuthUser } from './authService';

// ── Fetch profile ──────────────────────────────────────────────────────────
export const fetchProfile = async (): Promise<AuthUser> => {
    const res = await api.get<{ success: boolean; user: AuthUser }>('/user/profile');
    return res.data.user;
};

// ── Update profile (name / phone) ──────────────────────────────────────────
export const updateProfile = async (data: {
    name?: string;
    phone?: string;
}): Promise<AuthUser> => {
    const res = await api.put<{ success: boolean; user: AuthUser }>('/user/profile', data);
    return res.data.user;
};

// ── Upload avatar photo ────────────────────────────────────────────────────
export const uploadPhoto = async (file: File): Promise<string> => {
    const form = new FormData();
    form.append('photo', file);
    const res = await api.post<{ success: boolean; photo: string }>(
        '/user/photo',
        form,
        { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return res.data.photo;
};

// ── Wallet top-up ──────────────────────────────────────────────────────────
export const topUpWallet = async (amount: number): Promise<number> => {
    const res = await api.post<{ success: boolean; walletBalance: number }>(
        '/user/wallet/topup',
        { amount }
    );
    return res.data.walletBalance;
};
