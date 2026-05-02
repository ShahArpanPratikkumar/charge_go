import api from './api';

export interface PaymentMethod {
    _id: string;
    type: 'upi' | 'card' | 'paypal';
    upiId?: string;
    cardLast4?: string;
    cardExpiry?: string;
    cardBrand?: string;
    paypalEmail?: string;
    label?: string;
    isDefault: boolean;
}

// ── List all payment methods ───────────────────────────────────────────────
export const getPayments = async (): Promise<PaymentMethod[]> => {
    const res = await api.get<{ success: boolean; payments: PaymentMethod[] }>('/payment');
    return res.data.payments;
};

// ── Add a payment method ───────────────────────────────────────────────────
export const addPayment = async (data: Partial<PaymentMethod>): Promise<PaymentMethod> => {
    const res = await api.post<{ success: boolean; payment: PaymentMethod }>('/payment', data);
    return res.data.payment;
};

// ── Set a method as default ────────────────────────────────────────────────
export const setDefaultPayment = async (id: string): Promise<PaymentMethod> => {
    const res = await api.put<{ success: boolean; payment: PaymentMethod }>(`/payment/${id}/default`);
    return res.data.payment;
};

// ── Delete a payment method ────────────────────────────────────────────────
export const deletePayment = async (id: string): Promise<void> => {
    await api.delete(`/payment/${id}`);
};
