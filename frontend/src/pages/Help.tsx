import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    HeadphonesIcon,
    Phone,
    Mail,
    ChevronDown,
    MessageCircle,
    X,
    Send,
    Zap,
    Battery,
    AlertCircle,
    User,
    Bot
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FAQS = [
    {
        q: "How do I return a powerbank to a different station?",
        a: "All ChargeGo stations are interconnected. Simply slide the powerbank into any empty slot with the LED indicator facing up. The station will recognize the unique ID and end your session automatically."
    },
    {
        q: "What happens if my phone dies before I return it?",
        a: "Don't worry. The station will recognize the powerbank's unique ID upon return. Your account will be charged only for the duration of the use, and you'll receive a confirmation email once the return is processed."
    },
    {
        q: "Are there enterprise charging solutions?",
        a: "Yes, we offer ChargeGo Hubs for offices, events, and commercial spaces. Contact our Station Partners team via the footer link or email enterprise@chargego.io for customized infrastructure deployment."
    },
    {
        q: "How secure is the kinetic charging system?",
        a: "Our powerbanks use advanced lithium-ion cells with multi-layer thermal and electrical protection. Every unit undergoes a health check upon return to the dock."
    }
];

const Help = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [openAccordion, setOpenAccordion] = useState<number | null>(null);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
        { role: 'assistant', content: 'Hello! I am your ChargeGo assistant. How can I help you power up today?' }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatMessages, isTyping]);

    const filteredFaqs = useMemo(() => {
        return FAQS.filter(faq =>
            faq.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faq.a.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    // Intelligent Domain-Specific Logic Engine
    const getExpertResponse = (userMsg: string) => {
        const lowerMsg = userMsg.toLowerCase();

        // Comprehensive Mapping of ChargeGo Domain Knowledge
        const knowledgeBase = [
            {
                keys: ['lost', 'missing', 'stolen', 'forgot', 'find'],
                reply: "Our protocols for lost units are strictly enforced for your security. Please use the 'Report Loss' button above immediately. This will freeze your billing session (Currently CG-8821) and allow our automated search mesh to attempt unit localization. You will receive a summary report via email once the lock is confirmed."
            },
            {
                keys: ['price', 'pricing', 'cost', 'expensive', 'bill', 'fee', 'rate', 'dollar', '$'],
                reply: "ChargeGo operates on a transparent Kinetic pricing model. The base Rate is \$1.50/hour. For power users, the 'Full Day Surge' is capped at \$4.99. All charges are deducted from your encrypted Wallet balance. You can view a granular breakdown of your previous sessions in the Transactions ledger."
            },
            {
                keys: ['rent', 'how', 'start', 'borrow', 'get', 'unlock', 'qr', 'scan'],
                reply: "To initialize a powerbank stream: 1. Launch the RENT section. 2. Align your camera with the station's QR code. 3. Confirm your Kinetic plan. 4. Wait for the green haptic feedback as the slot unlocks. If the slot 04 is stuck, try scanning the secondary QR on the side of the kiosk."
            },
            {
                keys: ['wallet', 'money', 'balance', 'topup', 'pay', 'card', 'bank', 'withdraw'],
                reply: "The ChargeGo Wallet supports Apple Pay and encrypted Card inputs. To add funds, navigate to the WALLET dashboard and select 'Add Money'. Your current balance is tracked in real-time. Note that a \$10 minimum deposit is required to initialize a new Kinetic session if using a standard plan."
            },
            {
                keys: ['location', 'map', 'station', 'kiosk', 'near', 'where', 'find'],
                reply: "The MAP ecosystem displays thousands of active ChargeGo nodes. Kiosks with a blue pulse have 5+ ready units. A red indicator means the station is currently at full capacity for returns. You can filter by 'Fast Charge' units in the top-right filter menu of the Map view."
            },
            {
                keys: ['battery', 'issue', 'broken', 'dead', 'slow', 'charging'],
                reply: "If your unit is performing below 2.1A efficiency, please return it to any station and select 'Report Issue' on the kiosk screen. We will instantly refund that session's cost to your wallet and unlock a new high-precision unit for you."
            },
            {
                keys: ['elite', 'pro', 'monthly', 'subscription'],
                reply: "The Elite and Pro subscriptions offer unlimited 24-hour swaps and priority access at major transportation hubs. You can upgrade directly in the RENT selection screen to avoid hourly base fees."
            }
        ];

        const match = knowledgeBase.find(f => f.keys.some(k => lowerMsg.includes(k)));

        if (match) return match.reply;

        // Dynamic Ad-lib if no direct match but has context
        if (lowerMsg.length > 3) {
            return `I've noted your query regarding "${userMsg}". While I'm optimizing a direct solution, you might find immediate help by checking the specific ${lowerMsg.includes('bill') || lowerMsg.includes('payment') ? 'Wallet' : 'Map/Rent'} sections, or by contacting our 24/7 technical line at +1 (888).`;
        }

        return "Hello! I am the ChargeGo AI. How can I assist with your powerbank rental, wallet management, or station navigation today?";
    };

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        const userMsg = inputMessage.trim();
        if (!userMsg || isTyping) return;

        setChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setInputMessage('');
        setIsTyping(true);

        try {
            const apiKey = import.meta.env?.VITE_OPENAI_API_KEY;

            if (apiKey && apiKey !== "" && !apiKey.includes("YOUR_")) {
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`
                    },
                    body: JSON.stringify({
                        model: 'gpt-3.5-turbo',
                        messages: [
                            {
                                role: 'system',
                                content: "You are the ChargeGo AI Assistant. You help users with: Renting (Scan QR -> Select Plan -> Unlock), Pricing ($1.50/hr Kinetic, $4.99 Day Surge), Map (Finding Kiosks), Wallet (Top ups), and Lost Powerbanks. Direct users to 'Report Loss' button for missing units. Be modern, helpful, and concise."
                            },
                            ...chatMessages.map(m => ({ role: m.role, content: m.content })),
                            { role: 'user', content: userMsg }
                        ]
                    })
                });

                if (!response.ok) throw new Error("API_ERROR");

                const data = await response.json();
                const aiReply = data.choices[0].message.content;
                setChatMessages(prev => [...prev, { role: 'assistant', content: aiReply }]);
            } else {
                throw new Error("MOCK_MODE");
            }
        } catch (error) {
            // Intelligent Granular Fallback for seamless UX
            console.warn("AI utilizing local expert logic engine...");
            setTimeout(() => {
                const dynamicReply = getExpertResponse(userMsg);
                setChatMessages(prev => [...prev, { role: 'assistant', content: dynamicReply }]);
                setIsTyping(false);
            }, 1000);
            return;
        }

        setIsTyping(false);
    };

    return (
        <div className="relative min-h-[100dvh] bg-[#03070E] text-white flex flex-col font-sans w-full pb-32 md:pb-12">
            {/* Background Texture */}
            <div className="fixed inset-0 bg-[#03070E] pointer-events-none z-0">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#00D2FF08_0%,transparent_50%)]"></div>
            </div>

            <div className="relative z-10 flex-1 w-full max-w-[1200px] mx-auto px-6 pt-12 md:px-12 flex flex-col gap-12">

                {/* Hero Section */}
                <header className="flex flex-col items-center text-center max-w-[800px] mx-auto gap-6 mb-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-16 h-16 bg-[#00D2FF]/10 rounded-[20px] flex items-center justify-center border border-[#00D2FF]/20 shadow-[0_0_20px_rgba(0,210,255,0.1)] mb-2"
                    >
                        <HeadphonesIcon className="w-8 h-8 text-[#00D2FF]" />
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-black tracking-tight leading-tight"
                    >
                        How can we <span className="text-[#00D2FF]">fuel your journey?</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-white/50 text-sm md:text-base max-w-[500px] leading-relaxed"
                    >
                        Get high-precision support for your portable energy needs. Our system is designed for frictionless utility.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="w-full relative mt-4 md:px-0 px-2"
                    >
                        <Search className="absolute left-6 md:left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                        <input
                            type="text"
                            placeholder="Search for answers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#0d1421]/60 backdrop-blur-xl border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm focus:outline-none focus:border-[#00D2FF]/40 transition-all shadow-2xl"
                        />
                    </motion.div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    {/* Left Column: Quick Actions & Status */}
                    <div className="flex flex-col gap-6 w-full">

                        {/* Quick Help Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-gradient-to-br from-[#0b1320] to-[#0A101C] border border-red-500/20 rounded-[32px] p-8 relative overflow-hidden group shadow-xl"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                                <AlertCircle className="w-40 h-40" />
                            </div>
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center border border-red-500/20 mb-6">
                                    <Battery className="w-6 h-6 text-red-500" />
                                </div>
                                <h2 className="text-white font-bold text-2xl mb-2">Lost powerbank?</h2>
                                <p className="text-white/40 text-sm leading-relaxed mb-8">
                                    Report a missing unit immediately to pause charges and secure your account. High-priority resolution guaranteed.
                                </p>
                                <button
                                    onClick={() => alert("Loss reporting initialized. Please check your email.")}
                                    className="px-8 py-3.5 bg-[#00D2FF] hover:bg-[#1E90FF] text-[#03070E] font-black rounded-xl text-xs tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(0,210,255,0.3)] hover:shadow-[0_0_30px_rgba(0,210,255,0.5)] active:scale-95 cursor-pointer"
                                >
                                    Report Loss Now
                                </button>
                            </div>
                        </motion.div>

                        {/* Direct Support Section */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white/[0.03] border border-white/5 rounded-[32px] p-8 backdrop-blur-xl flex flex-col gap-8 shadow-lg"
                        >
                            <h3 className="text-white font-bold text-xl flex items-center gap-2">
                                <div className="w-1.5 h-6 bg-[#00D2FF] rounded-full"></div>
                                Direct Support
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <a href="tel:+18882443436" className="flex items-center gap-4 bg-white/5 border border-white/5 p-4 rounded-2xl hover:bg-[#00D2FF]/10 hover:border-[#00D2FF]/20 transition-all group">
                                    <div className="w-10 h-10 bg-[#00D2FF]/10 rounded-xl flex items-center justify-center border border-[#00D2FF]/20 group-hover:scale-110 transition-transform">
                                        <Phone className="w-5 h-5 text-[#00D2FF]" />
                                    </div>
                                    <div>
                                        <div className="text-white/30 text-[9px] font-black uppercase tracking-widest">Global Support</div>
                                        <div className="text-white font-bold text-sm">+1 (888) CHGE-GO</div>
                                    </div>
                                </a>
                                <a href="mailto:help@chargego.io" className="flex items-center gap-4 bg-white/5 border border-white/5 p-4 rounded-2xl hover:bg-[#00D2FF]/10 hover:border-[#00D2FF]/20 transition-all group">
                                    <div className="w-10 h-10 bg-[#00D2FF]/10 rounded-xl flex items-center justify-center border border-[#00D2FF]/20 group-hover:scale-110 transition-transform">
                                        <Mail className="w-5 h-5 text-[#00D2FF]" />
                                    </div>
                                    <div>
                                        <div className="text-white/30 text-[9px] font-black uppercase tracking-widest">Email Response</div>
                                        <div className="text-white font-bold text-sm">help@chargego.io</div>
                                    </div>
                                </a>
                            </div>
                        </motion.div>

                        {/* System Status Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex items-center justify-center p-4 bg-[#00D2FF]/5 border border-[#4ADE80]/20 rounded-2xl gap-3 shadow-lg"
                        >
                            <div className="w-2.5 h-2.5 bg-[#4ADE80] rounded-full animate-pulse shadow-[0_0_10px_#4ADE80]"></div>
                            <span className="text-[#4ADE80] text-[10px] font-black uppercase tracking-[0.2em]">All Charging Systems Operational</span>
                        </motion.div>
                    </div>

                    {/* Right Column: FAQ Accordion */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white/5 border border-white/5 rounded-[40px] p-8 md:p-10 backdrop-blur-xl flex flex-col gap-8 shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-10 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent pointer-events-none"></div>
                        <div className="flex items-center justify-between relative z-10">
                            <h2 className="text-3xl font-black tracking-tight">Frequently Asked Questions</h2>
                        </div>

                        <div className="flex flex-col gap-4 relative z-10">
                            {filteredFaqs.length > 0 ? (
                                filteredFaqs.map((faq, idx) => (
                                    <div key={idx} className={`border-b border-white/5 last:border-0 transition-all ${openAccordion === idx ? 'pb-6' : 'pb-0'}`}>
                                        <button
                                            onClick={() => setOpenAccordion(openAccordion === idx ? null : idx)}
                                            className="w-full flex items-center justify-between py-5 text-left group"
                                        >
                                            <span className={`text-[15px] font-bold tracking-wide transition-colors ${openAccordion === idx ? 'text-[#00D2FF]' : 'text-white/80 group-hover:text-white'}`}>
                                                {faq.q}
                                            </span>
                                            <ChevronDown className={`w-5 h-5 text-white/30 transition-transform duration-500 ${openAccordion === idx ? 'rotate-180 text-[#00D2FF]' : ''}`} />
                                        </button>
                                        <AnimatePresence>
                                            {openAccordion === idx && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                                    className="overflow-hidden"
                                                >
                                                    <p className="text-white/40 text-sm leading-relaxed p-2 font-medium">
                                                        {faq.a}
                                                    </p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-20 flex flex-col items-center gap-4">
                                    <Search className="w-12 h-12 text-white/5" />
                                    <p className="text-white/20 font-black uppercase tracking-widest text-sm">No matching protocols found</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* AI Chat Layout */}
            <div className="fixed bottom-8 right-8 z-[1000] flex flex-col items-end gap-5">

                {/* Chat Window */}
                <AnimatePresence>
                    {isChatOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="w-[360px] md:w-[420px] h-[550px] bg-[#0A101C] border border-white/10 rounded-[32px] shadow-[0_40px_100px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden backdrop-blur-2xl"
                        >
                            {/* Chat Header */}
                            <div className="bg-[#00D2FF] p-6 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                        <Bot className="w-6 h-6 text-[#03070E]" />
                                    </div>
                                    <div>
                                        <h4 className="text-[#03070E] font-black text-sm uppercase tracking-wider">ChargeGo AI</h4>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 bg-[#4ADE80] rounded-full animate-pulse"></div>
                                            <span className="text-[#03070E]/60 text-[9px] font-black uppercase tracking-widest">Active Assistant</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsChatOpen(false)}
                                    className="w-10 h-10 hover:bg-black/10 rounded-full flex items-center justify-center transition-colors"
                                >
                                    <X className="w-5 h-5 text-[#03070E]" />
                                </button>
                            </div>

                            {/* Chat Messages */}
                            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-white/10">
                                {chatMessages.map((msg, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-[#00D2FF]/10 border border-[#00D2FF]/20' : 'bg-white/5 border border-white/10'}`}>
                                            {msg.role === 'user' ? <User className="w-4 h-4 text-[#00D2FF]" /> : <Bot className="w-4 h-4 text-white/40" />}
                                        </div>
                                        <div className={`max-w-[80%] p-4 rounded-2xl text-xs leading-relaxed font-medium ${msg.role === 'user' ? 'bg-[#00D2FF] text-[#03070E] rounded-tr-none' : 'bg-white/5 text-white/80 border border-white/5 rounded-tl-none'}`}>
                                            {msg.content}
                                        </div>
                                    </motion.div>
                                ))}
                                {isTyping && (
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                            <Bot className="w-4 h-4 text-white/20" />
                                        </div>
                                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex gap-1">
                                            <div className="w-1 h-1 bg-[#00D2FF] rounded-full animate-bounce"></div>
                                            <div className="w-1 h-1 bg-[#00D2FF] rounded-full animate-bounce delay-75"></div>
                                            <div className="w-1 h-1 bg-[#00D2FF] rounded-full animate-bounce delay-150"></div>
                                        </div>
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            {/* Chat Input */}
                            <form
                                onSubmit={handleSendMessage}
                                className="p-6 bg-white/[0.02] border-t border-white/5 flex gap-3 items-center"
                            >
                                <input
                                    type="text"
                                    placeholder="Type your question..."
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-[#00D2FF]/40 transition-all text-white"
                                />
                                <button
                                    type="submit"
                                    className="w-12 h-12 bg-[#00D2FF] shadow-[0_0_15px_rgba(0,210,255,0.4)] rounded-xl flex items-center justify-center group hover:bg-[#1E90FF] transition-all cursor-pointer"
                                >
                                    <Send className="w-5 h-5 text-[#03070E] group-hover:scale-110 transition-transform" />
                                </button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Floating Chat Button */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsChatOpen(!isChatOpen)}
                    className="w-16 h-16 bg-[#00D2FF] rounded-2xl flex items-center justify-center text-[#03070E] shadow-[0_0_30px_rgba(0,210,255,0.4)] hover:shadow-[0_0_45px_rgba(0,210,255,0.6)] cursor-pointer relative z-[1001]"
                >
                    {isChatOpen ? <X className="w-7 h-7" /> : <MessageCircle className="w-7 h-7" />}
                    <div className="absolute inset-0 rounded-2xl bg-[#00D2FF] animate-ping opacity-20"></div>
                </motion.button>
            </div>

            {/* Footer Text */}
            <div className="mt-12 w-full max-w-[1200px] mx-auto px-6 opacity-20 text-[10px] uppercase font-black tracking-widest text-center">
                © 2026 ChargeGo Kinetic Systems • Automated Mesh Infrastructure
            </div>
        </div>
    );
};

export default Help;
