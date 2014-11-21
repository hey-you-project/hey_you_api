/*jshint node: true*/
'use strict';

var express = require('express');
var mongoose = require('mongoose');
var bp = require('body-parser');
var passport = require('passport');
var app = express();
app.use(bp.json());

mongoose.connect(process.env.MONGO_URL ||
                 process.env.MONGOLAB_URI ||
                 'mongodb://localhost/hey_you_db');

var dotAgeOfExpire = 172800;  //in seconds (48hrs is 172800sec, 15min is 900s)
setInterval(function() { require('./lib/archive_old_dots')(dotAgeOfExpire); }, (1000 * 900));

app.set('jwtSecret', process.env.JWT_SECRET || 'changethisordie');

app.use(passport.initialize());

require('./lib/passport')(passport);
var jwtauth = require('./lib/jwt_auth')(app.get('jwtSecret'));
var jwtauthOptional = require('./lib/jwt_auth_optional')(app.get('jwtSecret'));

var commentRouter = express.Router();
var dotRouter = express.Router();
var starRouter = express.Router();
//dotRouter.use(jwtauth);

app.all('*', function(req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  // Pass to next layer of middleware
  next();
});

require('./routes/user_routes')(app, passport);
require('./routes/dot_routes')(dotRouter, jwtauth, jwtauthOptional);
require('./routes/comment_routes')(commentRouter, jwtauth);
require('./routes/tos_routes')(app, jwtauth);
require('./routes/star_routes')(starRouter, jwtauth);
app.use('/v1', dotRouter);
app.use('/v1', commentRouter);
app.use('/v1', starRouter);

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), function() {
  console.log('server listening on ' + app.get('port'));
});
