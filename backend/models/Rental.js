const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        stationId: {
            type: String,
            required: [true, 'Station ID is required'],
            trim: true,
        },
        stationName: {
            type: String,
            trim: true,
            default: '',
        },
        powerBankId: {
            type: String,
            trim: true,
            default: '',
        },
        plan: {
            type: String,
            enum: ['Basic', 'Traveler', 'Pro'],
            default: 'Traveler',
        },
        status: {
            type: String,
            enum: ['active', 'completed', 'cancelled'],
            default: 'active',
        },

        // ── Timing ────────────────────────────────────────────────────────
        startTime: {
            type: Date,
            default: Date.now,
        },
        endTime: {
            type: Date,
            default: null,
        },
        durationMinutes: {
            type: Number,
            default: 0,
        },

        // ── Billing ───────────────────────────────────────────────────────
        ratePerMinute: {
            type: Number,
            default: 0.05,   // e.g. ₹0.05 / min
        },
        totalCost: {
            type: Number,
            default: 0,
        },
        currency: {
            type: String,
            default: 'INR',
        },

        // ── Location snapshot ─────────────────────────────────────────────
        pickupCoords: {
            lat: { type: Number, default: null },
            lng: { type: Number, default: null },
        },
        returnCoords: {
            lat: { type: Number, default: null },
            lng: { type: Number, default: null },
        },
    },
    { timestamps: true }
);

// ── Compute duration + cost when rental ends ───────────────────────────────
rentalSchema.methods.complete = function (returnCoords) {
    this.status = 'completed';
    this.endTime = new Date();

    const diffMs = this.endTime - this.startTime;
    this.durationMinutes = Math.ceil(diffMs / 1000 / 60);
    this.totalCost = parseFloat((this.durationMinutes * this.ratePerMinute).toFixed(2));

    if (returnCoords) {
        this.returnCoords = returnCoords;
    }
};

module.exports = mongoose.model('Rental', rentalSchema);
