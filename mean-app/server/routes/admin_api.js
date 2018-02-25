/*
Contains all API calls for admin.
*/

var express = require('express');
var router = express.Router();
var passport = require('passport');

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var xoauth2 = require('xoauth2');

var Admin = require('../models/admin.js');
var User = require('../models/user.js')
var Provider = require('../models/provider.js')



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
		to: receiver.email,
		subject: "Password reset",
		html: 'Ακολουθήστε το σύνδεσμο για να θέσετε νέο κωδικό https://localhost:3000/#/reset/'+receiver.id
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

function isAdmin(username){
	Admin.findOne({username:username}, function(err, status){
	console.log("isAdmin.status="+status)
	if (status){
		console.log('returning true')
		return true;
	}
    if (err){
    	console.log('returning false')
      return false;
    }
    console.log('returning true')
    return false;
  });
}

router.get('/isAdmin',function(req,res){
	Admin.findOne({username:req.user.username},function(err,status){
		if (err){
			console.log("ERROR")
			return res.status(500).json({
				err:err
			})
		}
		if (status){
			return res.status(200).json({
				status:status
			})
		}
	})
})

router.get('/all_users',function(req,res){
	console.log("req.user.username is:"+req.user.username)
	Admin.findOne({username:req.user.username}, function(err, status){
	if (status){
		console.log("finding all users to display")
		User.find({}).exec(function(err,users){
			if (err){
			return res.status(500).json({
	        err: err
	      	});
			}
			return res.status(200).json({
				"users":users
			});
		})
	}
	else{
		return res.status(403).json({
			"youare":"NOT ADMIN"
		});
	}
})
});

router.get('/all_providers',function(req,res){
	console.log("req.user.username is:"+req.user.username)
	Admin.findOne({username:req.user.username}, function(err, status){
	if (status){
		console.log("finding all users to display")
		Provider.find({}).exec(function(err,users){
			if (err){
			return res.status(500).json({
	        err: err
	      	});
			}
			return res.status(200).json({
				"providers":users
			});
		})
	}
	else{
		return res.status(403).json({
			"youare":"NOT ADMIN"
		});
	}
})
});

router.delete('/user/:uID',function(req,res){
	Admin.findOne({username:req.user.username}, function(err, status){
	if (status){
			console.log("deleting:"+req.params.uID)

			User.deleteOne({"_id":req.params.uID},function(eerr,sstatus){
				if(sstatus){
					console.log("sstatus:"+sstatus)
					return res.status(200).json({
					"sstatus":sstatus
			})
				}
				if(eerr){
					console.log("eerr:"+eerr)
				}
			})

			console.log("done")
		}
	else{
		return res.status(403).json({
			"youare":"NOT ADMIN"
		});
	}
})
})


router.post('/resetPassword/:uID',function(req,res){
	Admin.findOne({username:req.user.username},function(err,status){
		if (status){
			User.updateOne({"_id":req.params.uID},{$set:{"reset_password":'TRUE'}},function(errr,sstatus){
				if(status){

			User.findOne({"_id":req.params.uID},function(errr,doc){
				console.log("Found userID in resetPassword adminAPI")

				console.dir(doc)

				sendEmail(doc)
			})		
				}
			})
			
			
		}
	})
})

router.delete('/provider/:pID',function(req,res){
	Admin.findOne({username:req.user.username}, function(err, status){
	if (status){
			console.log("deleting:"+req.params.pID)

			Provider.deleteOne({"_id":req.params.pID},function(eerr,sstatus){
				if(sstatus){
					console.log("sstatus:"+sstatus)
					return res.status(200).json({
					"sstatus":sstatus
			})
				}
				if(eerr){
					console.log("eerr:"+eerr)
				}
			})

			console.log("done")
		}
	else{
		return res.status(403).json({
			"youare":"NOT ADMIN"
		});
	}
})
})

module.exports=router