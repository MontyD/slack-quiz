var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userScheme = new Schema({
  username: { type: String, required: true, unique: true },
  correct: Number,
  incorrect: Number
});

var user = mongoose.model('user', userScheme);

module.exports = user;
