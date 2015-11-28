var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userScheme = new Schema({
  username: { type: String, required: true, unique: true }
});

var user = mongoose.model('User', userScheme);

module.exports = question;
