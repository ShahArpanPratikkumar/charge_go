import { useState } from 'react';
import { motion } from 'framer-motion';
import { QrCode, X, MapPin, Search, Map as MapIcon, Crosshair } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Scanner = () => {
    const navigate = useNavigate();
    const [currentLoc, setCurrentLoc] = useState<string | null>(null);
    const [isLocating, setIsLocating] = useState(false);

    const handleGetLocation = () => {
        setIsLocating(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setCurrentLoc(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
                    setIsLocating(false);
                },
                () => {
                    setCurrentLoc('Location access denied');
                    setIsLocating(false);
                }
            );
        } else {
            setCurrentLoc('Browser GPS not supported');
            setIsLocating(false);
        }
    };

    return (
        <div className="min-h-[100dvh] bg-[#03070E] text-white relative flex flex-col items-center">
            {/* Deep dark gradient mapping to blend with app aesthetic */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#00D2FF10_0%,#03070E_80%)] pointer-events-none z-0"></div>

            {/* Header: Exit Button */}
            <div className="w-full p-6 flex justify-start items-center z-20 pt-10">
                <button
                    onClick={() => navigate(-1)}
                    className="p-3 bg-[#00D2FF]/10 rounded-full hover:bg-[#00D2FF]/20 active:scale-[0.9] transition-all flex items-center justify-center border border-[#00D2FF]/30 shadow-[0_0_20px_rgba(0,210,255,0.25)] group"
                >
                    <X className="w-6 h-6 text-[#00D2FF] group-hover:rotate-90 transition-transform" />
                </button>
            </div>

            <div className="flex-1 w-full flex flex-col items-center justify-start px-6 pb-8 z-10 max-w-md mx-auto">

                {/* Title & Instructions */}
                <div className="mb-6 text-center">
                    <h1 className="text-3xl font-extrabold font-outfit tracking-wide mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00D2FF]">Scan to Rent</h1>
                    <p className="text-white/60 text-[13px] tracking-wide font-medium">Align QR Code within frame to unlock</p>
                </div>

                {/* Mock Camera Viewfinder */}
                <div className="relative w-64 h-64 sm:w-72 sm:h-72 mb-10 group overflow-hidden rounded-3xl shadow-[0_15px_50px_rgba(0,0,0,0.8)]">
                    {/* Glowing background representing the camera feed */}
                    <div className="absolute inset-0 border-[1.5px] border-[#00D2FF]/20 rounded-3xl bg-[#0d1522]/60 backdrop-blur-[2px] flex items-center justify-center transition-colors">
                        <QrCode className="w-16 h-16 text-[#00D2FF]/10 group-hover:text-[#00D2FF]/30 transition-colors duration-500" />
                    </div>

                    {/* Corner markers */}
                    <div className="absolute top-0 left-0 w-12 h-12 border-t-[4px] border-l-[4px] border-[#00D2FF] rounded-tl-3xl shadow-[inset_5px_5px_15px_rgba(0,210,255,0.2)]"></div>
                    <div className="absolute top-0 right-0 w-12 h-12 border-t-[4px] border-r-[4px] border-[#00D2FF] rounded-tr-3xl shadow-[inset_-5px_5px_15px_rgba(0,210,255,0.2)]"></div>
                    <div className="absolute bottom-0 left-0 w-12 h-12 border-b-[4px] border-l-[4px] border-[#00D2FF] rounded-bl-3xl shadow-[inset_5px_-5px_15px_rgba(0,210,255,0.2)]"></div>
                    <div className="absolute bottom-0 right-0 w-12 h-12 border-b-[4px] border-r-[4px] border-[#00D2FF] rounded-br-3xl shadow-[inset_-5px_-5px_15px_rgba(0,210,255,0.2)]"></div>

                    {/* Laser scan animation */}
                    <motion.div
                        initial={{ top: '-10%' }}
                        animate={{ top: '110%' }}
                        transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                        className="absolute inset-x-0 h-[80px] bg-gradient-to-b from-transparent to-[#00D2FF]/30 border-b-[3px] border-[#00D2FF] shadow-[0_5px_25px_rgba(0,210,255,0.8)] z-10"
                    ></motion.div>

                    {/* Pulse Border Animation Overlay */}
                    <div className="absolute inset-0 rounded-3xl border-2 border-[#00D2FF] opacity-0 animate-[pulse_2s_ease-in-out_infinite]"></div>
                </div>

                {/* Choose Your Location Section */}
                <div className="w-full bg-[#0b1320]/80 backdrop-blur-2xl border border-white/10 p-6 rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative z-50">
                    <button
                        onClick={() => navigate('/map', { state: { selectMode: true } })}
                        className="text-[11px] font-extrabold text-[#00D2FF] tracking-[0.2em] uppercase mb-5 flex items-center gap-2 w-full text-left hover:text-[#1E90FF] transition-colors"
                    >
                        <MapPin className="w-4 h-4 text-[#00D2FF]" /> Choose Your Location
                    </button>

                    <div className="space-y-3.5 relative z-50">
                        {/* 1. Use Current Location */}
                        <button
                            onClick={handleGetLocation}
                            className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/5 hover:bg-white/10 hover:border-[#00D2FF]/30 rounded-2xl transition-all group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-[#0d1522] border border-[#00D2FF]/20 flex items-center justify-center group-hover:scale-110 group-active:scale-95 transition-transform shadow-[0_0_15px_rgba(0,210,255,0.1)]">
                                    <Crosshair className="w-5 h-5 text-[#00D2FF]" />
                                </div>
                                <div className="text-left">
                                    <div className="text-[14px] font-bold text-white group-hover:text-[#00D2FF] transition-colors mb-0.5 tracking-wide">Use Current Location</div>
                                    <div className="text-[11px] font-medium text-white/40 tracking-wider">
                                        {isLocating ? (
                                            <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-[#00D2FF] rounded-full animate-ping"></div> Locating GPS...</span>
                                        ) : (
                                            currentLoc || "Tap to fetch coordinates"
                                        )}
                                    </div>
                                </div>
                            </div>
                        </button>

                        {/* 2. Search Location */}
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-[#00D2FF] transition-colors" />
                            <input
                                type="text"
                                placeholder="Search your location..."
                                className="w-full bg-[#03070E]/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium text-white placeholder:text-white/30 focus:outline-none focus:border-[#00D2FF]/50 transition-all shadow-inner"
                            />
                        </div>

                        <div className="py-1"></div>

                        {/* 3. Select on Map */}
                        <button
                            onClick={() => navigate('/map', { state: { selectMode: true } })}
                            className="w-full flex items-center justify-center gap-2.5 py-4 bg-[#00D2FF] hover:bg-[#1E90FF] active:scale-[0.98] text-[#03070E] font-extrabold text-[13px] rounded-2xl transition-all shadow-[0_0_20px_rgba(0,210,255,0.25)] tracking-[0.1em] uppercase"
                        >
                            <MapIcon className="w-[18px] h-[18px]" strokeWidth={2.5} /> Select on Map
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Scanner;
