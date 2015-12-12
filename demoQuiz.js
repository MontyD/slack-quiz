var question = require('./models/questions');

var demoQuiz = function(message, reqObject, res) {
  if (message.indexOf('--help') > -1) {
    res.json({
      text: "Use 'QUIZME new question' to request a new question, this will return a question. You can then answer the question using 'QUIZME ' followed by your answer. You can request multiple choice options using --options, or a hint using --hint."
    });
  } else if (message.indexOf('new question') > -1) {
    res.json({
      text: reqObject.question
    });
  } else if (message.indexOf('--options') > -1) {
    var tempAttach = [reqObject.answer, reqObject.option1, reqObject.option2, reqObject.option3];
    for (var i = tempAttach.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = tempAttach[i];
      tempAttach[i] = tempAttach[j];
      tempAttach[j] = temp;
    }
    res.json({
      text: data.question + " 1. " + tempAttach[0] + " 2. " + tempAttach[1] + ' 3. ' + tempAttach[2] + ' 4. ' + tempAttach[3]
    });
  } else if (message.indexOf('--hint') > -1) {
    res.json({
      text: "Here's your hint: " + reqObject.hint
    });
  } else {
    if (message.toLowerCase().substr(0, message.length - 1).trim() === reqObject.answer.toLowerCase().substr(0, reqObject.answer.length - 1).trim()) {
      res.json({
        text: "Your answer " + message.trim() + " is Correct!",
        correct: true
      });
    } else {
      res.json({
        text: "NOPE! Your answer " + message + " is wrong!"
      });
    }
  }
}

module.exports = demoQuiz;
