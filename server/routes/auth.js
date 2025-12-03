const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { db } = require('../db');
const router = express.Router();

// Passport Configuration
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET && GOOGLE_CLIENT_ID !== 'mock_client_id') {
    passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback'
    },
        function (accessToken, refreshToken, profile, cb) {
            try {
                const user = db.prepare('SELECT * FROM users WHERE google_id = ?').get(profile.id);
                if (!user) {
                    const newUser = {
                        id: profile.id,
                        google_id: profile.id,
                        email: profile.emails[0].value,
                        name: profile.displayName,
                        avatar_url: profile.photos[0].value
                    };
                    db.prepare('INSERT INTO users (id, google_id, email, name, avatar_url) VALUES (?, ?, ?, ?, ?)').run(
                        newUser.id, newUser.google_id, newUser.email, newUser.name, newUser.avatar_url
                    );
                    return cb(null, newUser);
                }
                return cb(null, user);
            } catch (err) {
                return cb(err);
            }
        }
    ));
}

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    try {
        const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

// Routes
router.get('/google', (req, res, next) => {
    console.log('Auth Request - GOOGLE_CLIENT_ID:', GOOGLE_CLIENT_ID);
    const isMock = !GOOGLE_CLIENT_ID ||
        GOOGLE_CLIENT_ID === 'mock_client_id' ||
        GOOGLE_CLIENT_ID === '' ||
        !GOOGLE_CLIENT_ID.endsWith('.apps.googleusercontent.com');

    if (isMock) {
        console.log('Using Dev Auth Bypass (Invalid or Mock Client ID detected)');
        // Dev Bypass
        const devUser = {
            id: 'dev-user-123',
            google_id: 'dev-google-id',
            email: 'dev@example.com',
            name: 'Developer User',
            avatar_url: 'https://ui-avatars.com/api/?name=Developer+User'
        };

        const existing = db.prepare('SELECT * FROM users WHERE id = ?').get(devUser.id);
        if (!existing) {
            db.prepare('INSERT INTO users (id, google_id, email, name, avatar_url) VALUES (?, ?, ?, ?, ?)').run(
                devUser.id, devUser.google_id, devUser.email, devUser.name, devUser.avatar_url
            );
        }

        req.login(devUser, (err) => {
            if (err) return next(err);
            res.redirect('http://localhost:8080');
        });
    } else {
        passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
    }
});

// Explicit Dev Bypass Route
router.get('/dev', (req, res, next) => {
    console.log('Explicit Dev Auth Bypass Requested');
    const devUser = {
        id: 'dev-user-123',
        google_id: 'dev-google-id',
        email: 'dev@example.com',
        name: 'Developer User',
        avatar_url: 'https://ui-avatars.com/api/?name=Developer+User'
    };

    const existing = db.prepare('SELECT * FROM users WHERE id = ?').get(devUser.id);
    if (!existing) {
        db.prepare('INSERT INTO users (id, google_id, email, name, avatar_url) VALUES (?, ?, ?, ?, ?)').run(
            devUser.id, devUser.google_id, devUser.email, devUser.name, devUser.avatar_url
        );
    }

    req.login(devUser, (err) => {
        if (err) return next(err);
        res.redirect('http://localhost:8080');
    });
});

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
        res.redirect('http://localhost:8080');
    });

router.get('/me', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ user: req.user });
    } else {
        res.status(401).json({ user: null });
    }
});

router.post('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.json({ message: 'Logged out' });
    });
});

module.exports = router;
