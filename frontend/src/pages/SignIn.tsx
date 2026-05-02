import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { loginUser, saveToken } from '../services/authService';
import axios from 'axios';

const SignIn = () => {
    const navigate = useNavigate();
    const { login, isBackendConnected } = useAppContext();

    const [email, setEmail] = useState('');
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
                const data = await loginUser({ email, password });

                // Persist JWT token
                saveToken(data.token);

                // Update global app state
                login(data.user.name, data.user.email, data.token);

                // Save full profile for offline resilience
                localStorage.setItem('userProfile', JSON.stringify(data.user));

                // Route: new users → register, returning users → home
                if (!data.isProfileComplete) {
                    navigate('/register');
                } else {
                    navigate('/home');
                }
            } catch (err: unknown) {
                if (axios.isAxiosError(err)) {
                    const serverMsg = err.response?.data?.message;
                    const validationErrors = err.response?.data?.errors;
                    if (validationErrors?.length) {
                        setError(validationErrors[0].msg);
                    } else if (serverMsg) {
                        setError(serverMsg);
                    } else if (!err.response) {
                        setError('Cannot reach server. Running in offline mode.');
                        // Fallback to localStorage auth
                        offlineFallback();
                    } else {
                        setError('Sign in failed. Please try again.');
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
        localStorage.setItem('isLoggedIn', 'true');
        const existingProfile = localStorage.getItem('userProfile');
        if (!existingProfile) {
            login('New Explorer', email);
            navigate('/register');
        } else {
            const userData = JSON.parse(existingProfile);
            login(userData.name, userData.email);
            navigate('/home');
        }
    };

    return (
        <div className="min-h-[calc(100vh-60px)] flex flex-col justify-center px-4 sm:px-6 py-8 sm:py-12">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full mx-auto"
            >
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold mb-3">Welcome Back</h1>
                    <p className="text-white/40 font-bold uppercase tracking-widest text-xs">
                        Sign in to continue charging
                    </p>
                    {/* Backend status indicator */}
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

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-white/50 ml-1">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                            <input
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:border-[#00D2FF]/50 focus:outline-none transition-colors text-white"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-white/50 ml-1">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:border-[#00D2FF]/50 focus:outline-none transition-colors text-white"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="flex justify-between items-center px-1">
                        <label className="flex items-center gap-2 text-sm text-white/50 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 rounded bg-white/5 border-white/10 accent-[#00D2FF]" />
                            Remember me
                        </label>
                        <button type="button" className="text-[#00D2FF] text-sm font-bold hover:underline">
                            Forgot password?
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#00D2FF] text-[#03070E] py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-[0_10px_20px_rgba(0,210,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
                    >
                        {loading
                            ? <><Loader2 className="w-5 h-5 animate-spin" /> Signing In…</>
                            : <>SIGN IN <ArrowRight className="w-5 h-5" /></>
                        }
                    </button>
                </form>

                <div className="mt-8">
                    <div className="relative flex items-center gap-4 mb-6">
                        <div className="flex-grow h-[1px] bg-white/10" />
                        <span className="text-xs font-bold text-white/20 uppercase tracking-widest whitespace-nowrap">Or continue with</span>
                        <div className="flex-grow h-[1px] bg-white/10" />
                    </div>

                    {/* Google OAuth Button */}
                    <motion.button
                        whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(255,255,255,0.08)' }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => {
                            window.location.href = 'http://localhost:5000/api/auth/google';
                        }}
                        className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 py-3.5 rounded-xl font-bold text-sm shadow-lg hover:bg-gray-50 transition-all cursor-pointer border border-gray-200"
                    >
                        {/* Official Google G SVG */}
                        <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                        </svg>
                        Continue with Google
                    </motion.button>
                </div>

                <p className="mt-10 text-center text-white/40 text-sm">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-[#00D2FF] font-bold hover:underline">
                        Sign up for free
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default SignIn;
