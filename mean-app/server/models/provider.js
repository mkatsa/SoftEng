// administrator model database
var mongoose = require('mongoose');
require('mongoose-type-email');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');


var Provider = new Schema({
  firstname: {type: String, required: true},
  lastname: {type: String, required: true},
  companyname: {type: String, required: true, unique: true}, 	//we cannot have two companies with the exact same name
  username: {type: String, required: true, unique: true},	//unique username for each providers
  password: {type: String, required: true},
  email: {type: mongoose.SchemaTypes.Email, required: true, unique: true},
  phone: {type: Number, required: true},
  TaxID: {type: String},
  authenticated:{type: Boolean},
  events:{type: [String]}  //contains the id of each event
});

Provider.plugin(passportLocalMongoose);


module.exports = mongoose.model('providers', Provider);