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
app.set('jwtSecret', process.env.JWT_SECRET || 'changethisordie');

app.use(passport.initialize());

require('./lib/passport')(passport);
var jwtauth = require('./lib/jwt_auth')(app.get('jwtSecret'));

var commentRouter = express.Router();
var dotRouter = express.Router();
//dotRouter.use(jwtauth);

require('./routes/user_routes')(app, passport);
require('./routes/dot_routes')(dotRouter, jwtauth);
require('./routes/comment_routes')(commentRouter, jwtauth);
app.use('/v1', dotRouter);
app.use('/v1', commentRouter);

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), function() {
  console.log('server listening on ' + app.get('port'));
});
