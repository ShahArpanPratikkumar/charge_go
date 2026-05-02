import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Bell, User, Sun, Moon, LogIn, LogOut, Zap, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

// ─────────────────────────────────────────────
//  MINIMAL NAVBAR  (shown before login)
// ─────────────────────────────────────────────
const MinimalNavbar = () => {
    const { theme, toggleTheme } = useAppContext();
    const navigate = useNavigate();

    return (
        <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="sticky top-0 z-[100] bg-white/80 dark:bg-[#0B0F1A]/80 backdrop-blur-lg py-4 px-4 sm:px-6 md:px-12 flex justify-between items-center border-b border-gray-100 dark:border-white/5 transition-colors duration-300"
        >
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
                <div className="w-8 h-8 bg-[#00D2FF] rounded-lg flex items-center justify-center shadow-[0_0_15px_#00D2FF50]">
                    <Zap className="w-4 h-4 text-[#03070E] fill-current" />
                </div>
                <span className="text-[#00D2FF] font-outfit text-lg sm:text-xl font-extrabold tracking-tighter">CHARGEGO</span>
            </Link>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                    aria-label="Toggle theme"
                >
                    {theme === 'dark'
                        ? <Sun className="w-5 h-5 text-yellow-400" />
                        : <Moon className="w-5 h-5 text-gray-600" />
                    }
                </button>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/signin')}
                    className="flex items-center gap-1.5 bg-[#00D2FF] text-[#03070E] px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-[0_0_15px_#00D2FF40] hover:shadow-[0_0_25px_#00D2FF60] transition-all cursor-pointer"
                >
                    <LogIn className="w-4 h-4" />
                    <span className="hidden xs:inline">Get Started</span>
                    <span className="xs:hidden">Login</span>
                </motion.button>
            </div>
        </motion.nav>
    );
};

// ─────────────────────────────────────────────
//  FULL NAVBAR  (shown after login)
// ─────────────────────────────────────────────
const NAV_LINKS = [
    { path: '/home', label: 'HOME' },
    { path: '/map', label: 'MAP' },
    { path: '/rent', label: 'RENT' },
    { path: '/wallet', label: 'WALLET' },
    { path: '/help', label: 'HELP' },
];

const FullNavbar = () => {
    const { theme, toggleTheme, logout, user } = useAppContext();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setMobileOpen(false);
        navigate('/');
    };

    const handleNavClick = () => setMobileOpen(false);

    return (
        <>
            <motion.nav
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="sticky top-0 z-[100] bg-white/90 dark:bg-[#0B0F1A]/90 backdrop-blur-lg py-4 px-4 sm:px-6 md:px-12 flex justify-between items-center border-b border-gray-100 dark:border-white/5 transition-colors duration-300"
            >
                {/* Logo */}
                <div className="flex-shrink-0">
                    <Link to="/home" className="flex items-center gap-2 w-fit" onClick={handleNavClick}>
                        <div className="w-8 h-8 bg-[#00D2FF] rounded-lg flex items-center justify-center shadow-[0_0_15px_#00D2FF50]">
                            <Zap className="w-4 h-4 text-[#03070E] fill-current" />
                        </div>
                        <span className="text-[#00D2FF] font-outfit text-lg sm:text-xl font-extrabold tracking-tighter">CHARGEGO</span>
                    </Link>
                </div>

                {/* Desktop Nav Links */}
                <div className="hidden md:flex items-center justify-center gap-6 lg:gap-8 font-bold text-xs tracking-widest">
                    {NAV_LINKS.map(({ path, label }) => {
                        const isActive = location.pathname === path;
                        return (
                            <Link
                                key={label}
                                to={path}
                                className={`relative transition-colors group pb-1 ${isActive
                                    ? 'text-[#00D2FF]'
                                    : 'text-gray-500 dark:text-white/50 hover:text-[#00D2FF] dark:hover:text-[#00D2FF]'
                                    }`}
                            >
                                {label}
                                <AnimatePresence>
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeNavIndicator"
                                            className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#00D2FF] rounded-full shadow-[0_0_6px_#00D2FF]"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        />
                                    )}
                                </AnimatePresence>
                            </Link>
                        );
                    })}
                </div>

                {/* Desktop Right Controls */}
                <div className="hidden md:flex items-center justify-end gap-3">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark'
                            ? <Sun className="w-5 h-5 text-yellow-400" />
                            : <Moon className="w-5 h-5 text-gray-600" />
                        }
                    </button>

                    <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors relative">
                        <Bell className="w-5 h-5 text-gray-600 dark:text-white/70" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#0B0F1A] animate-pulse" />
                    </button>

                    <Link
                        to="/profile"
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                    >
                        <div className="w-7 h-7 rounded-full bg-[#00D2FF]/10 border border-[#00D2FF]/30 flex items-center justify-center">
                            <User className="w-4 h-4 text-[#00D2FF]" />
                        </div>
                        <span className="text-xs font-bold text-gray-700 dark:text-white/70 max-w-[80px] truncate">
                            {user?.name?.split(' ')[0] || 'Profile'}
                        </span>
                    </Link>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleLogout}
                        className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors group"
                        aria-label="Logout"
                        title="Sign Out"
                    >
                        <LogOut className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
                    </motion.button>
                </div>

                {/* Mobile: theme + hamburger */}
                <div className="flex md:hidden items-center gap-2">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                    >
                        {theme === 'dark'
                            ? <Sun className="w-5 h-5 text-yellow-400" />
                            : <Moon className="w-5 h-5 text-gray-600" />
                        }
                    </button>
                    <button
                        onClick={() => setMobileOpen(v => !v)}
                        className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                        aria-label="Toggle menu"
                    >
                        {mobileOpen
                            ? <X className="w-5 h-5 text-white" />
                            : <Menu className="w-5 h-5 text-gray-600 dark:text-white/70" />
                        }
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="sticky top-[73px] z-[99] w-full bg-white dark:bg-[#0B0F1A] border-b border-gray-100 dark:border-white/5 overflow-hidden shadow-2xl md:hidden"
                    >
                        <div className="px-4 py-4 flex flex-col gap-1">
                            {/* Nav Links */}
                            {NAV_LINKS.map(({ path, label }) => {
                                const isActive = location.pathname === path;
                                return (
                                    <Link
                                        key={label}
                                        to={path}
                                        onClick={handleNavClick}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-black text-sm tracking-widest transition-all ${isActive
                                            ? 'bg-[#00D2FF]/10 text-[#00D2FF] border border-[#00D2FF]/20'
                                            : 'text-gray-600 dark:text-white/50 hover:bg-gray-50 dark:hover:bg-white/5'
                                            }`}
                                    >
                                        {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#00D2FF] shadow-[0_0_6px_#00D2FF]" />}
                                        {label}
                                    </Link>
                                );
                            })}

                            <div className="h-[1px] bg-gray-100 dark:bg-white/5 my-2" />

                            {/* Profile & Logout */}
                            <Link
                                to="/profile"
                                onClick={handleNavClick}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 dark:text-white/50 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                            >
                                <User className="w-4 h-4" />
                                <span className="font-bold text-sm">{user?.name || 'Profile'}</span>
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all w-full text-left"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="font-bold text-sm">Sign Out</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

// ─────────────────────────────────────────────
//  SMART NAVBAR
// ─────────────────────────────────────────────
const Navbar = () => {
    const { user } = useAppContext();
    return !!user ? <FullNavbar /> : <MinimalNavbar />;
};

export default Navbar;
