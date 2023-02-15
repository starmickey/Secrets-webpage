const express = require('express');
const bodyParser = require('body-parser');
const mongooseInterface = require(__dirname + '/mongoose.js');



/* =========== CONFIG EXPRESS APP =========== */

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');


/* ========= HTTP REQUESTS' HANDLERS ========= */

app.get('/', function (req, res) {
    res.render('home');
});

app.route('/register')
    .get(function (req, res) {
        res.render('register');
    })

    .post(function (req, res) {
        mongooseInterface.registerUser(req.body.username, req.body.password)
            .then(
                function onfullfilled(value) {
                    res.render('secrets');
                },
                function onrejected(reason) {
                    console.log(reason);
                    res.render('register');
                }
            )
    });

app.route('/login')
    .get(function (req, res) {
        res.render('login');
    })
    .post(function (req, res) {
        mongooseInterface.login(req.body.username, req.body.password)
            .then(
                function onfullfilled(value) {
                    res.render('secrets');
                },
                function onrejected(reason) {
                    console.log(reason);
                    res.render('register');
                }
            )
    });




/* ============ PORT LISTENER ============ */

app.listen(process.env.PORT || 3000, function () {
    console.log('Server is running');
})

