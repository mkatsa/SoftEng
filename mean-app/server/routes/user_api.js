/*
Contains all API calls for a user.
*/

var express = require('express');
var router = express.Router();
var passport = require('passport');

var User = require('../models/user.js');


//Handle user registration
router.post('/register', function(req, res) {
  //passport-local-mongoose function register. Get input params from request
  User.register(new User({ 
    usertype:"user",
    username: req.body.username,
    email:req.body.email,
    firstname:req.body.firstname,
    lastname:req.body.lastname 
  }), req.body.password, function(err, account) {
    //if error respond error  
    if (err) {
      return res.status(500).json({
        err: err
      });
    }
    //if not error, authenticate user
    passport.authenticate('local')(req, res, function () {
      return res.status(200).json({
        status: 'Registration successful!'
      });
    });
  });
});


//Handle user login
router.post('/login', function(req, res, next) {
  //Try to auhtenticate user
  passport.authenticate('user', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    //If no errors, call logIn from passport
    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({
          err: 'Could not log in user'
        });
      }
      res.status(200).json({
        status: 'Login successful!'
      });
    });
  })(req, res, next);
});


//Handle logout
router.get('/logout', function(req, res) {
  //Call logout from passport
  req.logout();
  res.status(200).json({
    status: 'Bye!'
  });
});

//Handle status. Returns {"status":"true"} if user is logged in
router.get('/status', function(req, res) {
  if (!req.isAuthenticated('user')&&(!req.isAuthenticated('provider'))&&(!req.isAuthenticated())) {
    console.log("IS NOT AUTHENTICATED")
    return res.status(200).json({
      status: false
    });
  }
  console.log("IS authenticated")
  return res.status(200).json({
    status: true
  });
});


//Returns user's username {"username":"example_username"}
router.get('/userName',function(req,res){
  //If user is authenticated, return their username
  if (req.isAuthenticated()){
  return res.status(200).json({
      username: req.user.username
    });
  }
  //If not, return this for debugging (this should never be returned)
  else{
  res.status(200).json({
    username:"server_anonymous"
  });
  }
});




//Returns all data of user
router.get('/get_all',function(req,res){
  //If user is authenticated, return their username
  if (req.isAuthenticated()){									//ATTENTION: this has nothing to do with user's authentication from admin!!!!!
  //console.log("Request for company name from");
  //console.dir(req);
  return res.status(200).json({
      username: req.user.username,
	  firstname: req.user.firstname,
	  lastname: req.user.lastname,
	  email: req.user.email,
	  mobile: req.user.mobile
    });
  }
  //If not, return this for debugging (this should never be returned)
  else{
  res.status(200).json({
    username:"Default Username",
	firstname:"Default Firstname",
	lastname:"Default Lastname",
	email:"Default Email",
	mobile:"Default mobile"
  });
  }
});







module.exports = router;