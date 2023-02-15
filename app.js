const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require(__dirname + '/mongoose.js')



/* =========== CONFIG EXPRESS APP =========== */

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');


/* ========= HTTP REQUESTS' HANDLERS ========= */

app.get('/', function(req, res){
    res.render('home');
});

app.get('/login', function(req, res){
    res.render('login');
});

app.get('/register', function(req, res){
    res.render('register');
});


/* ============ PORT LISTENER ============ */

app.listen(process.env.PORT || 3000, function(){
    console.log('Server is running');
})

