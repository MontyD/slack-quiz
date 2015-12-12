var mongoose = require('mongoose');
var question = require('./questions');
var user = require('./users');

exports.questionById = function(req, res, next) {
  if (mongoose.Types.ObjectId.isValid(req.body._id)) {
    question.findOne({
      '_id': req.body._id
    }, 'question hint option1 option2 option3 answer', function(err, data) {
      if (err) {
        res.json({
          'error': true,
          'errorDescription': err
        });
      } else {
        if (data) {
          req.body.question = data.question;
          req.body.hint = data.hint;
          req.body.option1 = data.option1;
          req.body.option2 = data.option2;
          req.body.option3 = data.option3;
          req.body.answer = data.answer;
          next();
        } else {
          res.json({
            'error': true,
            'errorDescription': 'Could not find question! Bother.'
          });
        }
      }
    });
  } else {
    res.json({
      'error': true,
      'errorDescription': 'Not a valid questionID! Bother.'
    });
  }
}
exports.newQuestion = function(req, res) {
  var newQuestion = question({
    question: req.body.question,
    answer: req.body.answer,
    option1: req.body.option1,
    option2: req.body.option2,
    option3: req.body.option3,
    hint: req.body.hint,
    completed: false,
    currentQuestion: false
  });
  newQuestion.save(function(err) {
    if (err) {
      res.json({
        'error': true,
        'errorDescription': err
      });
    } else {
      res.json(newQuestion);
    }
  });
}
