const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware: verify JWT from Authorization header.
 * Sets req.user = { id } on success.
 */
const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Not authorized. Token missing.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check user still exists in DB
        const user = await User.findById(decoded.id).select('_id role');
        if (!user) {
            return res.status(401).json({ success: false, message: 'User no longer exists.' });
        }

        req.user = { id: user._id.toString(), role: user.role };
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: 'Session expired. Please log in again.' });
        }
        return res.status(401).json({ success: false, message: 'Invalid token.' });
    }
};

/** Middleware: restrict to admin role only */
const adminOnly = (req, res, next) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Access denied. Admins only.' });
    }
    next();
};

module.exports = { protect, adminOnly };
