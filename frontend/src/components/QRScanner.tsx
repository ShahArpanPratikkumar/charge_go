import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { X, Camera, CameraOff, Keyboard, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
//  Types
// ─────────────────────────────────────────────────────────────────────────────
export interface QRScanResult {
    code: string;         // Raw QR content
    stationId: string;    // Extracted station / powerbank ID
    timestamp: number;
}

interface QRScannerProps {
    onScanSuccess: (result: QRScanResult) => void;
    onClose: () => void;
    title?: string;
    hint?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
//  Helper: extract a "CG-XXXX" style code from any QR string
// ─────────────────────────────────────────────────────────────────────────────
function extractStationId(raw: string): string {
    const match = raw.match(/CG[-_]?[\dA-Z]{4,8}/i);
    if (match) return match[0].toUpperCase();
    // Fallback: use the full trimmed string (max 20 chars)
    return raw.trim().slice(0, 20).toUpperCase();
}

// ─────────────────────────────────────────────────────────────────────────────
//  Component
// ─────────────────────────────────────────────────────────────────────────────
export default function QRScanner({
    onScanSuccess,
    onClose,
    title = 'Scan QR Code',
    hint = 'Align QR Code within frame to scan',
}: QRScannerProps) {
    const scannerDivId = 'qr-reader-container';
    const html5QrRef = useRef<Html5Qrcode | null>(null);
    const isStartedRef = useRef(false);

    const [phase, setPhase] = useState<'loading' | 'scanning' | 'success' | 'error' | 'manual'>('loading');
    const [permissionDenied, setPermissionDenied] = useState(false);
    const [successData, setSuccessData] = useState<QRScanResult | null>(null);
    const [manualCode, setManualCode] = useState('');
    const [manualError, setManualError] = useState('');

    // ── Stop scanner & release camera ────────────────────────────────────────
    const stopScanner = useCallback(async () => {
        if (html5QrRef.current && isStartedRef.current) {
            try {
                await html5QrRef.current.stop();
                html5QrRef.current.clear();
            } catch { /* already stopped */ }
            isStartedRef.current = false;
        }
    }, []);

    // ── Handle a successful scan ─────────────────────────────────────────────
    const handleSuccess = useCallback(async (decodedText: string) => {
        if (phase === 'success') return; // Prevent double-fire
        await stopScanner();

        const result: QRScanResult = {
            code: decodedText,
            stationId: extractStationId(decodedText),
            timestamp: Date.now(),
        };

        setSuccessData(result);
        setPhase('success');

        // Haptic feedback (mobile)
        if ('vibrate' in navigator) navigator.vibrate([100, 50, 100]);

        // Deliver result after success animation
        setTimeout(() => onScanSuccess(result), 1600);
    }, [phase, stopScanner, onScanSuccess]);

    // ── Start the scanner ────────────────────────────────────────────────────
    const startScanner = useCallback(async () => {
        setPhase('loading');
        setPermissionDenied(false);

        // Check camera permission first
        try {
            await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        } catch {
            setPermissionDenied(true);
            setPhase('error');
            return;
        }

        // Give the DOM a tick to mount the div
        await new Promise(r => setTimeout(r, 100));

        try {
            html5QrRef.current = new Html5Qrcode(scannerDivId, {
                formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
                verbose: false,
            });

            await html5QrRef.current.start(
                { facingMode: 'environment' },
                { fps: 12, qrbox: { width: 240, height: 240 }, aspectRatio: 1.0 },
                (decodedText) => handleSuccess(decodedText),
                () => { /* scan miss – ignore */ }
            );
            isStartedRef.current = true;
            setPhase('scanning');
        } catch (err) {
            console.error('QR Scanner error:', err);
            setPermissionDenied(true);
            setPhase('error');
        }
    }, [handleSuccess]);

    // ── Mount & unmount ────────────────────────────────────────────────────
    useEffect(() => {
        startScanner();
        return () => { stopScanner(); };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Manual code submission ────────────────────────────────────────────
    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = manualCode.trim().toUpperCase();
        if (!trimmed) { setManualError('Please enter a station code.'); return; }
        if (trimmed.length < 4) { setManualError('Code too short. Try again.'); return; }
        setManualError('');
        handleSuccess(trimmed);
    };

    const handleClose = async () => {
        await stopScanner();
        onClose();
    };

    // ─────────────────────────────────────────────────────────────────────────
    //  Render
    // ─────────────────────────────────────────────────────────────────────────
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/95 backdrop-blur-sm"
        >
            {/* Close button */}
            <button
                onClick={handleClose}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors z-10"
            >
                <X className="w-5 h-5 text-white" />
            </button>

            {/* Header */}
            <div className="absolute top-6 left-6 flex items-center gap-2">
                <div className="w-8 h-8 bg-[#00D2FF] rounded-lg flex items-center justify-center shadow-[0_0_15px_#00D2FF50]">
                    <Camera className="w-4 h-4 text-[#020B18]" />
                </div>
                <span className="text-white font-black text-sm uppercase tracking-widest">{title}</span>
            </div>

            {/* ── SCANNING STATE ── */}
            <AnimatePresence mode="wait">
                {(phase === 'loading' || phase === 'scanning') && (
                    <motion.div
                        key="scanner"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex flex-col items-center gap-8 w-full max-w-sm px-6"
                    >
                        {/* Camera view + frame */}
                        <div className="relative">
                            {/* Corner frame decorations */}
                            {['top-0 left-0', 'top-0 right-0 rotate-90', 'bottom-0 right-0 rotate-180', 'bottom-0 left-0 -rotate-90'].map((pos, i) => (
                                <div key={i} className={`absolute ${pos} w-8 h-8 z-10 pointer-events-none`}>
                                    <div className="absolute top-0 left-0 w-full h-[3px] bg-[#00D2FF] shadow-[0_0_10px_#00D2FF]" />
                                    <div className="absolute top-0 left-0 w-[3px] h-full bg-[#00D2FF] shadow-[0_0_10px_#00D2FF]" />
                                </div>
                            ))}

                            {/* Scan line animation */}
                            {phase === 'scanning' && (
                                <motion.div
                                    className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00D2FF] to-transparent z-10 shadow-[0_0_15px_#00D2FF] pointer-events-none"
                                    animate={{ top: ['5%', '95%', '5%'] }}
                                    transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                                />
                            )}

                            {/* Actual camera preview */}
                            <div
                                id={scannerDivId}
                                className="w-[300px] h-[300px] rounded-2xl overflow-hidden bg-[#0d1421]"
                            />

                            {/* Loading overlay */}
                            {phase === 'loading' && (
                                <div className="absolute inset-0 flex items-center justify-center bg-[#0d1421] rounded-2xl">
                                    <Loader2 className="w-10 h-10 text-[#00D2FF] animate-spin" />
                                </div>
                            )}
                        </div>

                        <div className="text-center">
                            <p className="text-white font-bold text-sm">{hint}</p>
                            <p className="text-white/30 text-xs mt-1">Scanner auto-detects QR codes</p>
                        </div>

                        {/* Manual fallback */}
                        <button
                            onClick={() => { stopScanner(); setPhase('manual'); }}
                            className="flex items-center gap-2 text-white/40 hover:text-[#00D2FF] text-xs font-bold uppercase tracking-widest transition-colors"
                        >
                            <Keyboard className="w-4 h-4" /> Enter Code Manually
                        </button>
                    </motion.div>
                )}

                {/* ── SUCCESS STATE ── */}
                {phase === 'success' && successData && (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center gap-6 px-6 text-center"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            className="w-24 h-24 rounded-full bg-green-500/20 border-2 border-green-400 flex items-center justify-center shadow-[0_0_40px_rgba(74,222,128,0.4)]"
                        >
                            <CheckCircle className="w-12 h-12 text-green-400" />
                        </motion.div>
                        <div>
                            <h3 className="text-2xl font-black text-white mb-2">QR Detected!</h3>
                            <div className="inline-block bg-[#00D2FF]/10 border border-[#00D2FF]/30 px-6 py-3 rounded-xl">
                                <span className="text-[#00D2FF] font-black text-xl tracking-widest">{successData.stationId}</span>
                            </div>
                            <p className="text-white/30 text-sm mt-3">Initiating rental flow...</p>
                        </div>
                        <motion.div
                            className="h-1 w-48 rounded-full bg-white/5 overflow-hidden"
                        >
                            <motion.div
                                className="h-full bg-[#00D2FF] rounded-full"
                                initial={{ width: '0%' }}
                                animate={{ width: '100%' }}
                                transition={{ duration: 1.5, ease: 'linear' }}
                            />
                        </motion.div>
                    </motion.div>
                )}

                {/* ── ERROR / PERMISSION DENIED ── */}
                {phase === 'error' && (
                    <motion.div
                        key="error"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center gap-6 px-6 text-center max-w-sm"
                    >
                        <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                            <CameraOff className="w-10 h-10 text-red-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-white mb-2">
                                {permissionDenied ? 'Camera Access Denied' : 'Scanner Error'}
                            </h3>
                            <p className="text-white/40 text-sm leading-relaxed">
                                {permissionDenied
                                    ? 'Please allow camera access in your browser settings, or use manual code entry below.'
                                    : 'Unable to start the QR scanner. Please try again or enter the code manually.'
                                }
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 w-full">
                            {!permissionDenied && (
                                <button
                                    onClick={startScanner}
                                    className="w-full bg-[#00D2FF] text-[#020B18] py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    Try Again
                                </button>
                            )}
                            <button
                                onClick={() => setPhase('manual')}
                                className="w-full bg-white/5 border border-white/10 text-white py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                            >
                                <Keyboard className="w-4 h-4" /> Enter Code Manually
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* ── MANUAL ENTRY ── */}
                {phase === 'manual' && (
                    <motion.div
                        key="manual"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center gap-6 px-6 w-full max-w-sm"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-[#00D2FF]/10 border border-[#00D2FF]/30 flex items-center justify-center">
                            <Keyboard className="w-8 h-8 text-[#00D2FF]" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-xl font-black text-white mb-2">Enter Station Code</h3>
                            <p className="text-white/40 text-sm">Type the code printed on the kiosk (e.g., CG-8821)</p>
                        </div>

                        <form onSubmit={handleManualSubmit} className="w-full space-y-4">
                            <div>
                                <input
                                    type="text"
                                    value={manualCode}
                                    onChange={e => { setManualCode(e.target.value); setManualError(''); }}
                                    placeholder="CG-8821"
                                    autoFocus
                                    className="w-full bg-white/5 border border-white/10 focus:border-[#00D2FF]/50 text-white text-center text-2xl font-black tracking-widest py-5 rounded-2xl outline-none transition-colors placeholder:text-white/20 uppercase"
                                    maxLength={12}
                                />
                                <AnimatePresence>
                                    {manualError && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="flex items-center gap-2 mt-2 text-red-400 text-xs font-bold"
                                        >
                                            <AlertCircle className="w-3 h-3" /> {manualError}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-[#00D2FF] text-[#020B18] py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-[0_8px_20px_rgba(0,210,255,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                Confirm & Unlock
                            </button>
                        </form>

                        <button
                            onClick={() => { setManualCode(''); setManualError(''); startScanner(); }}
                            className="flex items-center gap-2 text-white/40 hover:text-[#00D2FF] text-xs font-bold uppercase tracking-widest transition-colors"
                        >
                            <Camera className="w-4 h-4" /> Use Camera Instead
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
