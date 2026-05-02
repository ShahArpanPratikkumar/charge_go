const { validationResult } = require('express-validator');
const path = require('path');
const User = require('../models/User');

// ─────────────────────────────────────────────────────────────────────────────
//  GET /api/user/profile  (protected)
// ─────────────────────────────────────────────────────────────────────────────
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
        return res.status(200).json({ success: true, user: user.profile });
    } catch (err) {
        console.error('[getProfile]', err);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
//  PUT /api/user/profile  (protected)
// ─────────────────────────────────────────────────────────────────────────────
exports.updateProfile = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ success: false, errors: errors.array() });
    }

    const { name, phone } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

        if (name) user.name = name.trim();
        if (phone !== undefined) user.phone = phone.trim();

        // Mark profile complete if both fields are set
        user.isProfileComplete = !!(user.name && user.phone);

        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Profile updated.',
            user: user.profile,
        });
    } catch (err) {
        console.error('[updateProfile]', err);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
//  POST /api/user/photo  (protected) — multipart/form-data
// ─────────────────────────────────────────────────────────────────────────────
exports.uploadPhoto = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded.' });
        }

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

        // Store relative path; serve /uploads statically from server.js
        user.photo = `uploads/${req.file.filename}`;
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Photo updated.',
            photo: user.photo,
        });
    } catch (err) {
        console.error('[uploadPhoto]', err);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
//  POST /api/user/wallet/topup  (protected)
// ─────────────────────────────────────────────────────────────────────────────
exports.topUpWallet = async (req, res) => {
    const { amount } = req.body;

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
        return res.status(400).json({ success: false, message: 'A positive amount is required.' });
    }

    try {
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $inc: { walletBalance: Number(amount) } },
            { new: true }
        );
        return res.status(200).json({
            success: true,
            message: `Wallet topped up by ₹${amount}.`,
            walletBalance: user.walletBalance,
        });
    } catch (err) {
        console.error('[topUpWallet]', err);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};
