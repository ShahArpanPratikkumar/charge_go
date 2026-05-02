const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters'],
            maxlength: [60, 'Name cannot exceed 60 characters'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
        },
        phone: {
            type: String,
            trim: true,
            default: '',
        },
        googleId: {
            type: String,
            default: '',
            index: true,
            sparse: true,   // allows multiple null values
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false, // Never returned in queries by default
        },
        photo: {
            type: String,   // Stores relative file path e.g. "uploads/avatar_123.jpg"
            default: '',
        },
        walletBalance: {
            type: Number,
            default: 0,
            min: 0,
        },
        isProfileComplete: {
            type: Boolean,
            default: false,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
    },
    { timestamps: true }   // adds createdAt + updatedAt automatically
);

// ── Pre-save hook: hash password before storing ────────────────────────────
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// ── Instance method: compare plain-text password against stored hash ───────
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// ── Virtual: safe public profile (no password / internal fields) ───────────
userSchema.virtual('profile').get(function () {
    return {
        id: this._id,
        name: this.name,
        email: this.email,
        phone: this.phone,
        photo: this.photo,
        walletBalance: this.walletBalance,
        isProfileComplete: this.isProfileComplete,
        role: this.role,
        createdAt: this.createdAt,
    };
});

module.exports = mongoose.model('User', userSchema);
