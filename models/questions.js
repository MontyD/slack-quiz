var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var question = new Schema({
  question: { type: String, required: true, unique: true },
  answer: { type: String, required: true },
  option1: { type: String, required: true },
  option2: { type: String, required: true },
  option3: { type: String, required: true },
  hint: { type: String, required: true },
  updated_at : Date,
  created_at : Date,
  intendedFor: String,
  answeredBy: String,
  completed: Boolean,
  currentQuestion: Boolean
});
question.pre('save', function(next) {
  var currentDate = new Date();
  this.updated_at = currentDate;
  if (!this.created_at)
    this.created_at = currentDate;
  next();
});
question.statics.random = function(callback) {
  this.count(function(err, count) {
    if (err) {
      return callback(err);
    }
    var rand = Math.floor(Math.random() * count);
    this.findOne().skip(rand).exec(callback);
  }.bind(this));
};

var question = mongoose.model('Question', question);

module.exports = question;
