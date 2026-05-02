import { Home, Map as MapIcon, QrCode, Wallet, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const BottomNav = () => {
    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#0B0F1A]/95 backdrop-blur-xl border-t border-gray-200 dark:border-white/5 py-4 px-6 flex justify-between items-center safe-area-bottom shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
            <NavLink
                to="/dashboard"
                className={({ isActive }) => `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-[#00D2FF] dark:text-[#00D2FF]' : 'text-gray-400 dark:text-white/40'}`}
            >
                <Home className="w-6 h-6" />
                <span className="text-[10px] uppercase font-bold tracking-widest">Home</span>
            </NavLink>
            <NavLink
                to="/map"
                className={({ isActive }) => `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-[#00D2FF] dark:text-[#00D2FF]' : 'text-gray-400 dark:text-white/40'}`}
            >
                <MapIcon className="w-6 h-6" />
                <span className="text-[10px] uppercase font-bold tracking-widest">Map</span>
            </NavLink>

            {/* Center Rent Button (Highlighted) */}
            <NavLink
                to="/rent"
                className={() => `relative -top-6 flex flex-col items-center transition-transform hover:scale-105`}
            >
                {({ isActive }) => (
                    <>
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,210,255,0.4)] border-[3px] border-white dark:border-[#0B0F1A] ${isActive ? 'bg-[#1E90FF]' : 'bg-[#00D2FF]'}`}>
                            <QrCode className="w-7 h-7 text-white dark:text-[#0B0F1A]" />
                        </div>
                        <span className={`text-[10px] uppercase font-bold tracking-widest mt-1 ${isActive ? 'text-[#00D2FF]' : 'text-gray-500 dark:text-white/40'}`}>Rent</span>
                    </>
                )}
            </NavLink>

            <NavLink
                to="/wallet"
                className={({ isActive }) => `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-[#00D2FF] dark:text-[#00D2FF]' : 'text-gray-400 dark:text-white/40'}`}
            >
                <Wallet className="w-6 h-6" />
                <span className="text-[10px] uppercase font-bold tracking-widest">Wallet</span>
            </NavLink>
            <NavLink
                to="/profile"
                className={({ isActive }) => `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-[#00D2FF] dark:text-[#00D2FF]' : 'text-gray-400 dark:text-white/40'}`}
            >
                <User className="w-6 h-6" />
                <span className="text-[10px] uppercase font-bold tracking-widest">Profile</span>
            </NavLink>
        </nav>
    );
};

export default BottomNav;
