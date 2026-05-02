const express = require('express');
const router = express.Router();
const passport = require('passport');
const { body } = require('express-validator');
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// ── Validation rules ──────────────────────────────────────────────────────────
const registerValidation = [
    body('name').trim().notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 60 }).withMessage('Name must be 2–60 characters'),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('phone').optional().isMobilePhone().withMessage('Valid phone number required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const loginValidation = [
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
];

// ── Email / Password Routes ───────────────────────────────────────────────────
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', protect, getMe);

// ── Google OAuth Routes ───────────────────────────────────────────────────────

/**
 * GET /api/auth/google
 * Initiates the OAuth flow — redirects user to Google's consent screen.
 */
router.get(
    '/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        session: false,           // We rely on JWT, not server sessions
    })
);

/**
 * GET /api/auth/google/callback
 * Google redirects here after user consents.
 * On success → redirect frontend with JWT as a query param.
 * On failure → redirect to signin page with error flag.
 */
router.get(
    '/google/callback',
    passport.authenticate('google', {
        session: false,
        failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:5173'}/signin?error=google_auth_failed`,
    }),
    (req, res) => {
        // req.user is set by the GoogleStrategy done() callback
        const { token, user } = req.user;
        const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

        // Pass token + minimal user data as URL params to the frontend callback page
        const params = new URLSearchParams({
            token,
            name: user.name,
            email: user.email,
            photo: user.photo || '',
        });

        res.redirect(`${clientUrl}/auth/callback?${params.toString()}`);
    }
);

module.exports = router;
