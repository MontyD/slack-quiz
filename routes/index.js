'use strict';
var express = require('express');
var router = express.Router();
var quizMe = require('../quiz');
var demoQuiz = require('../demoQuiz');

/* GET home page. */
exports.homepage = function(req, res) {
  res.render('../views/index', {title: 'QuizMe!'});
}

/* Slack post request */
exports.slackRequest = function(req, res) {
    quizMe(req.body.content, req.body.user_name, res);
}

/* Demo question post request */
exports.demoQuestion = function(req, res) {
    demoQuiz(req.body.content, req.body, res);
}
