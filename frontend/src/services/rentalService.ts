import api from './api';

export interface Rental {
    _id: string;
    stationId: string;
    stationName: string;
    plan: string;
    status: 'active' | 'completed' | 'cancelled';
    startTime: string;
    endTime?: string;
    durationMinutes: number;
    totalCost: number;
    currency: string;
}

// ── Start a rental ─────────────────────────────────────────────────────────
export const startRental = async (data: {
    stationId: string;
    stationName?: string;
    plan?: string;
    pickupCoords?: { lat: number; lng: number };
}): Promise<Rental> => {
    const res = await api.post<{ success: boolean; rental: Rental }>('/rental/start', data);
    return res.data.rental;
};

// ── End a rental ───────────────────────────────────────────────────────────
export const endRental = async (data: {
    rentalId: string;
    returnCoords?: { lat: number; lng: number };
}): Promise<{ rental: Rental; totalCost: number; durationMinutes: number }> => {
    const res = await api.post<{
        success: boolean;
        rental: Rental;
        totalCost: number;
        durationMinutes: number;
    }>('/rental/end', data);
    return { rental: res.data.rental, totalCost: res.data.totalCost, durationMinutes: res.data.durationMinutes };
};

// ── Get current active rental ──────────────────────────────────────────────
export const getActiveRental = async (): Promise<Rental | null> => {
    const res = await api.get<{ success: boolean; rental: Rental | null }>('/rental/active');
    return res.data.rental;
};

// ── Rental history (paginated) ─────────────────────────────────────────────
export const getRentalHistory = async (page = 1, limit = 10): Promise<{
    rentals: Rental[];
    pagination: { page: number; limit: number; total: number; pages: number };
}> => {
    const res = await api.get(`/rental?page=${page}&limit=${limit}`);
    return { rentals: res.data.rentals, pagination: res.data.pagination };
};
