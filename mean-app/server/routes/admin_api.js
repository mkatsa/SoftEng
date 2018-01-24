/*
Contains all API calls for admin.
*/

var express = require('express');
var router = express.Router();
var passport = require('passport');

var Admin = require('../models/admin.js');
var User = require('../models/user.js')



router.get('/all_users',function(req,res){
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
})

module.exports=router