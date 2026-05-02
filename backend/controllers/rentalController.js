const Rental = require('../models/Rental');
const User = require('../models/User');

// ─────────────────────────────────────────────────────────────────────────────
//  POST /api/rental/start  (protected)
//  Body: { stationId, stationName?, powerBankId?, plan?, pickupCoords? }
// ─────────────────────────────────────────────────────────────────────────────
exports.startRental = async (req, res) => {
    const { stationId, stationName, powerBankId, plan, pickupCoords } = req.body;

    if (!stationId) {
        return res.status(400).json({ success: false, message: 'stationId is required.' });
    }

    try {
        // Prevent double-renting: check for already active rental
        const active = await Rental.findOne({ user: req.user.id, status: 'active' });
        if (active) {
            return res.status(409).json({
                success: false,
                message: 'You already have an active rental. End it before starting a new one.',
                rental: active,
            });
        }

        const rental = await Rental.create({
            user: req.user.id,
            stationId,
            stationName: stationName || '',
            powerBankId: powerBankId || '',
            plan: plan || 'Traveler',
            status: 'active',
            pickupCoords: pickupCoords || { lat: null, lng: null },
        });

        return res.status(201).json({
            success: true,
            message: 'Rental started successfully.',
            rental,
        });
    } catch (err) {
        console.error('[startRental]', err);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
//  POST /api/rental/end  (protected)
//  Body: { rentalId, returnCoords? }
// ─────────────────────────────────────────────────────────────────────────────
exports.endRental = async (req, res) => {
    const { rentalId, returnCoords } = req.body;

    if (!rentalId) {
        return res.status(400).json({ success: false, message: 'rentalId is required.' });
    }

    try {
        const rental = await Rental.findOne({ _id: rentalId, user: req.user.id, status: 'active' });
        if (!rental) {
            return res.status(404).json({ success: false, message: 'Active rental not found.' });
        }

        // Calculate duration + cost via model method
        rental.complete(returnCoords || null);
        await rental.save();

        // Deduct cost from user's wallet
        await User.findByIdAndUpdate(
            req.user.id,
            { $inc: { walletBalance: -rental.totalCost } }
        );

        return res.status(200).json({
            success: true,
            message: 'Rental ended successfully.',
            rental,
            totalCost: rental.totalCost,
            durationMinutes: rental.durationMinutes,
        });
    } catch (err) {
        console.error('[endRental]', err);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
//  GET /api/rental  (protected) — paginated rental history
// ─────────────────────────────────────────────────────────────────────────────
exports.getRentals = async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    try {
        const [rentals, total] = await Promise.all([
            Rental.find({ user: req.user.id })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Rental.countDocuments({ user: req.user.id }),
        ]);

        return res.status(200).json({
            success: true,
            rentals,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (err) {
        console.error('[getRentals]', err);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
//  GET /api/rental/active  (protected)
// ─────────────────────────────────────────────────────────────────────────────
exports.getActiveRental = async (req, res) => {
    try {
        const rental = await Rental.findOne({ user: req.user.id, status: 'active' });
        return res.status(200).json({ success: true, rental: rental || null });
    } catch (err) {
        console.error('[getActiveRental]', err);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};
