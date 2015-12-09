var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userScheme = new Schema({
  username: { type: String, required: true, unique: true },
  correct: { type: Number },
  incorrect: { type: Number }
});

var user = mongoose.model('User', userScheme);

module.exports = user;
