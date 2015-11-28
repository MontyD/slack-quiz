var express = require('express');
var router = express.Router();
var quizMe = require('../quiz');
var mongoose = require('mongoose');
var mongo = require('mongodb');
var sanitize = require("mongo-sanitize");
var question = require('../models/questions');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('../views/index', {title: 'QuizMe!'});
});

router.get('/RANDquest', function(req, res, next){
  question.random(function(err, data) {
    data.currentQuestion = true;
    res.send('QUESTION: ' + data.question);
  });
})

router.get('/Allquest', function(req, res, next){
  question.find({}, function(err, data) {
    data.currentQuestion = true;
    res.json(data);
  });
})

/* Slack post request */
router.post('/', function(req, res) {
  var content = req.body.text;
  if ( req.body.trigger_word ) {
    content = content.substr( req.body.trigger_word.length ).trim()
  }
  var sendRes = quizMe(content, req.body.user_name);
  res.json(sendRes);
});

router.post('/newQuestion', function(req, res) {
  function cleanBody(req, res, next) {
    req.body = sanitize(req.body);
    next();
  }
  var newQuestion = question({
    question: req.body.question,
    answer: req.body.answer,
    option1: req.body.option1,
    option2: req.body.option2,
    option3: req.body.option3,
    option4: req.body.option4,
    hint: req.body.hint,
    intendedFor: req.body.intended,
    completed: false,
    currentQuestion: false
  });
  newQuestion.save(function(err) {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      console.log('done');
      res.send('done');
    }
  });
});

module.exports = router;
