// administrator model database
var mongoose = require('mongoose');
require('mongoose-type-email');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');


var Admin = new Schema({
  username: {type: String, required: true, unique: true },
});

Admin.plugin(passportLocalMongoose);


module.exports = mongoose.model('admins', Admin);