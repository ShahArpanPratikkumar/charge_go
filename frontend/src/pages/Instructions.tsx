import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, ParkingSquare, Cable, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Instructions = () => {
    const navigate = useNavigate();

    const steps = [
        {
            id: 1,
            title: "Find a Station",
            desc: "Navigate to any active ChargeGo kiosk nearby through the map.",
            icon: ParkingSquare,
            color: "text-primary"
        },
        {
            id: 2,
            title: "Plug In",
            desc: "Insert the powerbank into any available slot until you hear a click.",
            icon: Cable,
            color: "text-secondary"
        },
        {
            id: 3,
            title: "Confirm Return",
            desc: "Check the app for return confirmation and total duration summary.",
            icon: CheckCircle,
            color: "text-accent"
        }
    ];

    return (
        <div className="px-6 py-8">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8 group"
            >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="text-xs font-bold uppercase tracking-widest">Back to Dashboard</span>
            </button>

            <div className="mb-12">
                <h1 className="text-4xl font-extrabold mb-3">Return Guide</h1>
                <p className="text-white/40 font-bold uppercase tracking-widest text-xs">Easy 3-step process to end session</p>
            </div>

            <div className="space-y-6 relative">
                {/* Connection Line */}
                <div className="absolute left-[27px] top-4 bottom-4 w-[2px] bg-white/5 z-0"></div>

                {steps.map((step, i) => (
                    <motion.div
                        key={step.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.2 }}
                        className="flex gap-6 relative z-10"
                    >
                        <div className={`w-14 h-14 shrink-0 rounded-2xl bg-dark border-2 border-white/5 flex items-center justify-center font-black text-xl shadow-xl transition-colors`}>
                            <span className={step.color}>{step.id}</span>
                        </div>
                        <div className="glass-card p-6 flex-grow">
                            <div className="flex items-center gap-2 mb-2">
                                <step.icon className={`w-4 h-4 ${step.color}`} />
                                <h3 className="font-bold text-lg">{step.title}</h3>
                            </div>
                            <p className="text-white/40 text-sm leading-relaxed">{step.desc}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-12">
                <div className="glass-card p-8 border-primary/20 bg-primary/5 text-center relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
                    <div className="relative z-10">
                        <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Need help?</h3>
                        <p className="text-white/40 text-sm mb-6">Our 24/7 support team is always ready to assist you with the return process.</p>
                        <button className="text-primary font-black text-xs uppercase tracking-[0.2em] hover:opacity-80 transition-opacity">
                            Contact Support
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Instructions;
