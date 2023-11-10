const express = require("express");
const passport = require('./passport.config');
const { User, Secret } = require("./models")
const router = express.Router();

router.get('/', (req, res) => {
    res.render('home');
});

router.route('/register')
    .get((req, res) => res.render('register'))
    .post((req, res) =>
        User.register(
            { username: req.body.username, active: true },
            req.body.password, (err, user) => {
                if (err) {
                    console.log(err);
                    res.redirect('/register');
                } else {
                    passport.authenticate('local')(req, res, () =>
                        res.redirect('/secrets'));
                }
            })
    );

router.get('/auth/google',
    passport.authenticate('google', { scope: ['profile'] }));


router.get('/auth/google/secrets',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
        // Successful authentication
        res.redirect('/secrets');
    });

router.route('/login')
    .get((req, res) => res.render('login'))
    .post((req, res) => {
        const user = new User({
            username: req.body.username,
            password: req.body.password
        });

        req.login(user, (err) => {
            if (err)
                console.log(err)
            else {
                passport.authenticate('local')(req, res, () =>
                    res.redirect('/secrets')
                );
            }
        })

    });

router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err)
            console.log(err)
        else {
            res.redirect('/login');
        }
    })
})

router.get('/secrets', function (req, res) {
    const secretNames = [];
    Secret.find(function (err, secrets) {
        if (err) {
            console.log(err);
        } else {
            if (req.isAuthenticated()) {
                secrets.forEach(secret => {
                    secretNames.push(secret.name);
                });
                res.render('secrets', { secrets: secretNames });
            } else {
                res.redirect('/login');
            }
        }
    });
});

router.route('/submit')
    .get((req, res) => {
        if (req.isAuthenticated()) {
            res.render('submit');
        } else {
            res.redirect('/login');
        }
    })

    .post((req, res) => {
        if (req.isAuthenticated()) {
            User.findById(req.user.id, (err, user) => {
                if (err) {
                    console.log(err);
                } else if (!user) {
                    console.log('user not found');
                } else {
                    const submittedSecret = new Secret({ name: req.body.secret, user: user });
                    submittedSecret.save();
                }
            });
            res.redirect('/secrets');

        } else {
            res.redirect('/login');
        }
    })

module.exports = router;