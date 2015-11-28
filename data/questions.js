var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var questions = [
  {
    'question': "Who says seemingly the most?",
    'answer': "Cam",
    'option1': 'Monty',
    'option2': 'Cam',
    'option3': 'Patrick',
    'option4': 'Beth',
    'hint': 'The answer is Cam',
    'answeredby': '',
    'currentquestion': false
  },
  {
    'question': "Who is the managing director of Victoria Forms?",
    'answer': "Duncan",
    'option1': 'Cam',
    'option2': 'Monty',
    'option3': 'Duncan',
    'option4': 'Paul',
    'hint': 'The answer is Duncan',
    'answeredby': '',
    'currentquestion': false
  }
];
module.exports = questions;
