var express = require('express');
var router = express.Router();
var quizMe = require('../quiz');
var demoQuiz = require('../demoQuiz');
var mongoose = require('mongoose');
var sanitize = require("mongo-sanitize");
var question = require('../models/questions');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('../views/index', {title: 'QuizMe!'});
});

router.get('/RANDquest', function(req, res, next){
  question.update({currentQuestion: true}, { $set: {currentQuestion: false} }, { multi: true }).exec();
  question.randomQuestion(function(err, data) {
    data.currentQuestion = true;
    data.save();
    res.send('QUESTION: ' + data.question);
  });
})

router.get('/currAnswer', function(req, res, next){
  question.findOne( { 'currentQuestion': true }, 'answer', function(err, data){
    if (data) {
      res.send('answer ' + data.answer);
    } else {
      res.send('nothing');
    }
  });
})

router.get('/Allquest', function(req, res, next){
  question.find({}, function(err, data) {
    res.json(data);
  });
})

router.get('/allusers', function(req, res, next){
  user.find({}, function(err, data) {
    res.json(data);
  });
})

/* Slack post request */
router.post('/', function(req, res) {
  if (req.body.text && req.body.trigger_word && req.body.user_name) {
    var content = req.body.text;
    if ( req.body.trigger_word ) {
      content = content.substr( req.body.trigger_word.length ).trim();
    }
    quizMe(content, req.body.user_name, res);
  } else {
    res.status(503).send('Only designed for Slack integration.');
  }
});

/* Demo question post request */
router.post('/demoQuestion', function(req, res) {
  if (req.body._id && req.body.demoanswer) {
    var trimBody = req.body.demoanswer.replace(/quizme/gi, '').trim();
    demoQuiz(trimBody, req.body._id, res);
  } else {
    res.status(503).send('Get out of here!');
  }
});

/* Add new question through AJAX post */
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
    hint: req.body.hint,
    completed: false,
    currentQuestion: false
  });
  newQuestion.save(function(err) {
    if (err) {
      res.send(err);
    } else {
      res.json(newQuestion);
    }
  });
});

module.exports = router;
