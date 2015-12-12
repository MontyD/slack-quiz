var question = require('./models/questions');
var user = require('./models/users');

var quizMe = function(message, username, res) {
  if (message.indexOf('--help') > -1) {
    res.json({
      text: "Use 'Quiz new question' to request a new question, this will return a question. You can then answer the question using 'Quiz ' followed by your answer. You can request multiple choice options using --options, or a hint using --hint. If you forget what the question is you can get the current question using --currentquestion",
      attachments: [],
      username: 'QuizMe!',
      icon_url: "http://theimpossiblequiz.org.uk/wp-content/uploads/2015/02/pa_quiz.png"
    });
  } else if (message.indexOf('new question') > -1) {
    question.update({
      'currentQuestion': true
    }, {
      $set: {
        'currentQuestion': false
      }
    }, {
      multi: true
    }).exec();
    question.randomQuestion(function(err, data) {
      if (data) {
        data.currentQuestion = true;
        data.save();
        res.json({
          text: data.question,
          attachments: [],
          username: 'QuizMe!',
          icon_url: "http://theimpossiblequiz.org.uk/wp-content/uploads/2015/02/pa_quiz.png"
        });
      } else {
        res.json({
          text: "All questions have been completed.",
          attachments: [],
          username: 'QuizMe!',
          icon_url: "http://theimpossiblequiz.org.uk/wp-content/uploads/2015/02/pa_quiz.png"
        });
      }
    });
  } else if (message.indexOf('--currentquestion') > -1) {
    question.findOne({
      'currentQuestion': true,
      'completed': false
    }, 'question', function(err, data) {
      if (data) {
        res.json({
          text: data.question,
          attachments: [],
          username: 'QuizMe!',
          icon_url: "http://theimpossiblequiz.org.uk/wp-content/uploads/2015/02/pa_quiz.png"
        });
      } else {
        res.json({
          text: "There is currently no open question, request a new question using 'Quiz new question'.",
          attachments: [],
          username: 'QuizMe!',
          icon_url: "http://theimpossiblequiz.org.uk/wp-content/uploads/2015/02/pa_quiz.png"
        });
      }
    });
  } else if (message.indexOf('--hint') > -1) {
    question.findOne({
      'currentQuestion': true,
      'completed': false
    }, 'hint', function(err, data) {
      if (data) {
        res.json({
          text: "Here's your hint: " + data.hint,
          attachments: [],
          username: 'QuizMe!',
          icon_url: "http://theimpossiblequiz.org.uk/wp-content/uploads/2015/02/pa_quiz.png"
        });
      } else {
        res.json({
          text: "There is currently no open question, request a new question using 'Quiz new question'.",
          attachments: [],
          username: 'QuizMe!',
          icon_url: "http://theimpossiblequiz.org.uk/wp-content/uploads/2015/02/pa_quiz.png"
        });
      }
    });
  } else if (message.indexOf('--options') > -1) {
    question.findOne({
      'currentQuestion': true,
      'completed': false
    }, 'question answer option1 option2 option3', function(err, data) {
      if (data) {
        var tempAttach = [data.answer, data.option1, data.option2, data.option3];
        for (var i = tempAttach.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var temp = tempAttach[i];
          tempAttach[i] = tempAttach[j];
          tempAttach[j] = temp;
        }
        res.json({
          text: data.question,
          attachments: [{
            'text': tempAttach[0],
            'color': '#01579B'
          }, {
            'text': tempAttach[1],
            'color': '#D50000'
          }, {
            'text': tempAttach[2],
            'color': '#004D40'
          }, {
            'text': tempAttach[3],
            'color': '#FFAB00'
          }],
          username: 'QuizMe!',
          icon_url: "http://theimpossiblequiz.org.uk/wp-content/uploads/2015/02/pa_quiz.png"
        });
      } else {
        res.json({
          text: "There is currently no open question, request a new question using 'Quiz new question'.",
          attachments: [],
          username: 'QuizMe!',
          icon_url: "http://theimpossiblequiz.org.uk/wp-content/uploads/2015/02/pa_quiz.png"
        });
      }
    });
  } else {
    question.findOne({
      'currentQuestion': true,
      'completed': false
    }, 'answer', function(err, data) {
      if (data) {
        if (message.toLowerCase().substr(0, message.length - 1).trim() === data.answer.toLowerCase().substr(0, data.answer.length - 1).trim()) {
          question.update({
            'currentQuestion': true
          }, {
            $set: {
              'currentQuestion': false,
              'completed': true,
              'answeredby': username
            }
          }, {
            multi: false
          }).exec();
          updateUser(username, true);
          res.json({
            text: "Your answer " + message.trim() + " is Correct! Five form points! Get yourself a new question using 'Quiz new question'.",
            attachments: [],
            username: 'QuizMe!',
            icon_url: "http://www.clker.com/cliparts/7/y/R/Y/J/T/correct-mark-hi.png"
          });
        } else {
          updateUser(username, false);
          res.json({
            text: "NOPE! Your answer " + message + " is wrong!",
            attachments: [],
            username: 'QuizMe!',
            icon_url: "http://cdn2.hellogiggles.com/wp-content/uploads/2014/05/03/Mr-Wrongpp_w327_h345.jpg"
          });
        }
      } else {
        res.json({
          text: "There is currently no open question, request a new question using 'Quiz new question'.",
          attachments: [],
          username: 'QuizMe!',
          icon_url: "http://theimpossiblequiz.org.uk/wp-content/uploads/2015/02/pa_quiz.png"
        });
      }
    });
  }
  var updateUser = function(reqUsername, answer) {
    user.findOne({
      'username': reqUsername
    }, 'username', function(err, data) {
      if (err) console.log(err);
      if (data && data.username !== 'undefined' && data.username !== '') {
        if (answer) {
          user.update({
            'username': data.username
          }, {
            $inc: {
              'correct': 1
            }
          }).exec();
        } else {
          user.update({
            'username': data.username
          }, {
            $inc: {
              'incorrect': 1
            }
          }).exec();
        }
      } else {
        var newUser = user({
          username: reqUsername
        });
        newUser.save(function(err) {
          if (err) console.log(err);
          if (answer) {
            user.update({
              'username': reqUsername
            }, {
              $inc: {
                'correct': 1
              }
            }).exec();
          } else {
            user.update({
              'username': reqUsername
            }, {
              $inc: {
                'incorrect': 1
              }
            }).exec();
          }
        });
      }
    });
  }
}

module.exports = quizMe;
