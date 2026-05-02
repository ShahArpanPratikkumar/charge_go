import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap, QrCode, MapPin, Wallet, ChevronRight, CheckCircle2,
    Crown, Receipt, HeadphonesIcon, RotateCcw, Tag, Gift, BarChart2, DollarSign, Leaf, Clock, ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet icon
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

const StationIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div class="w-8 h-8 rounded-full bg-[#00D2FF]/20 border-2 border-[#00D2FF] flex items-center justify-center shadow-[0_0_15px_#00D2FF]">
             <div class="w-3 h-3 bg-[#00D2FF] rounded-full animate-pulse"></div>
           </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
});

const RecenterMap = ({ coords }: { coords: { lat: number, lng: number } }) => {
    const map = useMap();
    useEffect(() => {
        map.setView([coords.lat, coords.lng], map.getZoom());
    }, [coords, map]);
    return null;
};

const Dashboard = () => {
    const navigate = useNavigate();
    const [toast, setToast] = useState<string | null>(null);
    const { user, walletBalance, activeRental, transactions, topUpWallet, endRental } = useAppContext();

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    const handleAction = (action: string, route?: string) => {
        if (route) {
            navigate(route);
        } else {
            showToast(`${action} portal initialized.`);
        }
    };

    const handleTopUp = () => {
        topUpWallet(25);
        showToast("Credit injected: +$25.00 available.");
    };

    // PROXIMITY ENGINE & GEOLOCATION
    const [coords, setCoords] = useState<{ lat: number; lng: number }>({ lat: 23.03, lng: 72.58 });
    const [nearbyCount, setNearbyCount] = useState(0);

    const STATIONS = [
        { id: '1', name: "Nexus Hub Alpha", lat: 23.03, lng: 72.58 },
        { id: '2', name: "Quantum Point", lat: 23.04, lng: 72.57 },
        { id: '3', name: "Cyber Kiosk Delta", lat: 23.02, lng: 72.59 },
        { id: '4', name: "Matrix Station 9", lat: 23.05, lng: 72.56 },
        { id: '5', name: "Pulse Node Primary", lat: 23.035, lng: 72.575 }
    ];

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371; // km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    useEffect(() => {
        const fetchLocation = () => {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                    () => console.warn("Location denied. defaulting to Ahmedabad.")
                );
            }
        };

        fetchLocation();
        const interval = setInterval(fetchLocation, 10000);
        return () => clearInterval(interval);
    }, []);

    const nearbyStations = STATIONS.map(s => ({
        ...s,
        dist: calculateDistance(coords.lat, coords.lng, s.lat, s.lng)
    }))
        .filter(s => s.dist < 5)
        .sort((a, b) => a.dist - b.dist);

    useEffect(() => {
        setNearbyCount(nearbyStations.length);
    }, [nearbyStations.length]);

    const firstName = user?.name ? user.name.split(' ')[0] : 'Jay';

    const cardStyles = "bg-white dark:bg-[#0d1421] border border-gray-100 dark:border-white/5 rounded-[32px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none transition-all duration-500 overflow-hidden relative";
    const subtextStyles = "text-gray-500 dark:text-white/40";

    // Stats Logic
    const rentalHistory = transactions.filter(t => t.type === 'rental');
    const totalSpent = Math.abs(rentalHistory.reduce((acc, curr) => acc + curr.amount, 0));

    return (
        <div className="min-h-screen bg-transparent text-slate-900 dark:text-slate-100 font-sans pb-24 relative pt-4 px-4 md:px-10 lg:px-16 transition-colors duration-500">

            {/* Ambient Background Elements (Dark Mode Only) */}
            <div className="fixed inset-0 pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-1000">
                <div className="absolute top-[10%] left-[-5%] w-[40%] h-[40%] bg-[#00D2FF]/10 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[20%] right-[-5%] w-[30%] h-[30%] bg-purple-500/5 blur-[120px] rounded-full"></div>
            </div>

            {/* Custom Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-white/80 dark:bg-[#0B0F1A]/90 backdrop-blur-xl border border-gray-200 dark:border-[#00D2FF]/20 text-slate-900 dark:text-white px-8 py-4 rounded-3xl flex items-center gap-4 shadow-2xl"
                    >
                        <div className="w-8 h-8 rounded-full bg-[#00D2FF]/10 flex items-center justify-center">
                            <Zap className="w-4 h-4 text-[#00D2FF]" fill="currentColor" />
                        </div>
                        <span className="text-sm font-bold tracking-tight">{toast}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12 relative z-10">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-4xl lg:text-5xl font-black tracking-tighter mb-3 flex items-center gap-4 text-slate-900 dark:text-white uppercase leading-none"
                    >
                        Welcome back, {firstName} <span className="text-4xl animate-bounce-slow">⚡</span>
                    </motion.h1>
                    <p className={`text-sm font-black uppercase tracking-[0.2em] opacity-50`}>
                        Kinetic Status: <span className="text-green-500">Operational</span> • Grid Optimized
                    </p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-4 bg-white dark:bg-[#0d1421] border border-gray-100 dark:border-white/5 py-3 px-6 rounded-2xl shadow-xl dark:shadow-none"
                    >
                        <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                            <Crown className="w-5 h-5 text-yellow-500" />
                        </div>
                        <div>
                            <div className="text-slate-900 dark:text-white font-black text-lg tracking-tight">1,250</div>
                            <div className="text-[10px] font-black uppercase tracking-widest opacity-40">Points</div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">

                {/* Visual Banner / Map Preview */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`lg:col-span-8 ${cardStyles} min-h-[400px] flex flex-col`}
                >
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h2 className="text-2xl font-black uppercase tracking-tight mb-1">Nearby Charging Stations</h2>
                            <p className="text-xs font-medium text-[#00D2FF] font-black uppercase tracking-widest">
                                {nearbyCount} Nodes found within 5km
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/map')}
                            className="text-[10px] font-black uppercase tracking-widest bg-white/5 border border-white/10 px-5 py-2.5 rounded-xl hover:bg-white/10 transition-all flex items-center gap-2"
                        >
                            View All <ChevronRight className="w-3 h-3" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 h-full">
                        {/* Real Leaflet Map Fragment */}
                        <div className="bg-slate-50 dark:bg-[#03070E] rounded-3xl relative overflow-hidden border border-gray-100 dark:border-white/5 flex items-center justify-center group cursor-crosshair h-full min-h-[300px] z-0">
                            <MapContainer
                                center={[coords.lat, coords.lng]}
                                zoom={14}
                                scrollWheelZoom={false}
                                className="w-full h-full"
                                zoomControl={false}
                            >
                                <TileLayer
                                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                                />
                                <RecenterMap coords={coords} />
                                <Marker position={[coords.lat, coords.lng]} icon={DefaultIcon}>
                                    <Popup>You are here</Popup>
                                </Marker>
                                {nearbyStations.map(station => (
                                    <Marker key={station.id} position={[station.lat, station.lng]} icon={StationIcon}>
                                        <Popup>{station.name}</Popup>
                                    </Marker>
                                ))}
                            </MapContainer>
                            <div className="absolute inset-0 pointer-events-none border-[12px] border-[#0d1421] dark:border-[#0d1421] rounded-3xl z-[1000]"></div>
                        </div>

                        {/* Stations List Fragment */}
                        <div className="flex flex-col gap-3 justify-center py-4">
                            {nearbyStations.slice(0, 3).map((station, i) => (
                                <motion.div
                                    key={station.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 + (i * 0.1) }}
                                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between group ${i === 0
                                        ? 'bg-[#00D2FF]/5 border-[#00D2FF]/30 shadow-[0_0_15px_rgba(0,210,255,0.1)]'
                                        : 'bg-white/5 border-white/5 hover:border-white/10'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-[#00D2FF] animate-pulse shadow-[0_0_8px_#00D2FF]' : 'bg-white/20'}`}></div>
                                        <div>
                                            <div className={`text-sm font-bold ${i === 0 ? 'text-white' : 'text-white/70'}`}>{station.name}</div>
                                            <div className="text-[10px] text-white/30 font-bold uppercase tracking-widest leading-none mt-1">
                                                {i === 0 ? "⚡ Only 2 min away" : `${station.dist.toFixed(1)} km distal`}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`text-[10px] font-black ${i === 0 ? 'text-[#00D2FF]' : 'text-white/20'}`}>
                                        {station.dist.toFixed(1)} km
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Account / Wallet Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`lg:col-span-4 ${cardStyles} flex flex-col gap-8 border-none !bg-gradient-to-br from-[#0d1421] to-[#03070E] shadow-2xl`}
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#00D2FF]/10 blur-[60px] rounded-full pointer-events-none"></div>

                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <Wallet className="w-5 h-5 text-[#00D2FF]" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Wallet Balance</span>
                        </div>
                        <div className="text-6xl font-black text-white tracking-tighter mb-2">${walletBalance.toFixed(2)}</div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#00D2FF]/60 animate-pulse">Available for kinetic swap</p>
                    </div>

                    <div className="flex flex-col gap-3 mt-auto">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleTopUp}
                            className="w-full bg-[#00D2FF] text-[#03070E] py-5 rounded-[20px] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(0,210,255,0.3)] hover:shadow-[0_15px_40px_rgba(0,210,255,0.5)] transition-all cursor-pointer"
                        >
                            <PlusIcon className="w-4 h-4" /> Top Up Funds
                        </motion.button>
                        <button
                            onClick={() => navigate('/wallet')}
                            className="w-full bg-white/5 border border-white/10 hover:bg-white/10 py-4 px-6 rounded-[20px] flex items-center justify-between transition-all group cursor-pointer"
                        >
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-60 group-hover:opacity-100">Transaction History</span>
                            <ChevronRight className="w-4 h-4 opacity-20 group-hover:translate-x-1 transition-all" />
                        </button>
                    </div>
                </motion.div>

                {/* STATS SECTION (NEW) */}
                <div className="lg:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                        { label: "Total Rentals", val: rentalHistory.length, icon: Zap, color: "#00D2FF", sub: "Lifetime sessions" },
                        { label: "Total Spent", val: `$${totalSpent.toFixed(2)}`, icon: DollarSign, color: "#A855F7", sub: "Payment total" },
                        { label: "Saved CO2", val: "14.2 kg", icon: Leaf, color: "#22C55E", sub: "Green contribution" },
                        { label: "Total Time", val: "48h 20m", icon: Clock, color: "#F59E0B", sub: "Active charging" },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 + i * 0.05 }}
                            className={`${cardStyles} !p-6 flex flex-col gap-4 group hover:scale-[1.02] cursor-default`}
                        >
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${stat.color}15`, border: `1px solid ${stat.color}30` }}>
                                <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                            </div>
                            <div>
                                <div className="text-2xl font-black text-slate-900 dark:text-white leading-none mb-1">{stat.val}</div>
                                <div className="text-[9px] font-black uppercase tracking-widest opacity-40">{stat.label}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* QUICK ACTION GRID */}
                <div className="lg:col-span-12 grid grid-cols-3 md:grid-cols-6 gap-6 mt-4">
                    {[
                        { label: "Find Kiosks", sub: "Nearby grid", icon: MapPin, col: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10", route: "/map" },
                        { label: "Scan QR", sub: "Instant boot", icon: QrCode, col: "text-green-500", bg: "bg-green-50 dark:bg-green-500/10", route: "/rent" },
                        { label: "My Rentals", sub: "Active stream", icon: Zap, col: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-500/10", route: "/profile" },
                        { label: "Support", sub: "24/7 Intel", icon: HeadphonesIcon, col: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-500/10", route: "/help" },
                        { label: "Offers", sub: "Elite node", icon: Tag, col: "text-red-500", bg: "bg-red-50 dark:bg-red-500/10", act: "Offers" },
                        { label: "Refer & Earn", sub: "Expand mesh", icon: Gift, col: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-500/10", act: "Refer" }
                    ].map((item, i) => (
                        <motion.button
                            key={i}
                            whileHover={{ y: -5, scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => item.route ? navigate(item.route) : handleAction(item.act!)}
                            className={`${cardStyles} !p-6 flex flex-col items-center justify-center text-center cursor-pointer group hover:bg-[#00D2FF]/5 hover:border-[#00D2FF]/30 active:bg-[#00D2FF]/10`}
                        >
                            <div className={`w-14 h-14 rounded-full ${item.bg} flex items-center justify-center mb-4 group-hover:shadow-[0_0_20px_rgba(0,210,255,0.2)] transition-all`}>
                                <item.icon className={`w-6 h-6 ${item.col}`} />
                            </div>
                            <div className="text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-white mb-0.5">{item.label}</div>
                            <div className="text-[9px] font-bold opacity-30">{item.sub}</div>
                        </motion.button>
                    ))}
                </div>

                {/* SECONDARY ROW: Recent Tx & Membership */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className={`lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-8`}
                >
                    {/* Recent Transactions List */}
                    <div className={cardStyles}>
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-xl font-black uppercase tracking-tight">Recent Transfers</h2>
                            <button onClick={() => navigate('/wallet')} className="text-[10px] font-black uppercase tracking-widest text-[#00D2FF] hover:underline">View Ledger</button>
                        </div>
                        <div className="space-y-4">
                            {transactions.slice(0, 3).map(tx => (
                                <div key={tx.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.type === 'topup' ? 'bg-green-500/10 text-green-500' : 'bg-[#00D2FF]/10 text-[#00D2FF]'}`}>
                                            {tx.type === 'topup' ? <ArrowRight className="w-4 h-4 -rotate-45" /> : <Zap className="w-4 h-4" />}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold">{tx.title}</div>
                                            <div className="text-[10px] opacity-40">{tx.date}</div>
                                        </div>
                                    </div>
                                    <div className={`font-black text-sm ${tx.amount > 0 ? 'text-green-500' : 'text-slate-900 dark:text-white'}`}>
                                        {tx.amount > 0 ? `+$${tx.amount.toFixed(2)}` : `-$${Math.abs(tx.amount).toFixed(2)}`}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Upsell / Explore Plans Card */}
                    <div className={`${cardStyles} bg-gradient-to-br from-[#A855F7]/10 to-transparent border-[#A855F7]/20 flex flex-col justify-between`}>
                        <div>
                            <div className="w-12 h-12 rounded-2xl bg-[#A855F7]/20 flex items-center justify-center mb-6">
                                <Crown className="w-6 h-6 text-[#A855F7]" />
                            </div>
                            <h2 className="text-2xl font-black uppercase tracking-tight mb-3">Upgrade to Elite Node</h2>
                            <p className="text-sm opacity-60 leading-relaxed mb-8">Get unlimited Kinetic sessions, zero deposit swaps, and high-precision technical support at all metropolitan hubs.</p>
                        </div>
                        <button
                            onClick={() => navigate('/rent')}
                            className="w-full bg-[#A855F7] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-[0_10px_20px_#A855F740] hover:scale-[1.02] transition-all"
                        >
                            Explore Plans
                        </button>
                    </div>
                </motion.div>

            </div>

        </div>
    );
};

const PlusIcon = ({ className }: { className?: string }) => (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
);

const MapPinEl = () => (
    <div className="w-10 h-12 bg-white dark:bg-[#0a0e17] rounded-full rounded-br-none rotate-45 border-4 border-[#00D2FF] flex items-center justify-center relative shadow-[0_0_20px_rgba(0,210,255,0.4)] transition-all">
        <Zap className="w-5 h-5 text-[#00D2FF] -rotate-45" fill="currentColor" />
    </div>
);

export default Dashboard;
