import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

/**
 * /auth/callback
 *
 * Google OAuth redirects here after the backend issues a JWT.
 * URL format: /auth/callback?token=xxx&name=xxx&email=xxx&photo=xxx
 *
 * This page:
 *  1. Reads params from the URL
 *  2. Saves token + profile to localStorage
 *  3. Updates AppContext
 *  4. Redirects to /home
 */
const AuthCallback = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { login } = useAppContext();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const token = searchParams.get('token');
        const name = searchParams.get('name') || 'User';
        const email = searchParams.get('email') || '';
        const photo = searchParams.get('photo') || '';
        const error = searchParams.get('error');

        // ── Error from backend ─────────────────────────────────────────────
        if (error || !token) {
            setErrorMsg(
                error === 'google_auth_failed'
                    ? 'Google sign-in was cancelled or failed. Please try again.'
                    : 'Authentication failed. No token received.'
            );
            setStatus('error');
            setTimeout(() => navigate('/signin'), 3000);
            return;
        }

        // ── Store token + profile ──────────────────────────────────────────
        localStorage.setItem('token', token);
        localStorage.setItem('isLoggedIn', 'true');

        const profile = { name, email, photo };
        localStorage.setItem('userProfile', JSON.stringify(profile));
        localStorage.setItem('chargego_user', JSON.stringify(profile));

        // ── Update global context ──────────────────────────────────────────
        login(name, email, token);

        setStatus('success');

        // Brief pause to show success animation, then navigate
        setTimeout(() => navigate('/home', { replace: true }), 1200);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="min-h-screen bg-[#020B18] flex items-center justify-center px-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-6 text-center max-w-sm"
            >
                {/* Logo */}
                <div className="w-14 h-14 bg-[#00D2FF] rounded-2xl flex items-center justify-center shadow-[0_0_30px_#00D2FF50]">
                    <Zap className="w-7 h-7 text-[#020B18] fill-current" />
                </div>

                {status === 'loading' && (
                    <>
                        <Loader2 className="w-10 h-10 text-[#00D2FF] animate-spin" />
                        <div>
                            <h2 className="text-xl font-black text-white mb-2">Signing you in…</h2>
                            <p className="text-white/40 text-sm">Verifying your Google account</p>
                        </div>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        >
                            <CheckCircle className="w-16 h-16 text-green-400 drop-shadow-[0_0_20px_rgba(74,222,128,0.5)]" />
                        </motion.div>
                        <div>
                            <h2 className="text-2xl font-black text-white mb-2">Welcome!</h2>
                            <p className="text-white/40 text-sm">Redirecting to your dashboard…</p>
                        </div>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <AlertCircle className="w-14 h-14 text-red-400" />
                        <div>
                            <h2 className="text-xl font-black text-white mb-2">Authentication Failed</h2>
                            <p className="text-red-400 text-sm">{errorMsg}</p>
                            <p className="text-white/20 text-xs mt-2">Redirecting to sign in…</p>
                        </div>
                    </>
                )}
            </motion.div>
        </div>
    );
};

export default AuthCallback;
