const express = require('express');
const exphbs  = require('express-handlebars');
const path  = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();

//Add routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

require('./config/passport')(passport);

mongoose.Promise = global.Promise;

const db = require('./config/database');

mongoose.connect(db.mongoURI).then(function () {
    console.log('MongoDB Connected');
}).catch(function(err){
    console.log(err);
});


app.engine('hbs', exphbs({
    extname: 'hbs',
    defaultLayout: 'main'
}));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, '/public')));

app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//method-override middleware
app.use(methodOverride('_method'));

//express session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true

}));

//initializing session
app.use(passport.initialize());
app.use(passport.session());

//connect flash middleware
app.use(flash());

//global variables
app.use(function (req, res, next) {
    res.locals.msg_success = req.flash('msg_success');
    res.locals.msg_error = req.flash('msg_error');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

app.get('/', function (req, res) {

    res.render('index');

});



app.get('/about', function (req, res) {

    res.render('about');

});

//use routes

app.use('/ideas', ideas);
app.use('/users', users);

const port = process.env.PORT || 8000;

app.listen(port, function () {

    console.log('App running on port' + port);

});