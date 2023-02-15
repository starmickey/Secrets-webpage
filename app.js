const express = require('express');
const bodyParser = require('body-parser');


/* =========== CONFIG EXPRESS APP =========== */

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');


/* ========= HTTP REQUESTS' HANDLERS ========= */

app.get('/', function(req, res){
    res.render('home');
});


/* ============ PORT LISTENER ============ */

app.listen(process.env.PORT || 3000, function(){
    console.log('Server is running');
})

