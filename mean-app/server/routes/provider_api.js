/*
Contains all API calls for providers.
*/

var express = require('express');
var router = express.Router();
var passport = require('passport');


var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var xoauth2 = require('xoauth2');


var Provider = require('../models/provider.js');		//connection to database
var Event = require('../models/event.js');


var transporter = nodemailer.createTransport({
    service: "Gmail", // hostname
    //secureConnection: false, // TLS requires secureConnection to be false
    //port: 587, // port for secure SMTP		
	auth: {
		user: "heapstersmail@gmail.com",
		pass: "FiS2zi92"
	},
    //tls: {
      //  ciphers:'SSLv3'
    //}
});


function sendEmail(receiver) {
	console.log("I am going to send a fucking mail now!!")
	var mailOptions = {
		from: "Heapsters Athens <heapsters@hotmail.com>",
		to: receiver,
		subject: "Καλώς Ήρθατε στο FunActivities",
		html: '<b>Καλως ήρθατε στη διαδικτυακή μας πλατφόρμα!! </b><br> Το e-mail που λαμβάνεται είναι αναγνωριστικό της εγγραφής σας στην πλατφόρμα μας <br>Σας ευχαριστούμε που επιλέξατε εμάς για να προωθήσετε τις δραστηριότητες που παρέχετε!<br> <p> Μεταβείτε στην <a href="https://localhost:3000/#/login">login</a> σελίδα μας για να χρησιμοποιείσετε τις υπηρεσίες μας</p><br>Με εκτίμηση,<br>Heapsters Team</a> '
		//add attachments too in the end
	};

	transporter.sendMail(mailOptions, function(error, info){
		if (error) {
			console.log(error);
		} else {
			console.log('Email sent: ' + info.response);
		}
	});	
}

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
	  sendEmail(req.body.email);
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

//Handle history
router.get('/getHistory/:id?', function(req, res) {
   Event.find({provider:req.params.id}, function(err,events){
      
      if (err) res.send(err);

      res.json(events);
    }).sort({end_time : 1});
});


//Handle status. Returns {"status":"true"} if provider is logged in
router.get('/status', function(req, res) {
  if (!req.isAuthenticated()) {									//ATTENTION: this has nothing to do with provider's authentication from admin!!!!!
    return res.status(200).json({
      status: false
    });
  }
  res.status(200).json({
    status: true
  });
});


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
	  email: req.user.email,
	  phone: req.user.phone,
	  TaxID: req.user.TaxID,
    description: req.user.description,
    location: req.user.location
    });
  }
  //If not, return this for debugging (this should never be returned)
  else{
  res.status(200).json({
    username:"Default Username",
	firstname:"Default Firstname",
	lastname:"Default Lastname",
	companyname:"Default Companyname",
	email:"Default Email",
	phone:"Default Phone",
	TaxID:"Default ID",
  description:"Default description",
  location:{}
  });
  }
});


router.put('/update_provider', function(req,res){

	
	var target = req.body.value;
	var field = req.body.what;
	var obj ={};
	obj[field]=target;
	

	console.log("I am on update_provider")
	console.log(req.body.username)
	console.log(req.body.what)
	console.log(req.body.value)
	
	Provider.updateOne({"username": req.body.username}, {$set: obj} ,					//{$set: {"email": req.body.value}}
		function(err, status) {
        if (err) return res.json(err);
        return res.json(status);			//status in fact is data, just for debugging
	})
});




router.get('/get_all_by_username/:username?',function(req,res){
  
  //console.log("Request for company name from");
  console.dir(req.params.username)
  
  Provider.findOne({username:req.params.username}, function(err, status){
    if (err)
      res.send(err);
    res.json(status);
  });
});






module.exports = router;