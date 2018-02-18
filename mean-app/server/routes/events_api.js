/*
Contains all API calls for an event.
*/
var express = require('express');
var router = express.Router();
var passport = require('passport');
var Event = require('../models/event.js');


//handle user search
/*router.get('/findEvents',function(req,res){
   Event.find(function (err, events) {
      if (err)
        res.send(err);
 
      res.json(events);
    });
})*/

//handle provider create event
//todo
router.post('/createEvent',function(req,res){


	Event.insertOne({
		eventname: req.body.eventname,
		price: req.body.price,
		description: req.body.description,
		minage: req.body.minage,
		maxage: req.body.maxage
	});
})


module.exports = router;