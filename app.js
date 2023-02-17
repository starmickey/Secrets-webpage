// ================== IMPORT MODULES ==================

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const findOrCreate = require('mongoose-findorcreate');
const GoogleStrategy = require('passport-google-oauth20').Strategy;



// ================ CONFIG EXPRESS APP ================ 

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');


// -------- Make app use passport's session cookies --------

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {}
}));

app.use(passport.initialize());
app.use(passport.session());



// ============= START MONGOOSE CONNECTION =============

startMongooseConnection().catch(err => console.log(err));

async function startMongooseConnection() {
    mongoose.set('strictQuery', false);
    await mongoose.connect('mongodb://127.0.0.1:27017/secrets');
}


// -------------- Create Models and Schemas --------------

const userSchema = new mongoose.Schema({
    googleId: String,
    active: Boolean
});


// ----------------- Schema configuration -----------------

userSchema.plugin(passportLocalMongoose, {
    // Set usernameUnique to false to avoid a mongodb index on the username column!
    usernameUnique: false,

    findByUsername: function (model, queryParameters) {
        // Restrict users search to find only active ones
        queryParameters.active = true;
        return model.findOne(queryParameters);
    }
});

userSchema.plugin(findOrCreate);


// ------------------ Create Schema Model ------------------

const User = mongoose.model('user', userSchema);


//  ----- Fill passport functions' stack for user sessions ----- 


passport.use(User.createStrategy());

//  NOTES:
//  Indicate passport which functions it must call to manage sessions

//  SerializeUser function is used to save user data in some passport session.
//  This is done when an user logs in.
//  We can use the argument function to set which user data will be saved.
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

//  DeserializeUser function is executed in every authentication.
//  It retrieves the user data saved in the session.
//  Argument function is set according to the one of serializeUser, so the
//  same data saved is retrieved.
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/secrets',
    // Try deleting this
    // userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo'
},
    // This function is called when we authenticate the user
    function (accessToken, refreshToken, profile, callback) {
        User.findOrCreate({ googleId: profile.id }, function (err, user, created) {
            return callback(err, user, created);
        });
    }
));


/* ========= HTTP REQUESTS' HANDLERS ========= */

app.get('/', function (req, res) {
    res.render('home');
});


app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile'] }));


app.get('/auth/google/secrets',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
        // Successful authentication
        res.redirect('/secrets');
    });


app.route('/register')
    .get(function (req, res) {
        res.render('register');
    })

    .post(function (req, res) {

        User.register({ username: req.body.username, active: true }, req.body.password, function (err, user) {
            if (err) {
                console.log(err);
                res.redirect('/register');
            } else {
                console.log('user registered');
                passport.authenticate('local')(req, res, function () {
                    res.redirect('/secrets');
                });
            }

        });
    });


app.route('/login')
    .get(function (req, res) {
        res.render('login');
    })

    .post(function (req, res) {
        const user = new User({
            username: req.body.username,
            password: req.body.password
        });

        req.login(user, function (err) {
            if (err) {
                console.log(err);
            } else {
                passport.authenticate('local')(req, res, function () {
                    res.redirect('/secrets');
                });
            }
        })

    });



app.get('/logout', function (req, res) {
    req.logout(function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/login');
        }
    })
})



app.get('/secrets', function (req, res) {
    if (req.isAuthenticated()) {
        res.render('secrets');
    } else {
        res.redirect('/login');
    }
})



/* ============ PORT LISTENER ============ */

app.listen(process.env.PORT || 3000, function () {
    console.log('Server is running');
})

