var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var mongo = require('mongodb');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var mongoose = require('mongoose');
var db = require('./models/db');
var sanitize = require('mongo-sanitize');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var dbUrl = process.env.MONGOLAB_URI || 'mongodb://localhost/quizme';
mongoose.connect(dbUrl);

var verifySlack = function(req, res, next) {
  if (req.body.text && req.body.trigger_word && req.body.user_name) {
    var content = req.body.text;
    if (req.body.trigger_word) {
      content = content.substr(req.body.trigger_word.length + 1).trim();
    }
    req.body.content = content;
    next();
  } else {
    res.status(503).send('Only designed for Slack integration.');
  }
}

var verifyDemo = function(req, res, next) {
  if (req.body._id && req.body.demoanswer) {
    var trimBody = req.body.demoanswer.replace(/quiz/gi, '').trim();
    req.body.content = trimBody;
    next();
  } else {
    res.json({
      'error': true,
      'errorDescription': 'No question ID, or answer given'
    });
  }
}

/* sanitize req.body */
var cleanBody = function(req, res, next) {
  req.body = sanitize(req.body);
  next();
}

/* GET home page. */
app.get('/', routes.homepage);

/* Slack post request */
app.post('/', verifySlack, routes.slackRequest);

/* Demo question webservice */
app.post('/demoQuestion', verifyDemo, db.questionById, routes.demoQuestion);

/* AJAX post to new create new question */
app.post('/newQuestion', cleanBody, db.newQuestion);

/* AJAX post to get user stats */
app.post('/getStats', db.userStats);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
