import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Plus,
    Minus,
    Zap,
    CreditCard,
    Smartphone,
    Wallet as WalletIcon,
    ChevronRight,
    Download,
    History,
    CheckCircle2,
    ArrowUpRight
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';

// Sample Transaction Item Component
const TransactionItem = ({ title, sub, date, amount, icon: Icon }: any) => (
    <div className="flex items-center justify-between py-4 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors px-2 rounded-xl">
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                <Icon className="w-5 h-5 text-white/40" />
            </div>
            <div>
                <h4 className="text-white text-sm font-bold tracking-wide">{title}</h4>
                <div className="flex items-center gap-2 mt-0.5">
                    {sub && <span className="text-white/20 text-[10px] bg-white/5 px-1.5 py-0.5 rounded uppercase tracking-wider">{sub}</span>}
                    <span className="text-white/30 text-[10px]">{date}</span>
                </div>
            </div>
        </div>
        <div className={`text-sm font-mono font-bold ${amount < 0 ? 'text-white/40' : 'text-[#00D9FF]'}`}>
            {amount > 0 ? '+' : ''}{amount.toFixed(2)}
        </div>
    </div>
);

const Wallet = () => {
    const { walletBalance, transactions, topUpWallet, withdraw } = useAppContext();

    // Balance display state for animation
    const [displayBalance, setDisplayBalance] = useState(walletBalance);

    // Auto Recharge State with LocalStorage
    const [autoRecharge, setAutoRecharge] = useState(() => {
        const saved = localStorage.getItem('chargego_auto_recharge');
        return saved ? JSON.parse(saved) : true;
    });

    // Payment Method Selection State
    const [selectedPayment, setSelectedPayment] = useState('credit_card');

    // Balance Animation Logic
    useEffect(() => {
        const duration = 500;
        const steps = 20;
        const diff = walletBalance - displayBalance;
        if (diff === 0) return;

        let currentStep = 0;
        const interval = setInterval(() => {
            currentStep++;
            setDisplayBalance(prev => prev + (diff / steps));
            if (currentStep >= steps) {
                setDisplayBalance(walletBalance);
                clearInterval(interval);
            }
        }, duration / steps);

        return () => clearInterval(interval);
    }, [walletBalance]);

    // Persist Auto Recharge
    useEffect(() => {
        localStorage.setItem('chargego_auto_recharge', JSON.stringify(autoRecharge));
    }, [autoRecharge]);

    return (
        <div className="min-h-full bg-transparent text-white flex flex-col relative font-sans overflow-x-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#00D9FF]/5 blur-[120px] rounded-full pointer-events-none z-0"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#00D9FF]/3 blur-[140px] rounded-full pointer-events-none z-0"></div>

            <div className="w-full flex flex-col gap-8 relative z-10">

                {/* Responsive Grid System */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">

                    {/* LEFT COLUMN (Balance & Recharge) */}
                    <div className="flex flex-col gap-8">
                        {/* 1. Header & Balance Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex flex-col gap-6"
                        >
                            <div className="bg-gradient-to-br from-[#0b1320] to-[#0A101C] rounded-[32px] p-8 border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group min-h-[300px] flex flex-col justify-center transition-all duration-500 hover:shadow-[#00D9FF]/5">
                                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <WalletIcon className="w-32 h-32 text-white" />
                                </div>

                                <div className="text-white/40 font-bold uppercase tracking-[0.2em] text-[10px] mb-2 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-[#00D9FF] rounded-full animate-pulse shadow-[0_0_8px_#00D9FF]"></div>
                                    Available Balance
                                </div>
                                <div className="flex items-baseline gap-1 mb-10">
                                    <span className="text-[#00D9FF] text-4xl font-extrabold">$</span>
                                    <span className="text-6xl font-black tracking-tight text-white drop-shadow-[0_0_30px_rgba(0,217,255,0.2)]">
                                        {displayBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => topUpWallet(50)}
                                        className="group relative bg-[#00D9FF] hover:bg-[#00B8D9] text-[#03070E] font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-[0_10px_20px_rgba(0,217,255,0.3)] hover:shadow-[0_15px_30px_rgba(0,217,255,0.5)] cursor-pointer z-20"
                                    >
                                        <Plus className="w-5 h-5" />
                                        <span className="text-sm tracking-wide">Add money</span>
                                    </button>
                                    <button
                                        onClick={() => withdraw(25)}
                                        className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer z-20"
                                    >
                                        <Minus className="w-4 h-4 text-white/40" />
                                        <span className="text-sm tracking-wide">Withdraw</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        {/* 2. Auto Recharge Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-[#0b1320]/80 backdrop-blur-xl border border-white/5 rounded-[24px] p-6 flex flex-col gap-4 relative overflow-hidden"
                        >
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00D9FF]/20 shadow-[0_0_15px_#00D9FF]/30"></div>
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-[#00D9FF]/10 flex items-center justify-center border border-[#00D9FF]/20">
                                        <Zap className="w-5 h-5 text-[#00D9FF]" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold text-base">Auto Recharge</h3>
                                        <p className="text-white/40 text-[11px] mt-1 leading-relaxed">
                                            Automatically add $50 when balance falls below $10.
                                        </p>
                                    </div>
                                </div>
                                <div
                                    onClick={() => setAutoRecharge(!autoRecharge)}
                                    className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-all duration-300 shadow-inner ${autoRecharge ? 'bg-[#00D9FF]' : 'bg-white/10'}`}
                                >
                                    <motion.div
                                        animate={{ x: autoRecharge ? 24 : 0 }}
                                        className="w-6 h-6 bg-white rounded-full shadow-lg"
                                    />
                                </div>
                            </div>
                            <button className="text-[10px] font-black text-[#00D9FF] tracking-widest uppercase mt-2 flex items-center gap-1 hover:opacity-70 transition-opacity cursor-pointer">
                                Edit Settings <ChevronRight className="w-3 h-3" />
                            </button>
                        </motion.div>
                    </div>

                    {/* MIDDLE COLUMN (Payment Methods) */}
                    <div className="flex flex-col gap-5">
                        <h3 className="text-white/60 font-bold tracking-widest text-[11px] uppercase ml-2 flex items-center gap-2">
                            Payment Methods
                            <div className="h-px bg-white/5 flex-grow ml-2"></div>
                        </h3>

                        <div className="flex flex-col gap-4">
                            {[
                                { id: 'upi', label: 'UPI ID', val: 'chargego@bank', icon: Smartphone },
                                { id: 'credit_card', label: 'Credit Card', val: '**** 8329', icon: CreditCard, default: true },
                                { id: 'paypal', label: 'PayPal', val: 'm.fisher@email.com', icon: () => <div className="bg-white/10 rounded px-1.5 py-0.5"><span className="text-white/70 font-black text-[10px]">PP</span></div> }
                            ].map((method) => (
                                <div
                                    key={method.id}
                                    onClick={() => setSelectedPayment(method.id)}
                                    className={`p-6 rounded-[24px] border transition-all duration-300 cursor-pointer flex items-center justify-between group h-[100px] ${selectedPayment === method.id ? 'bg-[#00D9FF]/5 border-[#00D9FF]/40 shadow-[0_10px_30px_rgba(0,217,255,0.08)]' : 'bg-[#0b1320] border-white/5 hover:border-white/10'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-500 ${selectedPayment === method.id ? 'bg-[#00D9FF] border-[#00D9FF] shadow-[0_0_20px_rgba(0,217,255,0.3)]' : 'bg-white/5 border-white/5'}`}>
                                            <method.icon className={`w-6 h-6 ${selectedPayment === method.id ? 'text-[#03070E]' : 'text-white/20'}`} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <h4 className="text-white font-bold text-base">{method.label}</h4>
                                                {method.default && (
                                                    <span className="bg-[#00D9FF] text-[#03070E] font-black text-[8px] px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-[0_0_15px_rgba(0,217,255,0.4)]">DEFAULT</span>
                                                )}
                                            </div>
                                            <p className="text-white/40 text-xs mt-0.5 tracking-wide">{method.val}</p>
                                        </div>
                                    </div>
                                    <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${selectedPayment === method.id ? 'text-[#00D9FF] translate-x-1' : 'text-white/10 group-hover:text-white/30'}`} />
                                </div>
                            ))}
                        </div>

                        <button className="w-full py-4 border-2 border-dashed border-white/5 hover:border-[#00D9FF]/20 hover:bg-[#00D9FF]/5 rounded-[24px] transition-all flex items-center justify-center gap-3 group mt-2 cursor-pointer">
                            <Plus className="w-5 h-5 text-white/20 group-hover:text-[#00D9FF] transition-colors" />
                            <span className="text-white/20 group-hover:text-white/60 font-bold text-sm tracking-wide">Add New Method</span>
                        </button>
                    </div>

                    {/* RIGHT COLUMN (Billing History) */}
                    <div className="flex flex-col gap-6 lg:h-full">
                        <div className="bg-[#0b1320] border border-white/5 rounded-[32px] p-8 flex flex-col gap-6 lg:h-full shadow-2xl relative overflow-hidden">
                            {/* Subtle Pattern */}
                            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

                            <div className="flex items-center justify-between relative z-10">
                                <h3 className="text-white font-bold text-xl flex items-center gap-3">
                                    <History className="w-5 h-5 text-[#00D9FF]" />
                                    Billing History
                                </h3>
                                <button className="text-[10px] font-black text-[#00D9FF] tracking-[0.2em] uppercase flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer bg-[#00D9FF]/5 px-3 py-1.5 rounded-full border border-[#00D9FF]/10">
                                    PDF <Download className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            <div className="flex flex-col flex-grow relative z-10">
                                <div className="flex items-center justify-between px-3 mb-6 border-b border-white/5 pb-4">
                                    <span className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em]">Transaction Trace</span>
                                    <span className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em] mr-8">Details</span>
                                </div>

                                <div className="flex flex-col gap-2 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
                                    {transactions.map((tx) => {
                                        const stationId = tx.title.split('•')[1]?.trim() || 'WALLET';
                                        const titleText = tx.title.split('•')[0]?.trim();
                                        return (
                                            <TransactionItem
                                                key={tx.id}
                                                title={titleText}
                                                sub={stationId}
                                                date={tx.date}
                                                amount={tx.amount}
                                                icon={tx.type === 'rental' ? Zap : CheckCircle2}
                                            />
                                        );
                                    })}
                                </div>
                            </div>

                            <button className="w-full py-5 bg-white/[0.03] hover:bg-white/[0.08] text-white/50 border border-white/5 rounded-[20px] text-[11px] font-black tracking-[0.3em] uppercase transition-all mt-4 hover:text-white cursor-pointer group flex items-center justify-center gap-2">
                                VIEW FULL ARCHIVE <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer Section */}
                <div className="mt-12 flex flex-col md:flex-row items-center justify-between py-12 border-t border-white/5 gap-8 opacity-60 hover:opacity-100 transition-opacity">
                    <div className="flex flex-col gap-2">
                        <div className="text-primary dark:text-[#00D2FF] font-black tracking-[0.4em] uppercase text-xl">CHG.GO</div>
                        <p className="text-white/20 text-[10px] uppercase font-bold tracking-widest leading-loose max-w-[300px]">
                            Kinetic Energy Systems Engineering the future of zero-friction mobility.
                        </p>
                    </div>

                    <div className="flex flex-col items-center md:items-end gap-6">
                        <div className="flex gap-4">
                            <div className="px-4 py-2 bg-[#00D9FF]/10 text-[#00D9FF] font-black text-[10px] rounded-full tracking-widest border border-[#00D9FF]/20">
                                390 FILL × 1525.1 HUG
                            </div>
                        </div>
                        <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 text-white/30 text-[11px] uppercase font-bold tracking-[0.15em]">
                            <span className="hover:text-white cursor-pointer transition-colors underline underline-offset-4 decoration-white/10">Privacy Policy</span>
                            <span className="hover:text-white cursor-pointer transition-colors underline underline-offset-4 decoration-white/10">Terms of Service</span>
                            <span className="hover:text-white cursor-pointer transition-colors underline underline-offset-4 decoration-white/10">Station Partners</span>
                            <span className="hover:text-white cursor-pointer transition-colors underline underline-offset-4 decoration-white/10">Carbon Ledger</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Wallet;
