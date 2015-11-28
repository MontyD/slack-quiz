var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var questionSchema = new Schema({
  question: { type: String, required: true, unique: true },
  answer: { type: String, required: true },
  option1: { type: String, required: true },
  option2: { type: String, required: true },
  option3: { type: String, required: true },
  option4: { type: String, required: true },
  hint: { type: String, required: true },
  intendedFor: String,
  answeredBy: String,
  currentQuestion: Boolean
})

var question = mongoose.model('Question', questionSchema);

module.exports = question;
