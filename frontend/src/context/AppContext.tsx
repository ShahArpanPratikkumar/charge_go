import React, { createContext, useContext, useState, useEffect } from 'react';

interface Transaction {
    id: string;
    type: 'topup' | 'rental';
    title: string;
    amount: number;
    date: string;
}

interface AppState {
    user: { name: string; email: string; phone?: string; photo?: string } | null;
    walletBalance: number;
    activeRental: { startTime: number; station: string; rentalId?: string } | null;
    transactions: Transaction[];
    theme: 'light' | 'dark';
    isBackendConnected: boolean;
    login: (name: string, email: string, token?: string) => void;
    logout: () => void;
    topUpWallet: (amount: number) => void;
    withdraw: (amount: number) => void;
    endRental: () => void;
    startRental: (station: string, rentalId?: string) => void;
    updateUser: (data: { name?: string; email?: string; phone?: string; photo?: string }) => void;
    toggleTheme: () => void;
}

const AppContext = createContext<AppState>({
    user: null,
    walletBalance: 0,
    activeRental: null,
    transactions: [],
    theme: 'dark',
    isBackendConnected: false,
    login: () => { },
    logout: () => { },
    topUpWallet: () => { },
    withdraw: () => { },
    endRental: () => { },
    startRental: () => { },
    updateUser: () => { },
    toggleTheme: () => { },
});

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    // ── Auth: only hydrate if a real JWT token exists ──────────────────────
    const [user, setUser] = useState<{ name: string; email: string; phone?: string; photo?: string } | null>(() => {
        const hasToken = !!localStorage.getItem('token');
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (!hasToken && !isLoggedIn) return null;

        const profileRaw = localStorage.getItem('userProfile') || localStorage.getItem('chargego_user');
        if (profileRaw) {
            try { return JSON.parse(profileRaw); } catch { return null; }
        }
        return null;
    });

    const [isBackendConnected, setIsBackendConnected] = useState(false);

    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        return (localStorage.getItem('theme') as 'light' | 'dark') || 'dark';
    });

    const [walletBalance, setWalletBalance] = useState<number>(0);
    const [activeRental, setActiveRental] = useState<{ startTime: number; station: string; rentalId?: string } | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    // ── Check backend health on mount ──────────────────────────────────────
    useEffect(() => {
        fetch('http://localhost:5000/api/health')
            .then(r => r.ok ? setIsBackendConnected(true) : null)
            .catch(() => setIsBackendConnected(false));
    }, []);

    // ── Sync user to localStorage ──────────────────────────────────────────
    useEffect(() => {
        if (user) {
            localStorage.setItem('chargego_user', JSON.stringify(user));
        }
    }, [user]);

    // ── Apply theme ────────────────────────────────────────────────────────
    useEffect(() => {
        localStorage.setItem('theme', theme);
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            document.body.style.backgroundColor = '#0B0F1A';
        } else {
            document.documentElement.classList.remove('dark');
            document.body.style.backgroundColor = '#F5F7FB';
        }
    }, [theme]);

    // ── Login: accepts optional JWT token from backend ─────────────────────
    const login = (name: string, email: string, token?: string) => {
        const userData = { name, email };
        setUser(userData);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('chargego_user', JSON.stringify(userData));
        if (token) {
            localStorage.setItem('token', token);
        }
    };

    const logout = () => {
        setUser(null);
        setActiveRental(null);
        setTransactions([]);
        setWalletBalance(0);
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userProfile');
        localStorage.removeItem('chargego_user');
        localStorage.removeItem('token');
    };

    const topUpWallet = (amount: number) => {
        setWalletBalance(prev => prev + amount);
        const newTx: Transaction = {
            id: Date.now().toString(),
            type: 'topup',
            title: 'Wallet Top-up',
            amount,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        };
        setTransactions(prev => [newTx, ...prev]);
    };

    const withdraw = (amount: number) => {
        setWalletBalance(prev => prev - amount);
        const newTx: Transaction = {
            id: Date.now().toString(),
            type: 'topup',
            title: 'Wallet Withdrawal',
            amount: -amount,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        };
        setTransactions(prev => [newTx, ...prev]);
    };

    const endRental = () => {
        if (activeRental) {
            const cost = 3.40;
            setWalletBalance(prev => prev - cost);
            const newTx: Transaction = {
                id: Date.now().toString(),
                type: 'rental',
                title: `Charging Session • ${activeRental.station}`,
                amount: -cost,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            };
            setTransactions(prev => [newTx, ...prev]);
        }
        setActiveRental(null);
    };

    const startRental = (station: string, rentalId?: string) => {
        setActiveRental({ startTime: Date.now(), station, rentalId });
    };

    const updateUser = (data: { name?: string; email?: string; phone?: string; photo?: string }) => {
        setUser(prev => {
            if (!prev) return null;
            const updated = { ...prev, ...data };
            localStorage.setItem('chargego_user', JSON.stringify(updated));
            localStorage.setItem('userProfile', JSON.stringify(updated));
            return updated;
        });
    };

    const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

    return (
        <AppContext.Provider value={{
            user, walletBalance, activeRental, transactions, theme, isBackendConnected,
            login, logout, topUpWallet, withdraw, endRental, startRental, updateUser, toggleTheme
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
