import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
    Zap, MapPin, Battery, RefreshCw, QrCode, ArrowRight,
    Navigation2, CheckCircle, Star, ChevronRight, Wifi
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

// ── Animation helpers ──────────────────────────────────────────────────────
const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
};
const stagger = (delay = 0) => ({
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay } }
});

function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });
    return (
        <motion.div ref={ref} initial="hidden" animate={inView ? 'show' : 'hidden'} className={className}>
            {children}
        </motion.div>
    );
}

// ── Data ───────────────────────────────────────────────────────────────────
const FEATURES = [
    { icon: Zap, title: 'Instant Power Access', desc: 'Grab a powerbank anytime, anywhere — no waiting, no hassle.', color: '#00D2FF' },
    { icon: MapPin, title: 'Smart Location Tracking', desc: 'Find the nearest charging station in seconds using real-time maps.', color: '#7C3AED' },
    { icon: Battery, title: 'Fast Charging', desc: '20W high-speed power delivery compatible with all devices.', color: '#10B981' },
    { icon: RefreshCw, title: 'Easy Return System', desc: 'Drop the powerbank at any station globally — no stress.', color: '#F59E0B' },
];

const STEPS = [
    { icon: MapPin, step: '01', title: 'Find Station', desc: 'Open the app and discover kiosks near you instantly.' },
    { icon: QrCode, step: '02', title: 'Scan QR', desc: 'Scan the QR code at the kiosk to unlock a powerbank.' },
    { icon: RefreshCw, step: '03', title: 'Charge & Return', desc: 'Keep your device charged, return at any station.' },
];

const STATIONS = [
    { name: 'Nexus Hub Alpha', distance: '0.3 km', available: 12, status: 'online' },
    { name: 'Quantum Point', distance: '0.8 km', available: 8, status: 'online' },
    { name: 'Cyber Kiosk Delta', distance: '1.2 km', available: 5, status: 'busy' },
];

const BENEFITS = [
    'No cables to carry — ever',
    'Zero waiting time at kiosks',
    'Affordable pay-per-minute pricing',
    'Available 24/7 in 500+ locations',
];

// ── Component ──────────────────────────────────────────────────────────────
export default function Home() {
    const navigate = useNavigate();
    const { user } = useAppContext();
    const isLoggedIn = !!user;

    const handleNearby = () => navigate(isLoggedIn ? '/map' : '/signin');
    const handleGetStarted = () => navigate(isLoggedIn ? '/home' : '/signin');

    return (
        <div className="bg-[#020B18] text-white min-h-screen overflow-x-hidden font-sans">

            {/* ── HERO ── */}
            <section className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden">

                {/* Animated gradient blobs */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-[#00D2FF]/10 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#7C3AED]/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
                    <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-[#00D2FF]/5 rounded-full blur-[80px]" />
                </div>

                {/* Grid pattern overlay */}
                <div
                    className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{ backgroundImage: 'linear-gradient(#00D2FF 1px, transparent 1px), linear-gradient(90deg, #00D2FF 1px, transparent 1px)', backgroundSize: '60px 60px' }}
                />

                <motion.div variants={fadeUp} initial="hidden" animate="show" className="relative z-10 max-w-5xl mx-auto">
                    {/* Badge */}
                    <motion.div
                        variants={stagger(0.1)}
                        initial="hidden" animate="show"
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00D2FF]/30 bg-[#00D2FF]/5 text-[#00D2FF] text-[11px] font-bold uppercase tracking-widest mb-8 backdrop-blur-sm"
                    >
                        <span className="w-2 h-2 bg-[#00D2FF] rounded-full animate-pulse shadow-[0_0_8px_#00D2FF]" />
                        Next-Gen Portable Energy Network
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        variants={stagger(0.2)}
                        initial="hidden" animate="show"
                        className="text-6xl sm:text-7xl md:text-[6rem] font-extrabold leading-[1.03] tracking-tight mb-6"
                    >
                        <span
                            className="block text-white"
                            style={{ textShadow: '0 0 80px rgba(0, 210, 255, 0.3)' }}
                        >
                            Power Anytime,
                        </span>
                        <span
                            className="block bg-clip-text text-transparent"
                            style={{ backgroundImage: 'linear-gradient(135deg, #00D2FF 0%, #7C3AED 50%, #00D2FF 100%)', backgroundSize: '200% auto', animation: 'gradientShift 4s ease infinite' }}
                        >
                            Anywhere.
                        </span>
                    </motion.h1>

                    {/* Subtext */}
                    <motion.p
                        variants={stagger(0.3)}
                        initial="hidden" animate="show"
                        className="text-white/50 text-lg md:text-xl max-w-xl mx-auto mb-12 leading-relaxed font-medium"
                    >
                        Rent a powerbank in seconds. Drop it off anywhere. Stay charged — always.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        variants={stagger(0.4)}
                        initial="hidden" animate="show"
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: '0 20px 50px rgba(0,210,255,0.4)' }}
                            whileTap={{ scale: 0.96 }}
                            onClick={handleGetStarted}
                            className="flex items-center gap-2 bg-[#00D2FF] text-[#020B18] px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-[0_8px_30px_rgba(0,210,255,0.3)] transition-all group cursor-pointer"
                        >
                            Get Started
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05, backgroundColor: 'rgba(0,210,255,0.08)' }}
                            whileTap={{ scale: 0.96 }}
                            onClick={handleNearby}
                            className="flex items-center gap-2 bg-white/5 border border-white/10 text-white px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all group cursor-pointer"
                        >
                            <Navigation2 className="w-4 h-4 text-[#00D2FF]" />
                            Find Nearby Station
                        </motion.button>
                    </motion.div>
                </motion.div>

                {/* Scroll hint */}
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                >
                    <span className="text-white/20 text-[10px] font-bold uppercase tracking-widest">Scroll</span>
                    <div className="w-[1px] h-12 bg-gradient-to-b from-white/20 to-transparent" />
                </motion.div>
            </section>

            {/* ── TRUST BAR ── */}
            <Section className="py-16 border-y border-white/5">
                <motion.div variants={fadeUp} className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-center gap-8 text-center">
                    <div className="flex -space-x-3">
                        {['#00D2FF', '#7C3AED', '#10B981', '#F59E0B', '#EF4444'].map((c, i) => (
                            <div key={i} className="w-10 h-10 rounded-full border-2 border-[#020B18] flex items-center justify-center text-xs font-black" style={{ backgroundColor: c + '22', borderColor: c + '55', color: c }}>
                                {String.fromCharCode(65 + i)}
                            </div>
                        ))}
                    </div>
                    <div className="text-left">
                        <div className="text-2xl font-extrabold text-white">Trusted by <span className="text-[#00D2FF]">50,000+</span> users</div>
                        <div className="text-white/30 text-sm mt-1">across 500+ locations in India & beyond</div>
                    </div>
                    <div className="hidden sm:block w-[1px] h-12 bg-white/10" />
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />)}
                        <span className="text-white/50 text-sm ml-2">4.9 / 5.0</span>
                    </div>
                </motion.div>
            </Section>

            {/* ── FEATURES ── */}
            <section className="py-32 px-6">
                <Section>
                    <motion.div variants={fadeUp} className="text-center max-w-2xl mx-auto mb-20">
                        <p className="text-[#00D2FF] text-[11px] font-black uppercase tracking-[0.3em] mb-4">Why ChargeGo</p>
                        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
                            Everything you need,<br />
                            <span className="text-white/30">nothing you don't.</span>
                        </h2>
                    </motion.div>
                </Section>

                <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {FEATURES.map((f, i) => (
                        <Section key={i}>
                            <motion.div
                                variants={stagger(i * 0.08)}
                                whileHover={{ y: -8, boxShadow: `0 30px 60px ${f.color}18` }}
                                className="h-full p-8 rounded-3xl border border-white/5 bg-white/[0.03] backdrop-blur-sm cursor-default transition-all group"
                                style={{ '--accent': f.color } as React.CSSProperties}
                            >
                                <div
                                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-all group-hover:scale-110"
                                    style={{ backgroundColor: f.color + '18', border: `1px solid ${f.color}30` }}
                                >
                                    <f.icon className="w-6 h-6" style={{ color: f.color }} />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-3">{f.title}</h3>
                                <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
                            </motion.div>
                        </Section>
                    ))}
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section className="py-32 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00D2FF]/3 to-transparent pointer-events-none" />
                <Section>
                    <motion.div variants={fadeUp} className="text-center max-w-xl mx-auto mb-24">
                        <p className="text-[#00D2FF] text-[11px] font-black uppercase tracking-[0.3em] mb-4">Simple Process</p>
                        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">How it works</h2>
                    </motion.div>
                </Section>

                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                    {/* Connecting line (desktop) */}
                    <div className="hidden md:block absolute top-10 left-1/6 right-1/6 h-[1px] bg-gradient-to-r from-transparent via-[#00D2FF]/30 to-transparent" style={{ top: '2.5rem', left: '16.7%', right: '16.7%' }} />

                    {STEPS.map((s, i) => (
                        <Section key={i}>
                            <motion.div variants={stagger(i * 0.15)} className="flex flex-col items-center text-center gap-5">
                                <div className="relative">
                                    <div className="w-20 h-20 rounded-3xl bg-[#00D2FF]/10 border border-[#00D2FF]/20 flex items-center justify-center shadow-[0_0_30px_rgba(0,210,255,0.1)]">
                                        <s.icon className="w-8 h-8 text-[#00D2FF]" />
                                    </div>
                                    <div className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-[#00D2FF] text-[#020B18] text-[10px] font-black flex items-center justify-center shadow-[0_0_12px_#00D2FF]">
                                        {s.step}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">{s.title}</h3>
                                    <p className="text-white/40 text-sm leading-relaxed max-w-[200px] mx-auto">{s.desc}</p>
                                </div>
                            </motion.div>
                        </Section>
                    ))}
                </div>
            </section>

            {/* ── LIVE PREVIEW ── */}
            <section className="py-32 px-6">
                <Section>
                    <motion.div variants={fadeUp} className="text-center max-w-xl mx-auto mb-16">
                        <p className="text-[#00D2FF] text-[11px] font-black uppercase tracking-[0.3em] mb-4">Real-Time Grid</p>
                        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Live Nearby Stations</h2>
                        <p className="text-white/30 text-sm">Real-time availability across our charging network</p>
                    </motion.div>
                </Section>

                <div className="max-w-2xl mx-auto space-y-4 mb-12">
                    {STATIONS.map((s, i) => (
                        <Section key={i}>
                            <motion.div
                                variants={stagger(i * 0.1)}
                                whileHover={{ x: 6, borderColor: 'rgba(0,210,255,0.3)' }}
                                className="flex items-center justify-between p-5 rounded-2xl border border-white/5 bg-white/[0.03] backdrop-blur-sm transition-all cursor-pointer group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-3 h-3 rounded-full ${s.status === 'online' ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]' : 'bg-yellow-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]'} animate-pulse`} />
                                    <div>
                                        <div className="font-bold text-white text-sm">{s.name}</div>
                                        <div className="text-white/30 text-xs mt-0.5">{s.available} units available</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-right">
                                        <div className="text-[#00D2FF] text-sm font-black">{s.distance}</div>
                                        <div className="text-white/20 text-[10px] uppercase">away</div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-[#00D2FF] group-hover:translate-x-1 transition-all" />
                                </div>
                            </motion.div>
                        </Section>
                    ))}
                </div>

                <Section>
                    <motion.div variants={fadeUp} className="text-center">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleNearby}
                            className="inline-flex items-center gap-2 border border-[#00D2FF]/40 text-[#00D2FF] px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-[#00D2FF]/5 transition-all cursor-pointer"
                        >
                            <Wifi className="w-4 h-4" /> View Live Map
                        </motion.button>
                    </motion.div>
                </Section>
            </section>

            {/* ── BENEFITS ── */}
            <section className="py-24 px-6">
                <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                    <Section>
                        <motion.div variants={fadeUp}>
                            <p className="text-[#00D2FF] text-[11px] font-black uppercase tracking-[0.3em] mb-4">The ChargeGo Edge</p>
                            <h2 className="text-4xl font-extrabold tracking-tight mb-8">Everything built for your life on the go.</h2>
                            <div className="space-y-4">
                                {BENEFITS.map((b, i) => (
                                    <motion.div key={i} variants={stagger(i * 0.1)} className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-[#00D2FF]/10 border border-[#00D2FF]/30 flex items-center justify-center flex-shrink-0">
                                            <CheckCircle className="w-3.5 h-3.5 text-[#00D2FF]" />
                                        </div>
                                        <span className="text-white/70 font-medium">{b}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </Section>

                    <Section>
                        <motion.div variants={stagger(0.2)} className="relative">
                            {/* Decorative card stack */}
                            <div className="absolute inset-x-8 top-4 h-full rounded-3xl bg-[#00D2FF]/5 border border-[#00D2FF]/10" />
                            <div className="absolute inset-x-4 top-2 h-full rounded-3xl bg-[#00D2FF]/8 border border-[#00D2FF]/15" />
                            <div className="relative p-8 rounded-3xl bg-[#0D1F35] border border-white/10 shadow-2xl">
                                <div className="flex items-center justify-between mb-6">
                                    <span className="text-white/40 text-xs font-bold uppercase tracking-widest">Live Status</span>
                                    <span className="flex items-center gap-1.5 text-green-400 text-[11px] font-bold">
                                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                        All Systems Nominal
                                    </span>
                                </div>
                                {[
                                    { label: 'Active Stations', value: '500+', color: '#00D2FF' },
                                    { label: 'Units Available', value: '12,400', color: '#10B981' },
                                    { label: 'Happy Users', value: '50K+', color: '#7C3AED' },
                                    { label: 'Avg Response', value: '< 2 min', color: '#F59E0B' },
                                ].map((stat, i) => (
                                    <div key={i} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                                        <span className="text-white/40 text-sm">{stat.label}</span>
                                        <span className="font-black text-lg" style={{ color: stat.color }}>{stat.value}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </Section>
                </div>
            </section>

            {/* ── CTA BANNER ── */}
            <section className="py-32 px-6">
                <Section>
                    <motion.div
                        variants={fadeUp}
                        className="max-w-3xl mx-auto text-center relative"
                    >
                        <div className="absolute inset-0 bg-[#00D2FF]/5 rounded-[40px] blur-3xl scale-110" />
                        <div className="relative p-16 rounded-[40px] border border-[#00D2FF]/10 bg-gradient-to-br from-[#00D2FF]/5 via-transparent to-[#7C3AED]/5 backdrop-blur-sm">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00D2FF]/20 bg-[#00D2FF]/5 text-[#00D2FF] text-[11px] font-bold uppercase tracking-widest mb-8">
                                <Zap className="w-3 h-3" /> Limited Beta Access
                            </div>
                            <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-white" style={{ textShadow: '0 0 60px rgba(0,210,255,0.2)' }}>
                                Ready to Power Up?
                            </h2>
                            <p className="text-white/40 text-lg mb-10 max-w-lg mx-auto">
                                Join 50,000+ users keeping their devices charged. Start your energy journey today.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <motion.button
                                    whileHover={{ scale: 1.05, boxShadow: '0 20px 50px rgba(0,210,255,0.4)' }}
                                    whileTap={{ scale: 0.96 }}
                                    onClick={handleGetStarted}
                                    className="flex items-center justify-center gap-2 bg-[#00D2FF] text-[#020B18] px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-[0_8px_30px_rgba(0,210,255,0.3)] cursor-pointer group transition-all"
                                >
                                    Get Started Free
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(0,210,255,0.08)' }}
                                    whileTap={{ scale: 0.96 }}
                                    onClick={handleNearby}
                                    className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white px-10 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all cursor-pointer"
                                >
                                    <Navigation2 className="w-4 h-4 text-[#00D2FF]" /> Find Stations
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </Section>
            </section>

            {/* ── FOOTER ── */}
            <footer className="border-t border-white/5 py-12 px-6">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#00D2FF] rounded-lg flex items-center justify-center shadow-[0_0_15px_#00D2FF50]">
                            <Zap className="w-4 h-4 text-[#020B18] fill-current" />
                        </div>
                        <span className="text-[#00D2FF] font-outfit text-lg font-extrabold tracking-tighter">CHARGEGO</span>
                        <span className="text-white/20 text-xs ml-2">© 2026</span>
                    </div>

                    <div className="flex items-center gap-8 text-white/30 text-xs font-bold uppercase tracking-widest">
                        <button className="hover:text-[#00D2FF] transition-colors cursor-pointer">Privacy Policy</button>
                        <button className="hover:text-[#00D2FF] transition-colors cursor-pointer">Terms of Service</button>
                        <button className="hover:text-[#00D2FF] transition-colors cursor-pointer">Contact</button>
                    </div>
                </div>
            </footer>

            {/* Gradient shift animation */}
            <style>{`
                @keyframes gradientShift {
                    0% { background-position: 0% center; }
                    50% { background-position: 100% center; }
                    100% { background-position: 0% center; }
                }
            `}</style>
        </div>
    );
}
