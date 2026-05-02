const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Configure Passport with Google OAuth 2.0 strategy.
 * Called once from server.js — sets the strategy globally on passport.
 */
const configurePassport = () => {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: '/api/auth/google/callback',
                scope: ['profile', 'email'],
            },
            async (_accessToken, _refreshToken, profile, done) => {
                try {
                    const email = profile.emails?.[0]?.value;
                    const name = profile.displayName;
                    const photo = profile.photos?.[0]?.value || '';

                    if (!email) {
                        return done(new Error('No email returned from Google'), null);
                    }

                    // ── Find or create user ────────────────────────────────────
                    let user = await User.findOne({
                        $or: [{ googleId: profile.id }, { email }],
                    });

                    if (!user) {
                        // New user — create without password (Google-only account)
                        user = new User({
                            googleId: profile.id,
                            name,
                            email,
                            photo,
                            isProfileComplete: true,
                            // password is select:false & has a minlength validator,
                            // so we set a dummy value and skip validation
                            password: `google_oauth_${profile.id}`,
                        });
                        await user.save({ validateBeforeSave: false });
                    } else if (!user.googleId) {
                        // Existing email user — link their Google ID
                        user.googleId = profile.id;
                        if (!user.photo) user.photo = photo;
                        await user.save({ validateBeforeSave: false });
                    }

                    // ── Issue JWT ──────────────────────────────────────────────
                    const token = jwt.sign(
                        { id: user._id },
                        process.env.JWT_SECRET,
                        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
                    );

                    return done(null, { user: user.profile, token });
                } catch (err) {
                    console.error('[GoogleStrategy]', err);
                    return done(err, null);
                }
            }
        )
    );

    // Minimal session serialization — we rely on JWT, sessions are short-lived
    passport.serializeUser((data, done) => done(null, data));
    passport.deserializeUser((data, done) => done(null, data));
};

module.exports = configurePassport;
