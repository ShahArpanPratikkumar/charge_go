const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

/** Generate a signed JWT for the given user ID */
const signToken = (userId) =>
    jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

// ─────────────────────────────────────────────────────────────────────────────
//  POST /api/auth/register
// ─────────────────────────────────────────────────────────────────────────────
exports.register = async (req, res) => {
    // 1. Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ success: false, errors: errors.array() });
    }

    const { name, email, phone, password } = req.body;

    try {
        // 2. Check if email is already in use
        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) {
            return res.status(409).json({
                success: false,
                message: 'An account with this email already exists.',
            });
        }

        // 3. Create the user (password will be hashed via pre-save hook)
        const user = await User.create({
            name,
            email: email.toLowerCase(),
            phone: phone || '',
            password,
            isProfileComplete: !!(name && phone),
        });

        // 4. Issue JWT
        const token = signToken(user._id);

        return res.status(201).json({
            success: true,
            message: 'Account created successfully.',
            token,
            user: user.profile,
        });

    } catch (err) {
        console.error('[register]', err);
        return res.status(500).json({ success: false, message: 'Server error during registration.' });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
//  POST /api/auth/login
// ─────────────────────────────────────────────────────────────────────────────
exports.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        // 1. Find user (explicitly select password since it's select:false)
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.',
            });
        }

        // 2. Verify password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.',
            });
        }

        // 3. Issue JWT
        const token = signToken(user._id);

        return res.status(200).json({
            success: true,
            message: 'Login successful.',
            token,
            user: user.profile,
            isProfileComplete: user.isProfileComplete,
        });

    } catch (err) {
        console.error('[login]', err);
        return res.status(500).json({ success: false, message: 'Server error during login.' });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
//  GET /api/auth/me  (protected)
// ─────────────────────────────────────────────────────────────────────────────
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }
        return res.status(200).json({ success: true, user: user.profile });
    } catch (err) {
        console.error('[getMe]', err);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};
