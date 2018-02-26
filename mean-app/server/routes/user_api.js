/*
Contains all API calls for a user.
*/

var express = require('express');
var router = express.Router();
var passport = require('passport');

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var xoauth2 = require('xoauth2');


var PDFDocument = require('pdfkit');
var fs = require('fs');

var User = require('../models/user.js');


//about pdf ticket creation. Found on http://pdfkit.org/index.html and http://www.codeblocq.com/2016/05/PDF-Generation-with-Node-JS/
//bug with greek characters. Idk how to fix it...

function createTicket(eventName, userName, ticketName, notickets){
	console.log("Creating Ticket")
	var doc = new PDFDocument;
	doc.pipe(fs.createWriteStream(ticketName));
	
	var txt = "This is your electronic ticket\nIn order to enter the event you need to show this ticket or a photocopy of it in the entrance of the event.\nThis is a "+notickets+" person ticket.You need to scan the barcode below in order to enter the event"
	// Set a title and pass the X and Y coordinates
	doc.fontSize(15).text('Electronic Ticket', 50, 50);
	// Set the paragraph width and align direction
	doc.text(txt, {
		width: 410,
		align: 'left'
	});

	doc.image('download.png', 50, 250, {width: 200});
	doc.end();
	console.log("Ticket Created Successfully")
}



//about autoemail
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

//about autoemail on registration
function sendEmail(receiver) {
	console.log("Sending registration mail")
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
			console.log('Registration mail sent: ' + info.response);
		}
	});	
}


//about autoemail on registration
function sendResetPassEmail(receiver) {
  console.log("Sending registration mail")
  var mailOptions = {
    from: "Heapsters Athens <heapsters@hotmail.com>",
    to: receiver.email,
    subject: "Αίτημα reset password",
    html: 'Ακολουθήστε το σύνδεσμο για να θέσετε νέο κωδικό https://localhost:3000/#/reset/'+receiver._id
    //add attachments too in the end
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Registration mail sent: ' + info.response);
    }
  }); 
}


//about autoemail on registration
function sendTicketviaEmail(receiver,eventName,attachment) {
	console.log("Sending ticket!!")
	console.log(receiver)
	console.log(eventName)
	console.log(attachment)
	var mailOptions = {
		from: "Heapsters Athens <heapsters@hotmail.com>",
		to: receiver,
		subject: "Ηλεκτρονικό Εισιτήριο για το event \""+eventName+"\"",
		html: 'Σας ευχαριστούμε που εμπιστευτήκατε την FunActivities για την ψυχαγωγία των παιδιών σας! Παρακάτω επισυνάπτεται το εισιτήριό σας για το event<br>Παρακαλείστε να προσκομίσετε το παρόν ηλεκτρονικό εισιτήριο ή φωτοτυπία αυτού κατά την άφιξή σας στην εκδήλωση! <br>Με εκτίμηση,<br>Heapsters Team',
		attachments: [{filename: attachment, path:attachment, contentType: 'application/pdf'}]
	};

	transporter.sendMail(mailOptions, function(error, info){
		if (error) {
			console.log(error);
		} else {
			console.log('Ticket sent: ' + info.response);
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

router.post('/reset_pass',function(req,res){
  User.findOne({'username':req.body.username},function(err,data){
    if (data){
      data.reset_password="TRUE";
      data.save();
      sendResetPassEmail(data);
    }
  })
})

router.post('/set_pass',function(req,res){

  User.findOne({'_id':req.body.uID},function(err,data){

    if (data){

      if (data.reset_password=="TRUE")
      {
        console.log("RESET PASSWORD WAS TRUE")
        data.reset_password="FALSE";
        data.setPassword(req.body.password,function(){

        data.save();
        res.status(200).json({message: 'password reset successful'});
      })
      }
      else{
        console.log("RESET PASSWORD WAS FALSE/nonexistant")
        res.status(500).json({err:'Not flagged for reset'})
      }
    }
    else{
      console.log("COULD NOT FIND USER")
      res.status(500).json({err:'Invalid user'})
    }

  })
})
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
    points: req.user.points,
    pointsSpent: req.user.pointsSpent,
    location: req.user.location
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


var x = 0;
router.post('/eventbought', function(req,res){
  console.log(req.user.username)
  console.log(req.body.cost)
  console.log(req.body.eventname)
  console.log(req.body.notickets)
  User.findOne({username:req.user.username}, function(err,doc){
      doc.points = doc.points - req.body.cost;
      doc.pointsSpent= doc.pointsSpent + req.body.cost;
      //doc.eventbought[0] = req.body.eventname;
      //doc.events_bought.push(req.body.eventname);
      doc.save();
    });
  //User.update({username:req.user.username},{ $push: {events_bought: req.body.eventname} });
  User.update({username:req.user.username},{$push: {events_bought: req.body.eventname}},function(err,num){if(err){console.log("gamw thn mana sou thn 3ekwliara")}});
  console.log(req.user.points)
  console.log(req.user.events_bought)
  
  
  console.log(req.user.email)
  
  var ticketname =  'ticket_'+x+'.pdf';
  x++;
  createTicket(req.body.eventname, req.user.username, ticketname, req.body.notickets);
  sendTicketviaEmail(req.user.email,req.body.eventname,ticketname);
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