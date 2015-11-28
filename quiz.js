var question = require('./models/questions');

quizMe =  function(message, username) {
  var response = "",
    idRegex = /#([0-9])*/g,
    icon = "http://theimpossiblequiz.org.uk/wp-content/uploads/2015/02/pa_quiz.png";
  if (message.indexOf('--help') > -1) {
    return {
      text: "Use 'QUIZME new question' to request a new question, this will return a question. You can then answer the question with 'QUIZME answer: ', and then your answer. You can request multiple choice options using --options, or a hint using --hint. If you forget what the question is you can get the current question using --currentquestion",
      attachments: [],
      username: 'QuizMe!',
      icon_url: icon
    }
  } else if (message.indexOf('new question') > -1) {
    return {
      text: 'New question requested',
      attachments: [],
      username: 'QuizMe!',
      icon_url: icon
    }
  } else if (message.indexOf('answer:') > -1) {
    var reqQuestionId = parseInt(message.match(idRegex)[0].substr(2));
    var reqAnswer = message.replace(idRegex, "").trim();
    if (reqQuestionId > -1 && reqQuestionId < questions.length) {
      if (questions[reqQuestionId].answer.toLowerCase() === reqAnswer.toLowerCase()) {
        response = "Your answer " + reqAnswer + " is Correct! Five form points! Get yourself a new question using 'QUIZME new question'.";
        icon = "http://www.clker.com/cliparts/7/y/R/Y/J/T/correct-mark-hi.png";
      } else {
        response = "NOPE! Your answer " + reqAnswer + " is wrong!";
        icon = "http://cdn2.hellogiggles.com/wp-content/uploads/2014/05/03/Mr-Wrongpp_w327_h345.jpg";
      }
    } else {
      response = "Couldn't find a question / answer from the ID #" + String(reqQuestionId) + ". Retry or complain at Monty";
    }
  } else {
    response = "No command recognised, use QUIZME --help for help.";
  }
}

module.exports = quizMe;
