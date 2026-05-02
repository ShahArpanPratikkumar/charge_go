import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap,
    Clock,
    Crown,
    Lock,
    BatteryCharging,
    ScanLine,
    ArrowRight,
    ChevronRight,
    Info,
    ShieldCheck,
    BarChart3,
    RotateCcw,
    HelpCircle
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import QRScanner, { type QRScanResult } from '../components/QRScanner';

const Rent = () => {
    const { startRental, endRental, activeRental } = useAppContext();
    const [flowState, setFlowState] = useState<'scan' | 'unlocking' | 'active'>('scan');
    const [selectedPlan, setSelectedPlan] = useState('Traveler');
    const [progress, setProgress] = useState(0);
    const [secondsElapsed, setSecondsElapsed] = useState(0);
    const [showScanner, setShowScanner] = useState(false);
    const [scannedStation, setScannedStation] = useState('CG-8821');

    // Initial flow state check
    useEffect(() => {
        if (activeRental) {
            setFlowState('active');
            const elapsed = Math.floor((Date.now() - activeRental.startTime) / 1000);
            setSecondsElapsed(elapsed);
        }
    }, [activeRental]);

    const handleConfirmSelection = () => {
        setFlowState('unlocking');
        setProgress(0);
    };

    const handleScanSuccess = (result: QRScanResult) => {
        setScannedStation(result.stationId);
        setShowScanner(false);
        // Auto-proceed to unlock after scan
        setFlowState('unlocking');
        setProgress(0);
    };

    // Unlocking Animation
    useEffect(() => {
        if (flowState === 'unlocking') {
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        startRental(`${selectedPlan} Plan • ${scannedStation}`);
                        setFlowState('active');
                        return 100;
                    }
                    return prev + 1;
                });
            }, 30);
            return () => clearInterval(interval);
        }
    }, [flowState, startRental]);

    // Active Session Timer
    useEffect(() => {
        if (flowState === 'active') {
            const interval = setInterval(() => {
                setSecondsElapsed(prev => prev + 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [flowState]);

    const formatTime = (totalSeconds: number) => {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-full bg-transparent text-white flex flex-col relative pb-32 md:pb-12 font-sans w-full overflow-x-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#00D2FF]/10 blur-[150px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#C084FC]/5 blur-[150px] rounded-full pointer-events-none"></div>

            <div className="flex-1 w-full flex flex-col pt-8 pb-12 z-10 mx-auto relative px-4 md:px-8 max-w-[1440px]">

                <AnimatePresence mode="wait">
                    {flowState === 'scan' ? (
                        <motion.div
                            key="scan-view"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="flex flex-col gap-12 w-full"
                        >
                            {/* Header Section */}
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-[#00D2FF] rounded-full animate-pulse shadow-[0_0_10px_#00D2FF]"></div>
                                        <span className="text-[#00D2FF] text-[10px] font-black tracking-[0.3em] uppercase">System Initialization</span>
                                    </div>
                                    <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none text-white/95">
                                        Activate Your <br /><span className="text-[#00D2FF]">Power Stream</span>
                                    </h1>
                                </div>
                                <div className="flex flex-wrap gap-4">
                                    <div className="flex items-center gap-3 bg-white/5 border border-white/5 px-5 py-3 rounded-2xl backdrop-blur-sm shadow-xl">
                                        <BatteryCharging className="w-5 h-5 text-[#00D2FF]" />
                                        <div>
                                            <div className="text-white font-bold text-xs">Station CG-8821</div>
                                            <div className="text-white/40 text-[9px] uppercase tracking-widest font-black">12 Ready</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 bg-white/5 border border-white/5 px-5 py-3 rounded-2xl backdrop-blur-sm shadow-xl">
                                        <ShieldCheck className="w-5 h-5 text-[#4ADE80]" />
                                        <div>
                                            <div className="text-white font-bold text-xs">Matrix Verified</div>
                                            <div className="text-white/40 text-[9px] uppercase tracking-widest font-black">Secure Node</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Main Content: Scanner + Plans Split */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                                {/* Real QR Scanner column */}
                                <div className="flex flex-col gap-8">
                                    <div className="relative group p-4 rounded-[48px] bg-white/[0.03] backdrop-blur-md border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.5)]">
                                        <div className="aspect-square w-full rounded-[40px] overflow-hidden relative flex items-center justify-center p-12 bg-black border border-white/5">
                                            {/* Corner frames */}
                                            <div className="absolute top-8 left-8 w-16 h-16 border-t-4 border-l-4 border-[#00D2FF] rounded-tl-3xl z-20 shadow-[-5px_-5px_15px_rgba(0,210,255,0.3)]"></div>
                                            <div className="absolute top-8 right-8 w-16 h-16 border-t-4 border-r-4 border-[#00D2FF] rounded-tr-3xl z-20 shadow-[5px_-5px_15px_rgba(0,210,255,0.3)]"></div>
                                            <div className="absolute bottom-8 left-8 w-16 h-16 border-b-4 border-l-4 border-[#00D2FF] rounded-bl-3xl z-20 shadow-[-5px_5px_15px_rgba(0,210,255,0.3)]"></div>
                                            <div className="absolute bottom-8 right-8 w-16 h-16 border-b-4 border-r-4 border-[#00D2FF] rounded-br-3xl z-20 shadow-[5px_5px_15px_rgba(0,210,255,0.3)]"></div>
                                            {/* Scan beam animation */}
                                            <motion.div
                                                initial={{ top: '0%' }}
                                                animate={{ top: '100%' }}
                                                transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
                                                className="absolute inset-x-0 h-[80px] bg-gradient-to-b from-transparent via-[#00D2FF]/40 to-transparent border-b-2 border-[#00D2FF] z-10 shadow-[0_5px_20px_rgba(0,210,255,0.4)]"
                                            />
                                            <div className="flex flex-col items-center gap-6 relative z-20">
                                                <ScanLine className="w-16 h-16 text-[#00D2FF] drop-shadow-[0_0_20px_#00D2FF] animate-pulse" />
                                                <div className="flex flex-col items-center gap-1">
                                                    <p className="text-white/40 text-[10px] font-black tracking-[0.5em] uppercase">Active Target</p>
                                                    <p className="text-[#00D2FF] text-lg font-mono font-bold tracking-widest">{scannedStation}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tap to Open Real Camera */}
                                    <motion.button
                                        whileHover={{ scale: 1.02, boxShadow: '0 20px 50px rgba(0,210,255,0.25)' }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => setShowScanner(true)}
                                        className="w-full bg-[#00D2FF] text-[#03070E] py-5 rounded-3xl font-black text-sm uppercase tracking-widest shadow-[0_8px_30px_rgba(0,210,255,0.3)] flex items-center justify-center gap-3 cursor-pointer transition-all"
                                    >
                                        <ScanLine className="w-5 h-5" /> Tap to Scan QR Code
                                    </motion.button>

                                    <div className="bg-[#0b1320]/60 border border-white/5 rounded-[32px] p-6 backdrop-blur-xl flex items-center justify-between group cursor-help transition-all hover:bg-white/[0.05]">
                                        <div className="flex items-center gap-4">
                                            <HelpCircle className="w-5 h-5 text-white/20 group-hover:text-[#00D2FF] transition-colors" />
                                            <p className="text-white/40 text-xs font-medium leading-relaxed">Position terminal QR within the active frame.<br />Authentication is instant via secure mesh.</p>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-white/10 group-hover:text-white/40 transition-transform group-hover:translate-x-1" />
                                    </div>
                                </div>

                                {/* Right Side: Selection Column */}
                                <div className="flex flex-col gap-10">
                                    <div className="flex flex-col gap-6">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-xl font-bold tracking-wide flex items-center gap-3">
                                                <Zap className="w-5 h-5 text-[#00D2FF]" />
                                                Select Kinetic Plan
                                            </h2>
                                            <button className="text-[10px] font-black text-white/30 uppercase tracking-widest flex items-center gap-1.5 hover:text-white transition-colors">
                                                View All <ChevronRight className="w-3 h-3" />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {[
                                                { id: 'Free', price: '$0', icon: Clock, desc: 'Pay per use rental.' },
                                                { id: 'Traveler', price: '$9', icon: Zap, desc: 'Frequent user pass.' },
                                                { id: 'Monthly', price: '$29', icon: Crown, desc: 'Unlimited swap access.', tag: 'POPULAR' },
                                                { id: 'Elite', price: '$49', icon: ShieldCheck, desc: 'Professional energy.', tag: 'PREMIUM' }
                                            ].map((plan) => (
                                                <div
                                                    key={plan.id}
                                                    onClick={() => setSelectedPlan(plan.id)}
                                                    className={`p-6 rounded-[28px] border transition-all duration-300 cursor-pointer relative group flex flex-col gap-6 min-h-[180px] ${selectedPlan === plan.id ? 'bg-[#00D2FF]/5 border-[#00D2FF]/50 shadow-[0_15px_40px_rgba(0,210,255,0.1)]' : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10'}`}
                                                >
                                                    {plan.tag && (
                                                        <span className={`absolute top-0 right-8 px-3 py-1 rounded-b-xl text-[8px] font-black tracking-widest text-[#03070E] ${plan.id === 'Monthly' ? 'bg-[#00D2FF]' : 'bg-[#C084FC]'}`}>
                                                            {plan.tag}
                                                        </span>
                                                    )}
                                                    <div className="flex justify-between items-start">
                                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-500 ${selectedPlan === plan.id ? 'bg-[#00D2FF] border-[#00D2FF]' : 'bg-white/5 border-white/5'}`}>
                                                            <plan.icon className={`w-6 h-6 ${selectedPlan === plan.id ? 'text-black' : 'text-white/40'}`} />
                                                        </div>
                                                        <div className="flex items-baseline gap-0.5">
                                                            <span className={`text-2xl font-black ${selectedPlan === plan.id ? 'text-white' : 'text-white/40'}`}>{plan.price}</span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-white font-bold text-lg mb-1">{plan.id}</h3>
                                                        <p className="text-white/30 text-xs font-medium leading-relaxed">{plan.desc}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-[#0b1320] to-[#0A101C] border border-white/10 rounded-[32px] p-8 mt-4 shadow-2xl relative overflow-hidden">
                                        <div className="relative z-10">
                                            <div className="flex items-center justify-between mb-8">
                                                <div className="flex flex-col gap-1">
                                                    <h3 className="text-white font-bold text-xl uppercase tracking-wider">Plan Summary</h3>
                                                    <p className="text-white/30 text-xs font-bold tracking-widest">INITIALIZED • {new Date().toLocaleTimeString()}</p>
                                                </div>
                                                <Info className="w-5 h-5 text-white/20 hover:text-white transition-colors cursor-pointer" />
                                            </div>

                                            <button
                                                onClick={handleConfirmSelection}
                                                className="w-full bg-[#00D2FF] hover:bg-[#1E90FF] active:scale-95 text-[#03070E] font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-[0_15px_40px_rgba(0,210,255,0.3)] group cursor-pointer"
                                            >
                                                <Lock className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                                <span className="text-base tracking-[0.05em] uppercase">Initialize Unlock</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : flowState === 'unlocking' ? (
                        <motion.div
                            key="unlocking-view"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, y: -40 }}
                            className="flex-1 flex items-center justify-center w-full min-h-[60vh]"
                        >
                            <div className="max-w-[480px] w-full bg-[#0A101C] border border-[#00D2FF]/30 rounded-[40px] p-12 flex flex-col items-center justify-center text-center shadow-[0_40px_100px_rgba(0,210,255,0.15)] relative overflow-hidden">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,#00D2FF10_0%,transparent_70%)]"></div>

                                <div className="relative mb-12">
                                    <div className="w-32 h-32 rounded-full border-2 border-[#00D2FF]/20 flex items-center justify-center relative">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                                            className="absolute inset-[-4px] border-t-2 border-[#00D2FF] rounded-full drop-shadow-[0_0_10px_#00D2FF]"
                                        ></motion.div>
                                        <Lock className="w-12 h-12 text-[#00D2FF]" />
                                    </div>
                                </div>

                                <h2 className="text-white font-black text-2xl tracking-tight uppercase mb-4 relative z-10">Authorizing Terminal</h2>

                                <div className="w-full space-y-3 relative z-10">
                                    <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-[#00D2FF] to-[#1E90FF] rounded-full shadow-[0_0_15px_rgba(0,210,255,0.6)]"
                                            initial={{ width: '0%' }}
                                            animate={{ width: `${progress}%` }}
                                        ></motion.div>
                                    </div>
                                    <span className="text-white font-mono font-bold text-xs">{progress}% Complete</span>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="active-view"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col gap-8 w-full max-w-[1200px] mx-auto"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 bg-[#0A101C] border border-[#00D2FF]/30 rounded-[40px] p-10 flex flex-col relative overflow-hidden shadow-2xl">
                                    <div className="flex items-center justify-between mb-12 relative z-10">
                                        <h2 className="text-white text-3xl font-black">Plan: {selectedPlan} Pro</h2>
                                        <button
                                            onClick={() => { endRental(); setFlowState('scan'); }}
                                            className="px-6 py-3 bg-red-500/10 border border-red-500/20 text-red-500 font-bold text-xs rounded-2xl flex items-center gap-2 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                                        >
                                            <RotateCcw className="w-4 h-4" /> End Session
                                        </button>
                                    </div>

                                    <div className="flex flex-col items-center justify-center flex-grow py-12 relative z-10">
                                        <div className="text-[#00D2FF] font-mono font-black text-8xl md:text-[10rem] tracking-tighter drop-shadow-[0_0_50px_rgba(0,210,255,0.6)]">
                                            {formatTime(secondsElapsed)}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 relative z-10">
                                        <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 flex flex-col items-center gap-2">
                                            <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Energy Transfer</span>
                                            <span className="text-white text-2xl font-black">
                                                {(2000 + (secondsElapsed * 15)).toLocaleString()} <span className="text-xs text-[#00D2FF]">mAh</span>
                                            </span>
                                        </div>
                                        <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 flex flex-col items-center gap-2">
                                            <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Real-time Cost</span>
                                            <span className="text-white text-2xl font-black">
                                                ${(secondsElapsed * 0.05).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-6">
                                    <div className="bg-gradient-to-br from-[#0b1320] to-[#0A101C] border border-white/5 rounded-[40px] p-8 flex flex-col gap-6 relative overflow-hidden group">
                                        <div className="flex justify-between items-start relative z-10">
                                            <div className="w-14 h-14 bg-[#00D2FF]/10 rounded-2xl flex items-center justify-center border border-[#00D2FF]/20 group-hover:scale-110 transition-transform duration-500">
                                                <BarChart3 className="w-7 h-7 text-[#00D2FF]" />
                                            </div>
                                        </div>
                                        <h3 className="text-white font-bold text-xl relative z-10">Transfer Analytics</h3>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white/[0.03] border border-white/5 rounded-[32px] p-6 flex flex-col gap-4 hover:bg-white/[0.05] transition-all cursor-help group">
                                            <ShieldCheck className="w-5 h-5 text-white/20 group-hover:text-[#00D2FF]" />
                                            <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Secure</span>
                                        </div>
                                        <div className="bg-white/[0.03] border border-white/5 rounded-[32px] p-6 flex flex-col gap-4 hover:bg-white/[0.05] transition-all cursor-help group">
                                            <Info className="w-5 h-5 text-white/20 group-hover:text-[#00D2FF]" />
                                            <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Info</span>
                                        </div>
                                    </div>

                                    <div className="bg-[#00D2FF] rounded-[32px] p-8 flex flex-col gap-4 cursor-pointer hover:shadow-[0_20px_60px_rgba(0,210,255,0.2)] transition-all group">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-[#03070E] font-black text-xl uppercase tracking-tighter">Upgrade Tier</h4>
                                            <ArrowRight className="w-6 h-6 text-[#03070E] transition-transform group-hover:translate-x-2" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ── QR Scanner Overlay ── */}
            <AnimatePresence>
                {showScanner && (
                    <QRScanner
                        onScanSuccess={handleScanSuccess}
                        onClose={() => setShowScanner(false)}
                        title="Scan Station QR"
                        hint="Align the kiosk QR Code within the frame"
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Rent;
