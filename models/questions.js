var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var question = new Schema({
  question: { type: String, required: true, unique: true },
  answer: { type: String, required: true },
  option1: { type: String, required: true },
  option2: { type: String, required: true },
  option3: { type: String, required: true },
  option4: { type: String, required: true },
  hint: { type: String, required: true },
  updated_at : Date,
  created_at : Date,
  intendedFor: String,
  answeredBy: String,
  currentQuestion: Boolean
});
question.pre('save', function(next) {
  var currentDate = new Date();
  this.updated_at = currentDate;
  if (!this.created_at)
    this.created_at = currentDate;
  next();
});

var question = mongoose.model('Question', question);

module.exports = question;
