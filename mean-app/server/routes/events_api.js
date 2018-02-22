/*
Contains all API calls for an event.
*/
var express = require('express');
var router = express.Router();
var passport = require('passport');
var Event = require('../models/event.js');


//handle user search
router.get('/findEvents',function(req,res){
   Event.find(function (err, events) {
      if (err)
        res.send(err);
 
      res.json(events);
    });
})	

//POST message for event creation, not all necessairy data included yet
router.post("/createEvent", function(req, res) {  
    var ev = new Event({
        eventname: req.body.eventname,
        category: req.body.category,
		price: req.body.price,
		description: req.body.description,
		minage: req.body.minage,
		maxage: req.body.maxage,
    provider:req.body.provider,
    location:req.body.location
    });

    ev.save(function(err, status) {
        if (err) return res.json(err);
        return res.json(status);			//status in fact is data, just for debugging
    });
})

//handle user single event click
router.get("/singleEvent/:id?", function(req, res) {  
    Event.findById(req.params.id, function(err, event){
    if (err)
      res.send(err);
    res.json(event);
  });
})


module.exports = router;