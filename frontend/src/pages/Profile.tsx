import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User,
    Mail,
    Phone,
    Camera,
    Edit2,
    CreditCard,
    Shield,
    Lock,
    LogOut,
    History,
    Wallet as WalletIcon,
    Settings as SettingsIcon,
    ChevronRight,
    Plus,
    X,
    Check,
    Bell,
    Moon,
    Sun,
    Trash2,
    Zap,
    Clock,
    DollarSign,
    Leaf
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Profile = () => {
    const { user, walletBalance, transactions, logout, updateUser } = useAppContext();
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Local states
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

    const [editForm, setEditForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || ''
    });

    const [isAddPaymentModalOpen, setIsAddPaymentModalOpen] = useState(false);
    const [paymentForm, setPaymentForm] = useState({
        type: 'UPI' as 'UPI' | 'Card' | 'PayPal',
        upiId: '',
        cardNumber: '',
        expiry: '',
        cvv: '',
        email: ''
    });
    const [paymentError, setPaymentError] = useState('');

    const [paymentMethods, setPaymentMethods] = useState<{ id: string, type: string, value: string, isDefault: boolean }[]>(() => {
        const saved = localStorage.getItem('chargego_payments');
        return saved ? JSON.parse(saved) : [
            { id: '1', type: 'UPI', value: 'jayfisher@okaxis', isDefault: true },
            { id: '2', type: 'Card', value: '**** **** **** 4242', isDefault: false }
        ];
    });

    useEffect(() => {
        localStorage.setItem('chargego_payments', JSON.stringify(paymentMethods));
    }, [paymentMethods]);

    const [settings, setSettings] = useState({
        darkMode: true,
        notifications: true,
        twoFactor: false
    });

    // Calculations
    const rentalTransactions = transactions.filter(t => t.type === 'rental');
    const totalRentals = rentalTransactions.length;
    const totalSpent = Math.abs(rentalTransactions.reduce((acc, curr) => acc + curr.amount, 0));
    const totalTopups = transactions.filter(t => t.type === 'topup').reduce((acc, curr) => acc + curr.amount, 0);

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateUser({ photo: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpdateProfile = (e: React.FormEvent) => {
        e.preventDefault();
        updateUser(editForm);
        setIsEditModalOpen(false);
    };

    const handleAddPayment = (e: React.FormEvent) => {
        e.preventDefault();
        setPaymentError('');

        if (paymentForm.type === 'UPI') {
            if (!paymentForm.upiId.includes('@')) {
                setPaymentError('Invalid UPI ID format');
                return;
            }
            const newMethod = {
                id: Date.now().toString(),
                type: 'UPI',
                value: paymentForm.upiId,
                isDefault: paymentMethods.length === 0
            };
            setPaymentMethods([...paymentMethods, newMethod]);
        } else if (paymentForm.type === 'Card') {
            if (paymentForm.cardNumber.replace(/\s/g, '').length < 16) {
                setPaymentError('Invalid Card Number');
                return;
            }
            const masked = `**** **** **** ${paymentForm.cardNumber.slice(-4)}`;
            const newMethod = {
                id: Date.now().toString(),
                type: 'Card',
                value: masked,
                isDefault: paymentMethods.length === 0
            };
            setPaymentMethods([...paymentMethods, newMethod]);
        } else if (paymentForm.type === 'PayPal') {
            if (!paymentForm.email.includes('@')) {
                setPaymentError('Invalid PayPal Email');
                return;
            }
            const newMethod = {
                id: Date.now().toString(),
                type: 'PayPal',
                value: paymentForm.email,
                isDefault: paymentMethods.length === 0
            };
            setPaymentMethods([...paymentMethods, newMethod]);
        }

        setIsAddPaymentModalOpen(false);
        setPaymentForm({ type: 'UPI', upiId: '', cardNumber: '', expiry: '', cvv: '', email: '' });
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleDefaultPayment = (id: string) => {
        setPaymentMethods(paymentMethods.map(pm => ({
            ...pm,
            isDefault: pm.id === id
        })));
    };

    const removePaymentMethod = (id: string) => {
        setPaymentMethods(paymentMethods.filter(pm => pm.id !== id));
    };

    return (
        <div className="min-h-full bg-transparent text-white flex flex-col relative pb-32 md:pb-12 font-sans w-full max-w-[1200px] mx-auto px-4 md:px-8">
            {/* Ambient Glows */}
            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00D9FF]/10 blur-[120px] rounded-full pointer-events-none z-0"></div>
            <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#A855F7]/5 blur-[120px] rounded-full pointer-events-none z-0"></div>

            <div className="relative z-10 pt-8 pb-12 w-full">

                {/* SECTION 1: PROFILE HEADER */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[32px] p-8 mb-8 relative overflow-hidden"
                >
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-3xl overflow-hidden bg-[#0A101C] border-2 border-[#00D9FF]/30 shadow-2xl relative">
                                {user?.photo ? (
                                    <img src={user.photo} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#00D9FF]/20 to-transparent">
                                        <User className="w-12 h-12 text-[#00D9FF]" />
                                    </div>
                                )}
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                                >
                                    <Camera className="w-8 h-8 text-white" />
                                </button>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handlePhotoUpload}
                                className="hidden"
                                accept="image/*"
                            />
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl font-black tracking-tight mb-2 uppercase">{user?.name || 'ChargeGo Agent'}</h1>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-center md:justify-start gap-2 text-white/50 text-sm">
                                    <Mail className="w-4 h-4" /> {user?.email}
                                </div>
                                <div className="flex items-center justify-center md:justify-start gap-2 text-white/50 text-sm">
                                    <Phone className="w-4 h-4" /> {user?.phone || '+1 (555) 000-8888'}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsEditModalOpen(true)}
                            className="bg-[#00D9FF]/10 border border-[#00D9FF]/30 text-[#00D9FF] px-6 py-3 rounded-2xl flex items-center gap-2 font-bold text-sm hover:bg-[#00D9FF]/20 transition-all cursor-pointer"
                        >
                            <Edit2 className="w-4 h-4" /> Edit Profile
                        </button>
                    </div>
                </motion.div>

                {/* SECTION 2: USER OVERVIEW (STATS) */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Total Rentals', value: totalRentals, icon: Zap, color: '#00D9FF' },
                        { label: 'Total Spent', value: `$${totalSpent.toFixed(2)}`, icon: DollarSign, color: '#4ADE80' },
                        { label: 'Time Used', value: '12h 45m', icon: Clock, color: '#A855F7' },
                        { label: 'Saved CO2', value: '4.2 kg', icon: Leaf, color: '#22C55E' }
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white/[0.03] backdrop-blur-md border border-white/5 rounded-[24px] p-6 hover:border-white/20 transition-all group"
                        >
                            <div className="w-10 h-10 rounded-xl mb-4 flex items-center justify-center" style={{ backgroundColor: `${stat.color}15`, border: `1px solid ${stat.color}30` }}>
                                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                            </div>
                            <div className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</div>
                            <div className="text-xl font-black text-white">{stat.value}</div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Left Column */}
                    <div className="flex flex-col gap-8">

                        {/* SECTION 3: PAYMENT DETAILS */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-[32px] p-8 shadow-xl"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-bold flex items-center gap-3">
                                    <CreditCard className="w-6 h-6 text-[#00D9FF]" /> Payment Methods
                                </h2>
                                <button
                                    onClick={() => setIsAddPaymentModalOpen(true)}
                                    className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-white/10 transition-all cursor-pointer border border-white/10 active:scale-95"
                                >
                                    <Plus className="w-5 h-5 text-[#00D9FF]" />
                                </button>
                            </div>

                            <div className="flex flex-col gap-4">
                                {paymentMethods.map(pm => (
                                    <div key={pm.id} className="bg-white/5 border border-white/5 rounded-2xl p-5 flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-black/40 rounded-xl flex items-center justify-center border border-white/5 group-hover:border-[#00D9FF]/30 transition-all">
                                                {pm.type === 'UPI' ? <Zap className="w-6 h-6 text-[#A855F7]" /> : pm.type === 'PayPal' ? <Mail className="w-6 h-6 text-[#00D9FF]" /> : <CreditCard className="w-6 h-6 text-[#00D9FF]" />}
                                            </div>
                                            <div>
                                                <div className="text-xs font-black uppercase tracking-widest text-white/30 mb-0.5">{pm.type}</div>
                                                <div className="text-sm font-bold text-white/80">{pm.value}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => toggleDefaultPayment(pm.id)}
                                                className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${pm.isDefault ? 'bg-[#4ADE80] border-[#4ADE80]' : 'border-white/10 hover:border-white/30'}`}
                                            >
                                                {pm.isDefault && <Check className="w-4 h-4 text-black" />}
                                            </button>
                                            <button
                                                onClick={() => removePaymentMethod(pm.id)}
                                                className="w-8 h-8 rounded-full flex items-center justify-center border border-white/10 hover:bg-red-500/20 hover:border-red-500/50 transition-all cursor-pointer"
                                            >
                                                <Trash2 className="w-4 h-4 text-white/30 group-hover:text-red-500" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* SECTION 6: WALLET SUMMARY */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-gradient-to-br from-[#00D9FF]/20 to-transparent border border-[#00D9FF]/30 rounded-[32px] p-8 shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-[-20%] right-[-10%] opacity-10 pointer-events-none">
                                <WalletIcon className="w-64 h-64 text-[#00D9FF]" />
                            </div>
                            <div className="relative z-10">
                                <div className="text-[#00D9FF] text-[10px] font-black uppercase tracking-[0.3em] mb-2">Matrix Balance</div>
                                <div className="text-5xl font-black text-white mb-8">${walletBalance.toFixed(2)}</div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-black/20 rounded-2xl p-4 border border-white/5">
                                        <div className="text-white/30 text-[9px] font-black uppercase tracking-widest mb-1">Total Top-ups</div>
                                        <div className="text-lg font-bold text-[#4ADE80]">${totalTopups.toFixed(2)}</div>
                                    </div>
                                    <div className="bg-black/20 rounded-2xl p-4 border border-white/5">
                                        <div className="text-white/30 text-[9px] font-black uppercase tracking-widest mb-1">Total Spent</div>
                                        <div className="text-lg font-bold text-red-400">-${totalSpent.toFixed(2)}</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                    </div>

                    {/* Right Column */}
                    <div className="flex flex-col gap-8">

                        {/* SECTION 4: SECURITY SETTINGS */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-[32px] p-8 shadow-xl"
                        >
                            <h2 className="text-xl font-bold flex items-center gap-3 mb-8">
                                <Shield className="w-6 h-6 text-[#00D9FF]" /> Security & Access
                            </h2>

                            <div className="flex flex-col gap-4">
                                <button
                                    onClick={() => setIsPasswordModalOpen(true)}
                                    className="w-full bg-white/5 hover:bg-white/10 border border-white/5 py-4 px-6 rounded-2xl flex items-center justify-between group transition-all cursor-pointer"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-[#00D9FF]/10 rounded-xl flex items-center justify-center">
                                            <Lock className="w-5 h-5 text-[#00D9FF]" />
                                        </div>
                                        <span className="font-bold text-sm text-white/80">Update Password</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-white/20 group-hover:translate-x-1 transition-transform" />
                                </button>

                                <div className="w-full bg-white/5 border border-white/5 py-4 px-6 rounded-2xl flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-[#A855F7]/10 rounded-xl flex items-center justify-center">
                                            <Shield className="w-5 h-5 text-[#A855F7]" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm text-white/80">Two-Factor Auth</div>
                                            <div className="text-[10px] text-white/30 font-medium">Secured by Biometrics</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSettings(s => ({ ...s, twoFactor: !s.twoFactor }))}
                                        className={`w-12 h-6 rounded-full relative transition-all ${settings.twoFactor ? 'bg-[#00D9FF]' : 'bg-white/10'}`}
                                    >
                                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.twoFactor ? 'right-1' : 'left-1'}`}></div>
                                    </button>
                                </div>

                                <button
                                    onClick={() => setIsLogoutConfirmOpen(true)}
                                    className="w-full border border-red-500/20 hover:bg-red-500/10 py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all cursor-pointer group mt-4"
                                >
                                    <LogOut className="w-5 h-5 text-red-500 group-hover:-translate-x-1 transition-transform" />
                                    <span className="font-bold text-sm text-red-500 uppercase tracking-widest">Terminate Session</span>
                                </button>
                            </div>
                        </motion.div>

                        {/* SECTION 5: RENTAL HISTORY */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-[32px] p-8 shadow-xl flex-1 flex flex-col"
                        >
                            <h2 className="text-xl font-bold flex items-center gap-3 mb-8">
                                <History className="w-6 h-6 text-[#00D9FF]" /> Rental Protocols
                            </h2>

                            <div className="flex flex-col gap-4 flex-1">
                                {rentalTransactions.slice(0, 4).map(history => (
                                    <div key={history.id} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-[#00D9FF]/5 rounded-xl flex items-center justify-center border border-[#00D9FF]/10">
                                                <Zap className="w-5 h-5 text-[#00D9FF]" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-white mb-0.5">{history.title.split('•')[1]?.trim() || 'CG-Station'}</div>
                                                <div className="text-[10px] text-white/30 font-medium">{history.date}</div>
                                            </div>
                                        </div>
                                        <div className="text-sm font-black text-white/80">-${Math.abs(history.amount).toFixed(2)}</div>
                                    </div>
                                ))}
                                {rentalTransactions.length === 0 && (
                                    <div className="flex-1 flex flex-col items-center justify-center text-white/20 gap-4 py-12">
                                        <History className="w-12 h-12" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">No rental data logged</span>
                                    </div>
                                )}
                            </div>

                            <button className="w-full mt-6 py-4 border border-white/10 hover:border-white/30 rounded-2xl text-[10px] uppercase font-black tracking-widest transition-all text-white/40 hover:text-white">
                                View Full History Archive
                            </button>
                        </motion.div>

                        {/* SECTION 7: SETTINGS */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-[32px] p-8 shadow-xl"
                        >
                            <h2 className="text-xl font-bold flex items-center gap-3 mb-8">
                                <SettingsIcon className="w-6 h-6 text-[#00D9FF]" /> System Configuration
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-white/5 border border-white/5 p-5 rounded-2xl flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {settings.darkMode ? <Moon className="w-5 h-5 text-[#00D9FF]" /> : <Sun className="w-5 h-5 text-orange-400" />}
                                        <span className="text-sm font-bold">Dark Meta</span>
                                    </div>
                                    <button
                                        onClick={() => setSettings(s => ({ ...s, darkMode: !s.darkMode }))}
                                        className={`w-10 h-5 rounded-full relative transition-all ${settings.darkMode ? 'bg-[#00D9FF]' : 'bg-white/10'}`}
                                    >
                                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${settings.darkMode ? 'right-0.5' : 'left-0.5'}`}></div>
                                    </button>
                                </div>

                                <div className="bg-white/5 border border-white/5 p-5 rounded-2xl flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Bell className={`w-5 h-5 ${settings.notifications ? 'text-[#00D9FF]' : 'text-white/20'}`} />
                                        <span className="text-sm font-bold">Alerts</span>
                                    </div>
                                    <button
                                        onClick={() => setSettings(s => ({ ...s, notifications: !s.notifications }))}
                                        className={`w-10 h-5 rounded-full relative transition-all ${settings.notifications ? 'bg-[#00D9FF]' : 'bg-white/10'}`}
                                    >
                                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${settings.notifications ? 'right-0.5' : 'left-0.5'}`}></div>
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </div>

            {/* MODALS */}
            <AnimatePresence>
                {isAddPaymentModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
                    >
                        <div className="absolute inset-0 bg-[#03070E]/80 backdrop-blur-md" onClick={() => setIsAddPaymentModalOpen(false)}></div>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-[#0A101C] border border-white/10 rounded-[40px] p-10 w-full max-w-[500px] relative z-10 shadow-2xl"
                        >
                            <button onClick={() => setIsAddPaymentModalOpen(false)} className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-full"><X className="w-6 h-6 text-white/50" /></button>
                            <h2 className="text-2xl font-black mb-2 uppercase tracking-tight">New Payment Method</h2>
                            <p className="text-white/30 text-xs mb-8">Securely link your financial protocol to the ChargeGo mesh.</p>

                            <form onSubmit={handleAddPayment} className="flex flex-col gap-6">
                                <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
                                    {['UPI', 'Card', 'PayPal'].map(t => (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => setPaymentForm({ ...paymentForm, type: t as any })}
                                            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${paymentForm.type === t ? 'bg-[#00D9FF] text-[#03070E]' : 'text-white/40 hover:text-white'}`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>

                                {paymentForm.type === 'UPI' && (
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-white/30 ml-4 tracking-widest">UPI Identity</label>
                                        <input
                                            type="text" placeholder="username@okaxis"
                                            value={paymentForm.upiId}
                                            onChange={e => setPaymentForm({ ...paymentForm, upiId: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:border-[#00D9FF]/50 outline-none transition-all text-white"
                                        />
                                    </div>
                                )}

                                {paymentForm.type === 'Card' && (
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-white/30 ml-4 tracking-widest">Card Numeric</label>
                                            <input
                                                type="text" placeholder="0000 0000 0000 0000"
                                                value={paymentForm.cardNumber}
                                                onChange={e => setPaymentForm({ ...paymentForm, cardNumber: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:border-[#00D9FF]/50 outline-none transition-all text-white"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase text-white/30 ml-4 tracking-widest">Expiry</label>
                                                <input
                                                    type="text" placeholder="MM/YY"
                                                    value={paymentForm.expiry}
                                                    onChange={e => setPaymentForm({ ...paymentForm, expiry: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:border-[#00D9FF]/50 outline-none transition-all text-white"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase text-white/30 ml-4 tracking-widest">CVV</label>
                                                <input
                                                    type="password" placeholder="***"
                                                    value={paymentForm.cvv}
                                                    onChange={e => setPaymentForm({ ...paymentForm, cvv: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:border-[#00D9FF]/50 outline-none transition-all text-white"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {paymentForm.type === 'PayPal' && (
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-white/30 ml-4 tracking-widest">PayPal Gateway</label>
                                        <input
                                            type="email" placeholder="email@example.com"
                                            value={paymentForm.email}
                                            onChange={e => setPaymentForm({ ...paymentForm, email: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:border-[#00D9FF]/50 outline-none transition-all text-white"
                                        />
                                    </div>
                                )}

                                {paymentError && (
                                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-[10px] font-bold uppercase tracking-widest text-center">
                                        Error: {paymentError}
                                    </motion.div>
                                )}

                                <button type="submit" className="w-full bg-[#00D9FF] py-4 rounded-2xl text-[#03070E] font-black uppercase tracking-widest text-sm shadow-[0_0_30px_#00D9FF50] mt-4 hover:shadow-[0_0_50px_#00D9FF80] transition-all">
                                    Authorize Method
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}

                {isEditModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
                    >
                        <div className="absolute inset-0 bg-[#03070E]/80 backdrop-blur-md" onClick={() => setIsEditModalOpen(false)}></div>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-[#0A101C] border border-white/10 rounded-[40px] p-10 w-full max-w-[500px] relative z-10 shadow-2xl"
                        >
                            <button onClick={() => setIsEditModalOpen(false)} className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-full"><X className="w-6 h-6" /></button>
                            <h2 className="text-2xl font-black mb-8 uppercase tracking-tight">Edit Identity</h2>
                            <form onSubmit={handleUpdateProfile} className="flex flex-col gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-white/30 ml-4 tracking-widest">Full Name</label>
                                    <input
                                        type="text" value={editForm.name}
                                        onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:border-[#00D9FF]/50 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-white/30 ml-4 tracking-widest">Email Address</label>
                                    <input
                                        type="email" value={editForm.email}
                                        onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:border-[#00D9FF]/50 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-white/30 ml-4 tracking-widest">Phone Pulse</label>
                                    <input
                                        type="text" value={editForm.phone}
                                        onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:border-[#00D9FF]/50 outline-none transition-all"
                                    />
                                </div>
                                <button type="submit" className="w-full bg-[#00D9FF] py-4 rounded-2xl text-[#03070E] font-black uppercase tracking-widest text-sm shadow-[0_0_30px_#00D9FF50] mt-4 hover:shadow-[0_0_50px_#00D9FF80] transition-all">
                                    Save Core Data
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}

                {isPasswordModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
                    >
                        <div className="absolute inset-0 bg-[#03070E]/80 backdrop-blur-md" onClick={() => setIsPasswordModalOpen(false)}></div>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-[#0A101C] border border-white/10 rounded-[40px] p-10 w-full max-w-[500px] relative z-10 shadow-2xl"
                        >
                            <button onClick={() => setIsPasswordModalOpen(false)} className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-full"><X className="w-6 h-6" /></button>
                            <h2 className="text-2xl font-black mb-8 uppercase tracking-tight">Access Protocol</h2>
                            <div className="flex flex-col gap-6">
                                <input type="password" placeholder="Current Password" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:border-[#00D9FF]/50 outline-none transition-all" />
                                <input type="password" placeholder="New Password" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:border-[#00D9FF]/50 outline-none transition-all" />
                                <input type="password" placeholder="Verify New Password" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:border-[#00D9FF]/50 outline-none transition-all" />
                                <button onClick={() => setIsPasswordModalOpen(false)} className="w-full bg-[#00D9FF] py-4 rounded-2xl text-[#03070E] font-black uppercase tracking-widest text-sm shadow-[0_0_30px_#00D9FF50] mt-4">
                                    Update Security Key
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {isLogoutConfirmOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
                    >
                        <div className="absolute inset-0 bg-[#03070E]/90 backdrop-blur-xl" onClick={() => setIsLogoutConfirmOpen(false)}></div>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-[#0A101C] border border-white/10 rounded-[40px] p-12 w-full max-w-[400px] relative z-10 text-center shadow-[0_0_100px_rgba(0,0,0,0.8)]"
                        >
                            <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-red-500/30">
                                <LogOut className="w-10 h-10 text-red-500" />
                            </div>
                            <h2 className="text-2xl font-black mb-4 uppercase tracking-tight">Terminate Session?</h2>
                            <p className="text-white/40 text-sm mb-10 leading-relaxed">Ensure all active Kinetic sessions are docked before logging out of the mesh network.</p>
                            <div className="flex flex-col gap-4">
                                <button onClick={handleLogout} className="w-full bg-red-500 py-5 rounded-2xl text-white font-black uppercase tracking-widest text-sm shadow-[0_15px_40px_rgba(239,68,68,0.3)] hover:shadow-[0_20px_50px_rgba(239,68,68,0.5)] transition-all">
                                    Confirm Logout
                                </button>
                                <button onClick={() => setIsLogoutConfirmOpen(false)} className="w-full py-5 rounded-2xl text-white/50 font-black uppercase tracking-widest text-xs hover:text-white transition-all">
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Profile;
