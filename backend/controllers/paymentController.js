const Payment = require('../models/Payment');

// ─────────────────────────────────────────────────────────────────────────────
//  GET /api/payment  (protected) — list all methods for logged-in user
// ─────────────────────────────────────────────────────────────────────────────
exports.getPayments = async (req, res) => {
    try {
        const payments = await Payment.find({ user: req.user.id }).sort({ isDefault: -1, createdAt: -1 });
        return res.status(200).json({ success: true, payments });
    } catch (err) {
        console.error('[getPayments]', err);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
//  POST /api/payment  (protected) — add a new payment method
// ─────────────────────────────────────────────────────────────────────────────
exports.addPayment = async (req, res) => {
    const { type, upiId, cardLast4, cardExpiry, cardBrand, paypalEmail, label } = req.body;

    if (!type) {
        return res.status(400).json({ success: false, message: 'Payment type is required.' });
    }

    // Validate by type
    if (type === 'upi' && !upiId) {
        return res.status(400).json({ success: false, message: 'UPI ID is required.' });
    }
    if (type === 'card' && (!cardLast4 || !cardExpiry)) {
        return res.status(400).json({ success: false, message: 'Card last 4 digits and expiry are required.' });
    }
    if (type === 'paypal' && !paypalEmail) {
        return res.status(400).json({ success: false, message: 'PayPal email is required.' });
    }

    try {
        // If this is the user's first method, make it default automatically
        const existingCount = await Payment.countDocuments({ user: req.user.id });
        const isDefault = existingCount === 0;

        const payment = await Payment.create({
            user: req.user.id,
            type,
            upiId: upiId || '',
            cardLast4: cardLast4 ? String(cardLast4).slice(-4) : '',
            cardExpiry: cardExpiry || '',
            cardBrand: cardBrand || '',
            paypalEmail: paypalEmail || '',
            label: label || '',
            isDefault,
        });

        return res.status(201).json({
            success: true,
            message: 'Payment method added.',
            payment,
        });
    } catch (err) {
        console.error('[addPayment]', err);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
//  PUT /api/payment/:id/default  (protected) — set as default
// ─────────────────────────────────────────────────────────────────────────────
exports.setDefault = async (req, res) => {
    try {
        // Clear all existing defaults for this user
        await Payment.updateMany({ user: req.user.id }, { $set: { isDefault: false } });

        const payment = await Payment.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { $set: { isDefault: true } },
            { new: true }
        );

        if (!payment) {
            return res.status(404).json({ success: false, message: 'Payment method not found.' });
        }

        return res.status(200).json({ success: true, message: 'Default payment method updated.', payment });
    } catch (err) {
        console.error('[setDefault]', err);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
//  DELETE /api/payment/:id  (protected)
// ─────────────────────────────────────────────────────────────────────────────
exports.deletePayment = async (req, res) => {
    try {
        const payment = await Payment.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!payment) {
            return res.status(404).json({ success: false, message: 'Payment method not found.' });
        }

        // If deleted method was default, promote the next most recent one
        if (payment.isDefault) {
            const next = await Payment.findOne({ user: req.user.id }).sort({ createdAt: -1 });
            if (next) {
                next.isDefault = true;
                await next.save();
            }
        }

        return res.status(200).json({ success: true, message: 'Payment method removed.' });
    } catch (err) {
        console.error('[deletePayment]', err);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};
