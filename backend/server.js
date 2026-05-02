/**
 * ChargeGo Backend — Main Entry Point
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const session = require('express-session');
const passport = require('passport');
const path = require('path');

const connectDB = require('./config/db');
const configurePassport = require('./config/passport');

// ── Connect to MongoDB ────────────────────────────────────────────────────────
connectDB();

const app = express();

// ── CORS ─────────────────────────────────────────────────────────────────────
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── Body Parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Logging ───────────────────────────────────────────────────────────────────
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ── Express Session (required by Passport internally, even with session:false) ──
app.use(session({
    secret: process.env.SESSION_SECRET || process.env.JWT_SECRET || 'chargego_session_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000,  // 1 day
    },
}));

// ── Passport ──────────────────────────────────────────────────────────────────
configurePassport();
app.use(passport.initialize());
app.use(passport.session());

// ── Static Files ──────────────────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
    res.status(200).json({
        success: true,
        status: 'ChargeGo API is running 🚀',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        googleOauth: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    });
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/rental', require('./routes/rental'));

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((_req, res) => {
    res.status(404).json({ success: false, message: 'Route not found.' });
});

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
    console.error('❌ Unhandled error:', err.stack);
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
            success: false,
            message: `File too large. Max ${process.env.MAX_FILE_SIZE_MB || 5}MB allowed.`,
        });
    }
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error.',
    });
});

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n🚀  ChargeGo API listening on http://localhost:${PORT}`);
    console.log(`📋  Environment  : ${process.env.NODE_ENV}`);
    console.log(`🔐  Google OAuth : ${process.env.GOOGLE_CLIENT_ID ? '✅ Configured' : '⚠️  Not configured (add GOOGLE_CLIENT_ID to .env)'}`);
    console.log(`🏥  Health check : http://localhost:${PORT}/api/health\n`);
});

module.exports = app;
