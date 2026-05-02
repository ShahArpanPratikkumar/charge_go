const mongoose = require('mongoose');

/**
 * Connect to MongoDB with retry logic and graceful error handling.
 */
const connectDB = async () => {
    const uri = process.env.MONGO_URI;

    if (!uri) {
        console.error('❌  MONGO_URI is not defined in .env');
        process.exit(1);
    }

    try {
        const conn = await mongoose.connect(uri, {
            // Modern Mongoose 8+ no longer requires these flags,
            // but kept for compatibility with older setups.
        });

        console.log(`✅  MongoDB Connected: ${conn.connection.host}`);

        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️  MongoDB disconnected. Attempting reconnect…');
        });

        mongoose.connection.on('error', (err) => {
            console.error('❌  MongoDB error:', err.message);
        });

    } catch (err) {
        console.error('❌  MongoDB connection failed:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
