require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');


/* =========== CONFIG EXPRESS APP =========== */

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { }
}));

app.use(passport.initialize());
app.use(passport.session());


// ================ CONNECT TO MONGOOSE ================

startMongooseConnection().catch(err => console.log(err));

async function startMongooseConnection() {
    mongoose.set('strictQuery', false);
    await mongoose.connect('mongodb://127.0.0.1:27017/secrets');
}


// ================== MODELS & SCHEMAS ==================

const userSchema = new mongoose.Schema({
    active: Boolean
});

userSchema.plugin(passportLocalMongoose, {
    // Set usernameUnique to false to avoid a mongodb index on the username column!
    usernameUnique: false,

    findByUsername: function (model, queryParameters) {
        // Restrict users search to find only active ones
        queryParameters.active = true;
        return model.findOne(queryParameters);
    }
});

const User = mongoose.model('user', userSchema);


/*  ---------- Create user sessions ---------- */

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



/* ========= HTTP REQUESTS' HANDLERS ========= */

app.get('/', function (req, res) {
    res.render('home');
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
                passport.authenticate('local')(req, res, function(){
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
    });


app.get('/secrets', function (req, res) {
    if (req.isAuthenticated()) {
        console.log('secrets authentication success');
        res.render('secrets');
    } else {
        console.log('secrets authentication fault');
        res.redirect('/login');
    }
})


/* ============ PORT LISTENER ============ */

app.listen(process.env.PORT || 3000, function () {
    console.log('Server is running');
})

