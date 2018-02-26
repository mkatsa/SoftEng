// administrator model database

var mongoose = require('mongoose');
require('mongoose-double')(mongoose);
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');



var Event = new Schema({
	eventname: {type: String, required: true},			//name does not have to be unique
  	/*loc: {								//info about location
	  Street: {type: String, required: true},
	  Num: {type: Number, required: true},
	  Town: {type: String, required: true},
	  ZipCode: {type: Number, required: true},
	  coordinates:{
		type:[Schema.Types.Double], 	//[<longitude>,<latitude>]
		index: '2d'						//create the geospatial index
	  }
	},
	*/
	location: {},
	category: {type: String, required: true},
	price: {type: String, required: true, /*min: 0*/},			//we should see how we will store the prices
	picture: {type: String, required: true},		//not sure about that...
	description: { type: String, default:''},			//we ask for a short description of the event
	//users_interested: {type:[String]},
	//date: {type: String, default: Date.now},
	start_time: {type: String, required: true},
    end_time: {type: String,  required: true},
	minage: {type: String, default: '0'},
	maxage: {type: String, default: '18'},
	tickets: {type: Number, required: true},
	//users_interested: {type:[String]},
  	//users_bought: {type:[String]},
  	//users_seen: {type:[String]}
  	provider:{type: String, required: true}

});

//Event.plugin(passportLocalMongoose);
module.exports = mongoose.model('event', Event);