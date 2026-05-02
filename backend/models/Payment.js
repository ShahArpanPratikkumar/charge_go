const mongoose = require('mongoose');

/**
 * Supported payment method types.
 * We store only masked / safe data — NEVER full card numbers.
 */
const paymentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        type: {
            type: String,
            enum: ['upi', 'card', 'paypal'],
            required: [true, 'Payment type is required'],
        },

        // ── UPI ───────────────────────────────────────────────────────────
        upiId: {
            type: String,
            trim: true,
            default: '',
        },

        // ── Card (masked) ─────────────────────────────────────────────────
        // We NEVER store full card numbers. Only last 4 digits + expiry.
        cardLast4: {
            type: String,
            maxlength: 4,
            default: '',
        },
        cardExpiry: {
            type: String,   // format: "MM/YY"
            default: '',
        },
        cardBrand: {
            type: String,   // Visa / Mastercard / Amex
            default: '',
        },

        // ── PayPal ────────────────────────────────────────────────────────
        paypalEmail: {
            type: String,
            default: '',
        },

        // ── Meta ──────────────────────────────────────────────────────────
        isDefault: {
            type: Boolean,
            default: false,
        },
        label: {
            type: String,   // User-friendly name e.g. "Work Card"
            default: '',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
