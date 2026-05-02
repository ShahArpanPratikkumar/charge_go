import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, QrCode, SlidersHorizontal, Clock, Navigation,
    X, ExternalLink, ArrowRight, LocateFixed, Phone, Star,
    ShieldCheck, Zap, Radio, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, useMap, Polyline, Circle, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// ─────────────────────────────────────────────────────────────────────────────
//  CONSTANTS & TYPES
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_COORDS: [number, number] = [23.0802508, 72.5910108];
const NEARBY_RADIUS_KM = 2;

interface Station {
    id: string;
    name: string;
    lat: number;
    lng: number;
    available: number;
    total: number;
    rating: number;
    type: 'Fast' | 'Eco' | 'Super';
    address: string;
    price: string;
}

// Full station dataset — in production replace with API call
const ALL_STATIONS: Station[] = [
    { id: '1', name: 'Nexus Hub Alpha', lat: 23.0820, lng: 72.5920, available: 12, total: 15, rating: 4.8, type: 'Super', address: 'Sabarmati, Ahmedabad', price: '₹0.05/min' },
    { id: '2', name: 'Quantum Point', lat: 23.0810, lng: 72.5930, available: 8, total: 10, rating: 4.6, type: 'Fast', address: 'Near Railway Station', price: '₹0.04/min' },
    { id: '3', name: 'Cyber Kiosk Delta', lat: 23.0790, lng: 72.5900, available: 5, total: 8, rating: 4.9, type: 'Eco', address: 'Panchshil Hospital Rd', price: '₹0.03/min' },
    { id: '4', name: 'Matrix Station 9', lat: 23.0840, lng: 72.5905, available: 0, total: 6, rating: 4.2, type: 'Eco', address: 'Ramnagar Chowk', price: '₹0.03/min' },
    { id: '5', name: 'Pulse Node Primary', lat: 23.0785, lng: 72.5915, available: 15, total: 15, rating: 4.7, type: 'Super', address: 'Vardasa ni Chali', price: '₹0.05/min' },
    { id: '6', name: 'GridPoint Omega', lat: 23.0855, lng: 72.5885, available: 3, total: 10, rating: 4.3, type: 'Fast', address: 'Bulkhidas Road', price: '₹0.04/min' },
    { id: '7', name: 'Sigma Terminal', lat: 23.0770, lng: 72.5940, available: 9, total: 12, rating: 4.5, type: 'Fast', address: 'SH41 Highway', price: '₹0.04/min' },
];

// ─────────────────────────────────────────────────────────────────────────────
//  UTILITY
// ─────────────────────────────────────────────────────────────────────────────

const haversineKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const typeColor: Record<Station['type'], string> = {
    Super: '#00D2FF',
    Fast: '#A855F7',
    Eco: '#22C55E',
};

// ─────────────────────────────────────────────────────────────────────────────
//  LEAFLET ICONS
// ─────────────────────────────────────────────────────────────────────────────

const buildUserIcon = () => L.divIcon({
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
    html: `
      <div style="width:40px;height:40px;position:relative;display:flex;align-items:center;justify-content:center">
        <div style="
          position:absolute;width:48px;height:48px;
          border-radius:50%;
          background:rgba(0,210,255,0.18);
          animation:cgPulse1 2s ease-out infinite;
        "></div>
        <div style="
          position:absolute;width:36px;height:36px;
          border-radius:50%;
          background:rgba(0,210,255,0.25);
          animation:cgPulse2 2s ease-out infinite 0.5s;
        "></div>
        <div style="
          width:18px;height:18px;
          border-radius:50%;
          background:#00D2FF;
          border:3px solid #fff;
          box-shadow:0 0 0 3px rgba(0,210,255,0.4),0 0 20px #00D2FF,0 0 40px rgba(0,210,255,0.4);
          position:relative;z-index:2;
        "></div>
      </div>
    `,
});

const buildStationIcon = (type: Station['type'], available: number) => {
    const color = typeColor[type];
    const isOffline = available === 0;
    return L.divIcon({
        className: '',
        iconSize: [44, 44],
        iconAnchor: [22, 22],
        popupAnchor: [0, -22],
        html: `
          <div class="cg-station-icon" style="
            width:44px;height:44px;position:relative;
            display:flex;align-items:center;justify-content:center;
            cursor:pointer;transition:transform 0.2s;
          ">
            <div style="
              position:absolute;inset:0;border-radius:14px;
              background:rgba(3,7,14,0.85);
              border:2px solid ${isOffline ? 'rgba(255,255,255,0.1)' : color};
              box-shadow:${isOffline ? 'none' : `0 0 16px ${color}60,0 0 4px ${color}40`};
              backdrop-filter:blur(8px);
            "></div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="${isOffline ? 'rgba(255,255,255,0.2)' : color}"
              stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
              style="position:relative;z-index:1;filter:${isOffline ? 'none' : `drop-shadow(0 0 4px ${color})`}">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
            ${!isOffline ? `<div style="
              position:absolute;top:-4px;right:-4px;
              width:14px;height:14px;border-radius:50%;
              background:#22C55E;border:2px solid #0d1421;
              font-size:8px;color:#fff;display:flex;
              align-items:center;justify-content:center;
              font-weight:900;box-shadow:0 0 8px #22C55E;
            ">${available > 9 ? '9+' : available}</div>` : ''}
          </div>
        `,
    });
};

// ─────────────────────────────────────────────────────────────────────────────
//  SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

/** Smoothly flies the map to the given coords */
const FlyTo = ({ coords, zoom = 15 }: { coords: [number, number]; zoom?: number }) => {
    const map = useMap();
    useEffect(() => {
        map.flyTo(coords, zoom, { animate: true, duration: 1.4, easeLinearity: 0.25 });
    }, [coords[0], coords[1], zoom]);
    return null;
};

/** Exposes the map instance via ref */
const MapRefCapture = ({ mapRef }: { mapRef: React.MutableRefObject<L.Map | null> }) => {
    const map = useMapEvents({});
    useEffect(() => { mapRef.current = map; }, [map]);
    return null;
};

// ─────────────────────────────────────────────────────────────────────────────
//  ROUTE FETCHER  (OSRM — free, public, no API key needed)
// ─────────────────────────────────────────────────────────────────────────────

const fetchOSRMRoute = async (
    from: [number, number],
    to: [number, number]
): Promise<[number, number][]> => {
    const url =
        `https://router.project-osrm.org/route/v1/driving/` +
        `${from[1]},${from[0]};${to[1]},${to[0]}?overview=full&geometries=geojson`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('OSRM request failed');
    const data = await res.json();
    const coords: [number, number][] = data.routes[0].geometry.coordinates
        .map(([lng, lat]: [number, number]) => [lat, lng]);
    return coords;
};

// ─────────────────────────────────────────────────────────────────────────────
//  MAIN MAP COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const Map = () => {
    const navigate = useNavigate();
    const mapRef = useRef<L.Map | null>(null);
    const watchId = useRef<number | null>(null);

    // ── State ─────────────────────────────────────────────────────────────────
    const [userCoords, setUserCoords] = useState<[number, number]>(DEFAULT_COORDS);
    const [accuracy, setAccuracy] = useState(200);
    const [flyTarget, setFlyTarget] = useState<[number, number] | null>(null);
    const [hasGPS, setHasGPS] = useState(false);
    const [isLocating, setIsLocating] = useState(true);
    const [gpsError, setGpsError] = useState<string | null>(null);

    const [nearbyStations, setNearbyStations] = useState<(Station & { distKm: number })[]>([]);
    const [selected, setSelected] = useState<(Station & { distKm: number }) | null>(null);

    const [route, setRoute] = useState<[number, number][] | null>(null);
    const [routeLoading, setRouteLoading] = useState(false);
    const [routeInfo, setRouteInfo] = useState<{ distKm: string; etaMin: string } | null>(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [searchFocused, setSearchFocused] = useState(false);
    const [showRadiusRing, setShowRadiusRing] = useState(true);

    // ── Compute nearby stations whenever user moves ───────────────────────────
    const updateNearby = useCallback((coords: [number, number]) => {
        const nearby = ALL_STATIONS
            .map(s => ({ ...s, distKm: haversineKm(coords[0], coords[1], s.lat, s.lng) }))
            .filter(s => s.distKm <= NEARBY_RADIUS_KM)
            .sort((a, b) => a.distKm - b.distKm);
        setNearbyStations(nearby);

        // Refresh selected station distance if still open
        setSelected(prev => {
            if (!prev) return null;
            const refresh = nearby.find(s => s.id === prev.id);
            return refresh ?? null;
        });
    }, []);

    // ── GPS: auto-start on mount ──────────────────────────────────────────────
    useEffect(() => {
        if (!('geolocation' in navigator)) {
            setGpsError('Geolocation not supported by this browser.');
            setIsLocating(false);
            updateNearby(DEFAULT_COORDS);
            return;
        }

        const opts: PositionOptions = {
            enableHighAccuracy: true,
            timeout: 12_000,
            maximumAge: 4_000,
        };

        let firstFix = true;

        const onSuccess = (pos: GeolocationPosition) => {
            const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
            setUserCoords(coords);
            setAccuracy(pos.coords.accuracy);
            setHasGPS(true);
            setIsLocating(false);
            setGpsError(null);
            updateNearby(coords);
            if (firstFix) {
                firstFix = false;
                setFlyTarget(coords); // fly to user on first fix
            }
        };

        const onError = (err: GeolocationPositionError) => {
            setIsLocating(false);
            setHasGPS(false);
            updateNearby(DEFAULT_COORDS);
            const msgs: Record<number, string> = {
                [err.PERMISSION_DENIED]: '📍 Location blocked. Enable it in browser settings.',
                [err.POSITION_UNAVAILABLE]: '📡 Location unavailable. Showing default area.',
                [err.TIMEOUT]: '⏱️ GPS timed out. Using default location.',
            };
            setGpsError(msgs[err.code] || 'Location error.');
        };

        navigator.geolocation.getCurrentPosition(onSuccess, onError, opts);
        watchId.current = navigator.geolocation.watchPosition(onSuccess, onError, opts);

        return () => {
            if (watchId.current !== null) {
                navigator.geolocation.clearWatch(watchId.current);
            }
        };
    }, [updateNearby]);

    // ── Manual recentre ───────────────────────────────────────────────────────
    const handleRecentre = () => {
        if (!hasGPS) {
            setIsLocating(true);
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const c: [number, number] = [pos.coords.latitude, pos.coords.longitude];
                    setUserCoords(c);
                    setAccuracy(pos.coords.accuracy);
                    setHasGPS(true);
                    setIsLocating(false);
                    setGpsError(null);
                    setFlyTarget(c);
                    updateNearby(c);
                },
                () => { setIsLocating(false); },
                { enableHighAccuracy: true, timeout: 10_000 }
            );
        } else {
            setFlyTarget([...userCoords]);
        }
    };

    // ── Route: fetch from OSRM ────────────────────────────────────────────────
    const handleGetDirections = async (station: Station) => {
        setRouteLoading(true);
        setRoute(null);
        setRouteInfo(null);
        try {
            const path = await fetchOSRMRoute(userCoords, [station.lat, station.lng]);
            setRoute(path);
            const distKm = haversineKm(userCoords[0], userCoords[1], station.lat, station.lng);
            const etaMin = Math.ceil((distKm / 20) * 60); // ~20 km/h city speed
            setRouteInfo({ distKm: distKm.toFixed(1), etaMin: String(etaMin) });
            setFlyTarget([station.lat, station.lng]);
        } catch {
            // Fallback straight-line route
            const mid1: [number, number] = [
                userCoords[0] + (station.lat - userCoords[0]) * 0.35,
                userCoords[1] + (station.lng - userCoords[1]) * 0.2,
            ];
            const mid2: [number, number] = [
                userCoords[0] + (station.lat - userCoords[0]) * 0.7,
                userCoords[1] + (station.lng - userCoords[1]) * 0.85,
            ];
            setRoute([userCoords, mid1, mid2, [station.lat, station.lng]]);
        } finally {
            setRouteLoading(false);
        }
    };

    const handleOpenGoogleMaps = (station: Station) => {
        const url = `https://www.google.com/maps/dir/?api=1&origin=${userCoords[0]},${userCoords[1]}&destination=${station.lat},${station.lng}&travelmode=walking`;
        window.open(url, '_blank');
    };

    // ── Filtered stations for search bar ─────────────────────────────────────
    const searchResults = nearbyStations.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // ─────────────────────────────────────────────────────────────────────────
    //  ANIMATION KEYFRAMES injected once
    // ─────────────────────────────────────────────────────────────────────────
    useEffect(() => {
        const id = 'cg-map-keyframes';
        if (document.getElementById(id)) return;
        const style = document.createElement('style');
        style.id = id;
        style.textContent = `
          @keyframes cgPulse1 {
            0%   { transform: scale(0.8); opacity: 0.8; }
            70%  { transform: scale(1.8); opacity: 0; }
            100% { transform: scale(0.8); opacity: 0; }
          }
          @keyframes cgPulse2 {
            0%   { transform: scale(0.8); opacity: 0.6; }
            70%  { transform: scale(1.5); opacity: 0; }
            100% { transform: scale(0.8); opacity: 0; }
          }
          .leaflet-popup-content-wrapper {
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
          }
          .leaflet-popup-tip-container { display: none !important; }
          .leaflet-popup-content { margin: 0 !important; }
          .cg-station-icon:hover > div:first-child {
            transform: scale(1.1);
            filter: brightness(1.2);
          }
        `;
        document.head.appendChild(style);
    }, []);

    // ─────────────────────────────────────────────────────────────────────────
    //  RENDER
    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div className="map-section w-full relative overflow-hidden" style={{ background: '#020B18' }}>

            {/* ── Leaflet Map ────────────────────────────────────────────── */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                <MapContainer
                    center={DEFAULT_COORDS}
                    zoom={15}
                    zoomControl={false}
                    style={{ height: '100%', width: '100%' }}
                    attributionControl={false}
                >
                    <MapRefCapture mapRef={mapRef} />
                    {flyTarget && <FlyTo coords={flyTarget} zoom={16} />}

                    {/* Dark tile layer */}
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                        maxZoom={19}
                    />

                    {/* GPS accuracy ring */}
                    {showRadiusRing && (
                        <Circle
                            center={userCoords}
                            radius={accuracy}
                            pathOptions={{
                                color: '#00D2FF', fillColor: '#00D2FF',
                                fillOpacity: 0.06, weight: 1, opacity: 0.3, dashArray: '4 8',
                            }}
                        />
                    )}

                    {/* 2 km search radius indicator */}
                    <Circle
                        center={userCoords}
                        radius={NEARBY_RADIUS_KM * 1000}
                        pathOptions={{
                            color: '#00D2FF', fillColor: '#00D2FF',
                            fillOpacity: 0.03, weight: 1, opacity: 0.15, dashArray: '2 10',
                        }}
                    />

                    {/* User location marker */}
                    <Marker position={userCoords} icon={buildUserIcon()} zIndexOffset={1000}>
                        <Popup closeButton={false} autoPan={false}>
                            <div style={{
                                background: 'rgba(2,11,24,0.95)',
                                border: '1px solid rgba(0,210,255,0.4)',
                                borderRadius: '12px', padding: '8px 14px',
                                color: '#00D2FF', fontWeight: 900, fontSize: '11px',
                                letterSpacing: '0.1em', textTransform: 'uppercase',
                                whiteSpace: 'nowrap', boxShadow: '0 0 20px rgba(0,210,255,0.2)',
                            }}>
                                📍 You are here {hasGPS ? '· LIVE' : '· DEFAULT'}
                            </div>
                        </Popup>
                    </Marker>

                    {/* Station markers */}
                    {nearbyStations.map(station => (
                        <Marker
                            key={station.id}
                            position={[station.lat, station.lng]}
                            icon={buildStationIcon(station.type, station.available)}
                            zIndexOffset={selected?.id === station.id ? 900 : 500}
                            eventHandlers={{
                                click: () => {
                                    setSelected(station);
                                    setRoute(null);
                                    setRouteInfo(null);
                                    setFlyTarget([station.lat, station.lng]);
                                },
                            }}
                        >
                            <Popup closeButton={false} autoPan={false}>
                                <div style={{
                                    background: 'rgba(2,11,24,0.95)',
                                    border: `1px solid ${typeColor[station.type]}40`,
                                    borderRadius: '14px', padding: '12px 16px',
                                    color: '#fff', fontSize: '12px', fontWeight: 700,
                                    boxShadow: `0 0 20px ${typeColor[station.type]}20`,
                                    minWidth: '160px',
                                }}>
                                    <div style={{ color: typeColor[station.type], fontWeight: 900, fontSize: '13px', marginBottom: 4 }}>
                                        {station.name}
                                    </div>
                                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px' }}>
                                        {station.distKm.toFixed(2)} km · {station.available}/{station.total} units
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    ))}

                    {/* Route polyline */}
                    {route && (
                        <>
                            {/* Shadow/glow line */}
                            <Polyline
                                positions={route}
                                pathOptions={{ color: '#00D2FF', weight: 12, opacity: 0.15, lineJoin: 'round', lineCap: 'round' }}
                            />
                            {/* Main route line */}
                            <Polyline
                                positions={route}
                                pathOptions={{ color: '#00D2FF', weight: 4, opacity: 0.9, lineJoin: 'round', lineCap: 'round', dashArray: '1 10' }}
                            />
                        </>
                    )}
                </MapContainer>
            </div>

            {/* ── Locating Spinner Overlay ───────────────────────────────── */}
            <AnimatePresence>
                {isLocating && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute top-24 left-1/2 -translate-x-1/2 z-50"
                    >
                        <div className="flex items-center gap-3 bg-[#020B18]/90 border border-[#00D2FF]/30 backdrop-blur-xl px-5 py-3 rounded-2xl shadow-[0_0_30px_rgba(0,210,255,0.2)]">
                            <div className="w-4 h-4 border-2 border-[#00D2FF] border-t-transparent rounded-full animate-spin" />
                            <span className="text-[#00D2FF] text-xs font-black uppercase tracking-widest">Acquiring GPS…</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── GPS Error Banner ───────────────────────────────────────── */}
            <AnimatePresence>
                {gpsError && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                        className="absolute top-24 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
                    >
                        <div className="flex items-center gap-3 bg-orange-500/15 border border-orange-500/40 backdrop-blur-xl px-4 py-3 rounded-2xl">
                            <ShieldCheck className="w-4 h-4 text-orange-400 flex-shrink-0" />
                            <p className="text-orange-200 text-xs font-medium">{gpsError}</p>
                            <button onClick={() => setGpsError(null)} className="ml-auto">
                                <X className="w-4 h-4 text-orange-400/50 hover:text-orange-300" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Search Bar ────────────────────────────────────────────── */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-xl px-4 pointer-events-none">
                <div className="bg-[#020B18]/90 backdrop-blur-2xl border border-white/10 p-2 rounded-2xl flex items-center gap-3 shadow-[0_8px_40px_rgba(0,0,0,0.6)] relative pointer-events-auto">
                    <div className="bg-[#00D2FF]/10 p-3 rounded-xl flex-shrink-0">
                        <Search className="w-4 h-4 text-[#00D2FF]" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search nearby stations…"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setTimeout(() => setSearchFocused(false), 180)}
                        onKeyDown={e => {
                            if (e.key === 'Enter' && searchResults.length > 0) {
                                setSelected(searchResults[0]);
                                setFlyTarget([searchResults[0].lat, searchResults[0].lng]);
                                setSearchQuery('');
                                setSearchFocused(false);
                            }
                        }}
                        className="bg-transparent border-none outline-none text-white text-sm flex-1 font-medium placeholder:text-white/20 min-w-0"
                    />

                    {/* Live GPS badge */}
                    {hasGPS && (
                        <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-xl flex-shrink-0">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                            <span className="text-green-400 text-[10px] font-black uppercase tracking-widest">Live</span>
                        </div>
                    )}

                    <button className="bg-[#00D2FF] p-3 rounded-xl shadow-[0_0_15px_#00D2FF50] hover:scale-105 active:scale-95 transition-all cursor-pointer flex-shrink-0">
                        <SlidersHorizontal className="w-4 h-4 text-[#03070E]" />
                    </button>

                    {/* Search dropdown */}
                    <AnimatePresence>
                        {searchFocused && searchQuery.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                                className="absolute top-full left-0 right-0 mt-3 bg-[#020B18]/98 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)] z-50"
                            >
                                {searchResults.length > 0 ? searchResults.map(s => (
                                    <button
                                        key={s.id}
                                        onMouseDown={() => {
                                            setSelected(s);
                                            setFlyTarget([s.lat, s.lng]);
                                            setSearchQuery('');
                                        }}
                                        className="w-full text-left px-5 py-4 hover:bg-white/5 flex items-center justify-between group transition-colors border-b border-white/5 last:border-0"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                                                style={{ background: `${typeColor[s.type]}15`, border: `1px solid ${typeColor[s.type]}30` }}
                                            >
                                                <Zap className="w-4 h-4" style={{ color: typeColor[s.type] }} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-black text-white group-hover:text-[#00D2FF] transition-colors">{s.name}</div>
                                                <div className="text-[10px] text-white/30 font-bold uppercase tracking-wider">{s.type} · {s.distKm.toFixed(1)} km</div>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-[#00D2FF] group-hover:translate-x-1 transition-all" />
                                    </button>
                                )) : (
                                    <div className="px-5 py-8 text-center text-white/20 text-xs font-bold uppercase tracking-widest">
                                        No stations found within {NEARBY_RADIUS_KM}km
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* ── Right-side Controls ────────────────────────────────────── */}
            <div className="absolute top-28 right-4 sm:right-6 z-30 flex flex-col gap-3">
                {/* Recentre / GPS button */}
                <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={handleRecentre}
                    className={`w-12 h-12 sm:w-14 sm:h-14 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col items-center justify-center shadow-xl cursor-pointer transition-all ${hasGPS
                        ? 'bg-[#00D2FF] text-[#03070E] shadow-[0_0_20px_rgba(0,210,255,0.4)]'
                        : 'bg-[#020B18]/90 text-white/40 hover:text-white/80'
                        }`}
                >
                    <LocateFixed className={`w-5 h-5 ${isLocating ? 'animate-spin' : ''}`} />
                    <span className="text-[7px] font-black uppercase mt-0.5">
                        {isLocating ? 'SCAN' : hasGPS ? 'LIVE' : 'GPS'}
                    </span>
                </motion.button>

                {/* Radius ring toggle */}
                <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => setShowRadiusRing(v => !v)}
                    className={`w-12 h-12 sm:w-14 sm:h-14 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col items-center justify-center shadow-xl cursor-pointer transition-all ${showRadiusRing
                        ? 'bg-white/10 text-white/80'
                        : 'bg-[#020B18]/90 text-white/30'
                        }`}
                >
                    <Radio className="w-5 h-5" />
                    <span className="text-[7px] font-black uppercase mt-0.5">RANGE</span>
                </motion.button>

                {/* QR / Rent button */}
                <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => navigate('/rent')}
                    className="w-12 h-12 sm:w-14 sm:h-14 bg-[#020B18]/90 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col items-center justify-center hover:bg-white/10 transition-all shadow-xl cursor-pointer group"
                >
                    <QrCode className="w-5 h-5 text-white/40 group-hover:text-[#00D2FF] transition-colors" />
                    <span className="text-[7px] font-black uppercase mt-0.5 text-white/30 group-hover:text-white/60">RENT</span>
                </motion.button>
            </div>

            {/* ── Nearby count chip ─────────────────────────────────────── */}
            <div className="absolute bottom-6 right-4 sm:right-6 z-30">
                <div className="bg-[#020B18]/90 border border-white/10 backdrop-blur-xl px-4 py-2 rounded-2xl flex items-center gap-2 shadow-xl">
                    <div className="w-2 h-2 rounded-full bg-[#00D2FF] animate-pulse" />
                    <span className="text-white/60 text-xs font-black uppercase tracking-widest">
                        {nearbyStations.length} stations · {NEARBY_RADIUS_KM}km
                    </span>
                </div>
            </div>

            {/* ── Station Detail Panel ───────────────────────────────────── */}
            <AnimatePresence>
                {selected && (
                    <motion.div
                        key={selected.id}
                        initial={{ opacity: 0, y: 80, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 80, scale: 0.96 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="absolute bottom-6 left-4 sm:left-6 z-30 w-full max-w-[360px] overflow-hidden"
                    >
                        <div className="bg-[#020B18]/95 backdrop-blur-2xl border border-white/10 rounded-[28px] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.8)]">
                            {/* Ambient glow */}
                            <div
                                className="absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl opacity-30"
                                style={{ background: typeColor[selected.type] }}
                            />

                            <div className="relative z-10">
                                {/* Header */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1 min-w-0 pr-3">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div
                                                className="px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border"
                                                style={{ color: typeColor[selected.type], borderColor: `${typeColor[selected.type]}30`, background: `${typeColor[selected.type]}10` }}
                                            >
                                                {selected.type} Node
                                            </div>
                                            <div className="flex items-center gap-1 text-yellow-400 text-[10px] font-black">
                                                <Star className="w-3 h-3 fill-current" />
                                                {selected.rating}
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-black text-white truncate">{selected.name}</h3>
                                        <p className="text-white/30 text-xs font-medium mt-0.5 truncate">{selected.address}</p>
                                    </div>
                                    <button
                                        onClick={() => { setSelected(null); setRoute(null); setRouteInfo(null); }}
                                        className="p-2 hover:bg-white/10 rounded-xl transition-colors flex-shrink-0"
                                    >
                                        <X className="w-4 h-4 text-white/30" />
                                    </button>
                                </div>

                                {/* Stats row */}
                                <div className="grid grid-cols-3 gap-2 mb-4">
                                    <div className="bg-white/[0.04] border border-white/5 rounded-2xl p-3 text-center">
                                        <div className="text-[9px] font-black uppercase tracking-wider text-white/30 mb-1">Distance</div>
                                        <div className="text-white font-black text-base">{selected.distKm.toFixed(1)}<span className="text-[10px] text-white/40 ml-0.5">km</span></div>
                                    </div>
                                    <div className="bg-white/[0.04] border border-white/5 rounded-2xl p-3 text-center">
                                        <div className="text-[9px] font-black uppercase tracking-wider text-white/30 mb-1">Units</div>
                                        <div className={`font-black text-base ${selected.available === 0 ? 'text-red-400' : 'text-green-400'}`}>
                                            {selected.available}<span className="text-[10px] text-white/40 ml-0.5">/{selected.total}</span>
                                        </div>
                                    </div>
                                    <div className="bg-white/[0.04] border border-white/5 rounded-2xl p-3 text-center">
                                        <div className="text-[9px] font-black uppercase tracking-wider text-white/30 mb-1">Rate</div>
                                        <div className="text-white font-black text-[11px]">{selected.price}</div>
                                    </div>
                                </div>

                                {/* Route info bar */}
                                <AnimatePresence>
                                    {routeInfo && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="bg-green-500/10 border border-green-500/20 rounded-2xl p-3 mb-3 flex items-center gap-3"
                                        >
                                            <Clock className="w-4 h-4 text-green-400 flex-shrink-0" />
                                            <div>
                                                <div className="text-green-400 font-black text-sm">~{routeInfo.etaMin} min ETA</div>
                                                <div className="text-white/30 text-[10px]">{routeInfo.distKm} km via road</div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Action buttons */}
                                <div className="flex flex-col gap-2">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleGetDirections(selected)}
                                        disabled={routeLoading || selected.available === 0}
                                        className="w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                        style={{
                                            background: selected.available === 0 ? 'rgba(255,255,255,0.05)' : '#00D2FF',
                                            color: selected.available === 0 ? 'rgba(255,255,255,0.3)' : '#020B18',
                                            boxShadow: selected.available > 0 ? '0 8px 30px rgba(0,210,255,0.3)' : 'none',
                                        }}
                                    >
                                        <Navigation className={`w-4 h-4 ${routeLoading ? 'animate-spin' : ''}`} />
                                        {routeLoading ? 'Calculating…' : selected.available === 0 ? 'Station Offline' : 'Get Directions'}
                                    </motion.button>

                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => handleOpenGoogleMaps(selected)}
                                            className="bg-white/5 border border-white/10 hover:bg-white/10 py-3 rounded-2xl flex items-center justify-center gap-2 transition-all"
                                        >
                                            <ExternalLink className="w-4 h-4 text-white/40" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-white/50">G-Maps</span>
                                        </button>
                                        <button
                                            onClick={() => navigate('/rent')}
                                            className="bg-white/5 border border-white/10 hover:bg-[#00D2FF]/10 hover:border-[#00D2FF]/20 py-3 rounded-2xl flex items-center justify-center gap-2 transition-all group"
                                        >
                                            <Zap className="w-4 h-4 text-white/40 group-hover:text-[#00D2FF] transition-colors" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-white/50 group-hover:text-[#00D2FF] transition-colors">Rent Now</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Offline warning */}
                                {selected.available === 0 && (
                                    <div className="mt-3 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2 text-center">
                                        <p className="text-red-400 text-xs font-bold">All units currently rented — check back soon</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Map;
