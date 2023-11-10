const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const { User } = require("./models")
require('dotenv').config();

passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/secrets',
},
    // This function is called when we authenticate the user
    function (accessToken, refreshToken, profile, callback) {
        User.findOrCreate({ googleId: profile.id }, function (err, user, created) {
            return callback(err, user, created);
        });
    }
));

// Facebook Strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: 'http://localhost:3000/auth/facebook/secrets'
},
    function (accessToken, refreshToken, profile, callback) {
        User.findOrCreate({ facebookId: profile.id }, function (err, user) {
            return callback(err, user);
        });
    }
));

module.exports = passport;
