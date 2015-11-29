var question = require('./models/questions');

quizMe = function(message, username) {
  var resText = "",
    resAttach = [],
    resIcon = "http://theimpossiblequiz.org.uk/wp-content/uploads/2015/02/pa_quiz.png";

  if (message.indexOf('--help') > -1) {
    resText = "Use 'QUIZME new question' to request a new question, this will return a question. You can then answer the question using 'QUIZME ' followed by your answer. You can request multiple choice options using --options (this will make the question only worth half points), or a hint using --hint (this will make the question only worth 3/4 points). If you forget what the question is you can get the current question using --currentquestion";
  } else if (message.indexOf('new question') > -1) {
    var reqNewQuestion = '';
    console.log('new question');
    question.update({ currentQuestion: true }, { $set: { currentQuestion: false } }, { multi: true }).exec();
    question.random(function(err, data) {
      data.currentQuestion = true;
      data.save();
      console.log(data.question);
      reqNewQuestion = data.question;
      console.log('reqNewQuetion');
    });
    resText = reqNewQuetion;
  } else {
    question.findOne({ 'currentQuestion': true }, 'answer', function(err, data) {
      if (data) {
        if (message.toLowerCase().substr(0, message.length -1).trim() === data.answer.toLowerCase().substr(0, data.answer.length -1).trim()) {
          resText = "Your answer " + message.trim() + " is Correct! Five form points! Get yourself a new question using 'QUIZME new question'.";
          icon = "http://www.clker.com/cliparts/7/y/R/Y/J/T/correct-mark-hi.png";
        } else {
          resText = "NOPE! Your answer " + message + " is wrong!";
          icon = "http://cdn2.hellogiggles.com/wp-content/uploads/2014/05/03/Mr-Wrongpp_w327_h345.jpg";
        }
      } else {
        resText = "There is currently no open question, request a new question using 'QUIZME new question'.";
      }
    });
  }
  return {
    text: reqNewQuestion,
    attachments: resAttach,
    username: 'QuizMe!',
    icon_url: resIcon
  }
}

module.exports = quizMe;
