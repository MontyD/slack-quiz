var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var questionSchema = new Schema({
  question: { type: String, required: true, unique: true },
  answer: { type: String, required: true },
  option1: { type: String, required: true },
  option2: { type: String, required: true },
  option3: { type: String, required: true },
  hint: { type: String, required: true },
  updated_at : Date,
  created_at : Date,
  answeredBy: String,
  completed: Boolean,
  currentQuestion: Boolean
});
questionSchema.pre('save', function(next) {
  var currentDate = new Date();
  this.updated_at = currentDate;
  if (!this.created_at) {
    this.created_at = currentDate;
  }
  if (!this.answeredBy) {
    this.answeredBy = '';
  }
  next();
});
questionSchema.statics.randomQuestion = function(callback) {
  this.where('completed', false).count(function(err, count) {
    if (err) {
      return callback(err);
    }
    var rand = Math.floor(Math.random() * count);
    this.findOne({ 'completed': false }).skip(rand).exec(callback);
  }.bind(this));
};

var question = mongoose.model('Question', questionSchema);

module.exports = question;
