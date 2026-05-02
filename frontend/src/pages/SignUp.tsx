import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, Lock, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { registerUser, saveToken } from '../services/authService';
import axios from 'axios';

const SignUp = () => {
    const navigate = useNavigate();
    const { login, isBackendConnected } = useAppContext();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // ── ONLINE: call real backend ──────────────────────────────────────
        if (isBackendConnected) {
            try {
                const data = await registerUser({ name, email, phone, password });

                // Persist JWT
                saveToken(data.token);

                // Store full profile
                const profile = { ...data.user, phone };
                localStorage.setItem('userProfile', JSON.stringify(profile));

                // Update global state
                login(data.user.name, data.user.email, data.token);

                navigate('/home');
            } catch (err: unknown) {
                if (axios.isAxiosError(err)) {
                    const serverMsg = err.response?.data?.message;
                    const validationErrors = err.response?.data?.errors;
                    if (validationErrors?.length) {
                        setError(validationErrors[0].msg);
                    } else if (serverMsg) {
                        setError(serverMsg);
                    } else if (!err.response) {
                        // Network error → offline fallback
                        offlineFallback();
                    } else {
                        setError('Registration failed. Please try again.');
                    }
                } else {
                    setError('An unexpected error occurred.');
                }
            } finally {
                setLoading(false);
            }
        } else {
            // ── OFFLINE: localStorage fallback ─────────────────────────────
            offlineFallback();
            setLoading(false);
        }
    };

    const offlineFallback = () => {
        const userProfile = { name: name || 'User', email, phone, joinedDate: new Date().toLocaleDateString() };
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
        localStorage.setItem('isLoggedIn', 'true');
        login(userProfile.name, userProfile.email);
        navigate('/home');
    };

    return (
        <div className="min-h-[calc(100vh-60px)] flex flex-col justify-center px-4 sm:px-6 py-8 sm:py-12">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full mx-auto"
            >
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold mb-3">Complete Profile</h1>
                    <p className="text-white/40 font-bold uppercase tracking-widest text-xs">
                        Finalize your energy grid access
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-3">
                        <span className={`w-2 h-2 rounded-full ${isBackendConnected ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`} />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">
                            {isBackendConnected ? 'Live — Backend Connected' : 'Offline Mode'}
                        </span>
                    </div>
                </div>

                {/* Error Banner */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-6"
                        >
                            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                            <p className="text-red-400 text-sm font-medium">{error}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Full Name */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">
                            Full Name
                        </label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                            <input
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-[#00D2FF]/50 focus:outline-none transition-colors text-white"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                            <input
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-[#00D2FF]/50 focus:outline-none transition-colors text-white"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">
                            Phone Number
                        </label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                            <input
                                type="tel"
                                placeholder="+91 99999 00000"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-[#00D2FF]/50 focus:outline-none transition-colors text-white"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                            <input
                                type="password"
                                placeholder="Min. 6 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-[#00D2FF]/50 focus:outline-none transition-colors text-white"
                                required
                                minLength={6}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#00D2FF] text-[#03070E] py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-[0_10px_20px_rgba(0,210,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-6 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
                    >
                        {loading
                            ? <><Loader2 className="w-5 h-5 animate-spin" /> Creating Account…</>
                            : <>COMPLETE REGISTRATION <ArrowRight className="w-5 h-5" /></>
                        }
                    </button>
                </form>

                <p className="mt-10 text-center text-white/40 text-sm">
                    Already have a profile?{' '}
                    <Link to="/signin" className="text-[#00D2FF] font-bold hover:underline">
                        Sign In
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default SignUp;
