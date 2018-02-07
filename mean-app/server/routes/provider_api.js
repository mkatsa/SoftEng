/*
Contains all API calls for providers.
*/

var express = require('express');
var router = express.Router();
var passport = require('passport');

var Provider = require('../models/provider.js');		//connection to database


//Handle provider registration
router.post('/register_provider', function(req, res) {
  
  //passport-local-mongoose function register. Get input params from request
  Provider.register(new Provider({ 
    usertype:"provider",
    firstname: req.body.firstname,					// first name of the provider
    lastname:req.body.lastname,						// last name of the provider
    username: req.body.username,					// user name of the provider - user names must be unique as you can see on provider.js
    email:req.body.email,							// email of the provider - email must be unique as you can see on provider.js
	companyname: req.body.companyname,				// company name - company name must be unique as you can see on provider.js
	TaxID: req.body.TaxID							// Tax ID - tax id must be unique as you can see on provider.js
  }), req.body.password, function(err, account) {
    console.log("IN regprov callback:");
    console.log("ERR:"+err);
    console.log("account"+account);
    //if ther is an error occured, respond error  
    if (err) {
      console.log("REGPROVERR:"+err);
      return res.status(500).json({
        err: err
      });
    }
   
    //if not error, authenticate provider
    
    passport.authenticate('provider')(req, res, function () {
      return res.status(200).json({
        status: 'Registration successful!'
      });
    });
    
  });
});


//Handle provider login
router.post('/login', function(req, res, next) {
  //Try to auhtenticate provider
  passport.authenticate('provider', function(err, provider, info) {
    if (err) {
      return next(err);
    }
    if (!provider) {
      return res.status(401).json({
        err: info
      });
    }
    //If no errors, call logIn from passport
    req.logIn(provider, function(err) {
      if (err) {
        return res.status(500).json({
          err: 'Could not log in provider'
        });
      }
      console.log("SUCESSFUL PROVIDER LOGIN")

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

//Handle status. Returns {"status":"true"} if provider is logged in
/*router.get('/status', function(req, res) {
  if (!req.isAuthenticated()) {									//ATTENTION: this has nothing to do with provider's authentication from admin!!!!!
    return res.status(200).json({
      status: false
    });
  }
  res.status(200).json({
    status: true
  });
});
*/


//Returns provider's username {"username":"example_username"}
router.get('/userName',function(req,res){
  //If provider is authenticated, return their username
  if (req.isAuthenticated()){									//ATTENTION: this has nothing to do with provder's authentication from admin!!!!!
  //console.log("Request for company name from");
  //console.dir(req);
  
  return res.status(200).json({
      username: req.user.username
    });
  }
  //If not, return this for debugging (this should never be returned)
  else{
  res.status(200).json({
    username:"Default Username"
  });
  }
});





//Returns all data of provider
router.get('/get_all',function(req,res){
  //If provider is authenticated, return their username
  if (req.isAuthenticated()){									//ATTENTION: this has nothing to do with provder's authentication from admin!!!!!
  //console.log("Request for company name from");
  //console.dir(req);
  return res.status(200).json({
      username: req.user.username,
	  firstname: req.user.firstname,
	  lastname: req.user.lastname,
	  companyname: req.user.companyname,
	  email: req.user.email
    });
  }
  //If not, return this for debugging (this should never be returned)
  else{
  res.status(200).json({
    username:"Default Username",
	firstname:"Default Firstname",
	lastname:"Default Lastname",
	companyname:"Default Companyname",
	email:"Default Email"
  });
  }
});



module.exports = router;