// dependencies
var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var mongoose = require('mongoose');
var hash = require('bcrypt-nodejs');
var path = require('path');
var passport = require('passport');
var localStrategy = require('passport-local' ).Strategy;

// mongoose
mongoose.connect('mongodb://localhost/mean-auth');

// user schema/model
var User = require('./models/user.js');

// admin schema/model
var Admin = require('./models/admin.js');

// provider schema/model
var Provider = require('./models/provider.js');

// event schema/model
var Event = require('./models/event.js');

// create instance of express
var app = express();

// required routes
var user_routes = require('./routes/user_api.js');
var admin_routes= require('./routes/admin_api.js');
var provider_routes= require('./routes/provider_api.js');

// define middleware
app.use(express.static(path.join(__dirname, '../client')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

// configure passport
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// routes
app.use('/user/', user_routes);
app.use('/admin/',admin_routes);
app.use('/provider/',provider_routes);

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../client', 'index.html'));
});


app.get('/yo',function(req,res){
  //debug('dYO')
  console.log('cYO')
});


//Send files if requested
app.get('/assets/:filename',function(req,res){
  console.log('SENDING FILE:')
  console.log(req.params.filename)
  res.sendFile(path.join(__dirname,'../client/assets',req.params.filename))
});

// error hndlers
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res) {
  res.status(err.status || 500);
  res.end(JSON.stringify({
    message: err.message,
    error: {}
  }));
});

module.exports = app;
