// provider's model database
var mongoose = require('mongoose');
require('mongoose-type-email');
require('mongoose-double')(mongoose);
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');


var Provider = new Schema({
  firstname: {type: String, required: true}, 									//first name of the provider
  lastname: {type: String, required: true},  									//last name of the provider
  companyname: {type: String, required: true, unique: true}, 					//we cannot have two companies with the exact same name
  username: {type: String, required: true, unique: true},						//unique username for each provider
  password: {type: String},	//required:true on password throws Error 500. I don't know why		//password of the provider
  email: {type: mongoose.SchemaTypes.Email, required: true, unique: true},		//email of the provider
  phone: {type: String },	 /*required: true*/								//phone of the provider
  TaxID: {type: String, unique: true},											//Tax ID of the provider
  authenticated:{type: Boolean},												//authenticated field is true when the provider is verified from the admin.
  events:{type: [String]}, 														//contains the id of each event
  usertype:{type:String,required:true}                						//Constant = "provider". 
});

Provider.plugin(passportLocalMongoose);


module.exports = mongoose.model('providers', Provider);