/*
Contains all API calls for a user.
*/

var express = require('express');
var router = express.Router();
var passport = require('passport');

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var xoauth2 = require('xoauth2');


var User = require('../models/user.js');





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
		html: '<b>Καλως ήρθατε στη διαδικτυακή μας πλατφόρμα!! </b><br> Το e-mail που λαμβάνεται είναι αναγνωριστικό της εγγραφής σας στην πλατφόρμα μας <br>Σας ευχαριστούμε που επιλέξατε εμάς για να βρείτε τις καλύτερες δραστηριότητες για τα παιδιά σας!<br> <p> Μεταβείτε στην <a href="https://localhost:3000/#/login">login</a> σελίδα μας για να χρησιμοποιείσετε τις υπηρεσίες μας</p><br>Με εκτίμηση,<br>Heapsters Team</a> '
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
		sendEmail(req.body.email);								//send the email in case of successful registration
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

router.post('/transfer', function(req, res){
    //console.log(req.body.amount)
    console.log(req.user.username)
    var bal = parseInt(req.body.amount);
    console.log(bal)
    User.findOne({username:req.user.username}, function(err,doc){
      doc.points = bal + doc.points;
      doc.save();
    });
    console.log(req.user.points)

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
      status: false,
	  isProvider: false
    });
  }
  if (( req.isAuthenticated('provider')||req.isAuthenticated('user') )&&req.isAuthenticated()) { 
	  if (req.user.usertype == 'user'){
		return res.status(200).json({
			status: true,
			isProvider: false
		})
	  }
	  else {
		return res.status(200).json({
			status: true,
			isProvider: true
		})
	  }
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
  if (req.isAuthenticated()){                 //ATTENTION: this has nothing to do with user's authentication from admin!!!!!
  //console.log("Request for company name from");
  //console.dir(req);
  return res.status(200).json({
    username: req.user.username,
    firstname: req.user.firstname,
    lastname: req.user.lastname,
    email: req.user.email,
    mobile: req.user.mobile,
    points : req.user.points
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

router.post('/eventbought', function(req,res){
  console.log(req.user.username)
  console.log(req.body.cost)
  console.log(req.body.eventname)
  User.findOne({username:req.user.username}, function(err,doc){
      doc.points = doc.points - req.body.cost;
      //doc.eventbought[0] = req.body.eventname;
      //doc.events_bought.push(req.body.eventname);
      doc.save();
    });
  //User.update({username:req.user.username},{ $push: {events_bought: req.body.eventname} });
  User.update({username:req.user.username},{$push: {events_bought: req.body.eventname}},function(err,num){if(err){console.log("gamw thn mana sou thn 3ekwliara")}});
  console.log(req.user.points)
  console.log(req.user.events_bought)
})



router.put('/update_parent', function(req,res){

	var target = req.body.value;
	var field = req.body.what;
	var obj ={};
	obj[field]=target;
	

	console.log("I am on update_provider")
	console.log(req.body.username)
	console.log(req.body.what)
	console.log(req.body.value)
	
	User.updateOne({"username": req.body.username}, {$set: obj} ,					//{$set: {"email": req.body.value}}
		function(err, status) {
        if (err) return res.json(err);
        return res.json(status);			//status in fact is data, just for debugging
	})
});

router.get('/userLocation',function(req,res){
  //If user is authenticated, return their location
  if (req.isAuthenticated()){
  return res.status(200).json({
      userLocation: req.user.location
    });
  console.log(req.user.username)
  console.log(req.user.location)
  }
  //If not, return this for debugging (this should never be returned)
  else{
  res.status(200).json({
    username:"server_anonymous"
  });
  }
});

//update user location
router.post('/locationUpdate', function(req, res){
  console.log(req.body.location)
  console.log(req.user.username)
  User.findOne({username:req.user.username}, function(err,doc){
    doc.location = req.body.location;
    doc.save();
  });
  console.log(req.user.location)

  });



module.exports = router;