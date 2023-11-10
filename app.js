const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('./passport.config');
const router = require('./router')

const app = express();

// public is the default object for retrieving files when rendering a view
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));


//  create session middleware
app.use(session({
    secret: process.env.APP_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {}
}));

app.use(passport.initialize());
app.use(passport.session());

// use router for getting the service for each http request
app.use("/", router);

// use ejs for rendering user interfaces
app.set('view engine', 'ejs');

// set server to listen to requests on the port
app.listen(process.env.PORT || 3000, function () {
    console.log('Server running on port ', process.env.PORT || 3000);
})

module.exports = app;
