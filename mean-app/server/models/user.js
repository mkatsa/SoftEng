// user model database
var mongoose = require('mongoose');
require('mongoose-type-email');
require('mongoose-double')(mongoose);
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');



var User = new Schema({
  username: {type: String, required: true, unique: true },						//unique username for each parent
  password: {type: String },									//password
  firstname: {type: String, required: true },									//firstname of parent
  lastname: {type: String, required: true },									//lastname of parent
  email: {type: mongoose.SchemaTypes.Email, required: true, unique: true },		//unique email address for each parent
  mobile: {type: Number, default: ''},
  loc: {																		//info about location
	  Street: {type: String, required: false},
	  Num: {type: Number, required: false},
	  Town: {type: String, required: false},
	  ZipCode: {type: Number, required: false},
	  coordinates:{
		type:[Schema.Types.Double], 	//[<longitude>,<latitude>]
		index: '2d'						//create the geospatial index
	  },
  },
  wallet: {								//wallet info about code of wallet and the remaining points
	  code: {type: Number},
	  points: { type: Number}
  },
  img: { data: Buffer, contentType: String, default: '' }		//not sure abbout that...
  events_bought: { type: [String]},
  events_interested: {type: [String]}
});

User.plugin(passportLocalMongoose);


module.exports = mongoose.model('users', User);