// administrator model database
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');


var Event = new Schema({
	eventname: {type: String, required: true},
  	loc: {																		//info about location
	  Street: {type: String, required: true},
	  Num: {type: Number, required: true},
	  Town: {type: String, required: true},
	  ZipCode: {type: Number, required: true},
	  coordinates:{
		type:[Schema.Types.Double], 	//[<longitude>,<latitude>]
		index: '2d'						//create the geospatial index
	  }
	},
	price: {type: Number, required: true, min: 0},
	img: {data: Buffer, contentType: String, default: ''},		//not sure abbout that...
	description: { type: String, default:''},
	date: {type: Date, default: Date.now},
	minage: {type: Number, default: '0'},
	maxage: {type: Number, default: '18'},
	time: { type: String}

});

Event.plugin(passportLocalMongoose);


module.exports = mongoose.model('events', Event);