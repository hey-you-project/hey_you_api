/*jshint node: true*/
'use strict';

var express = require('express');
var mongoose = require('mongoose');
var bp = require('body-parser');
//var passport = require('passport');
var app = express();
app.use(bp.json());

mongoose.connect(process.env.MONGO_URL ||
                 process.env.MONGOLAB_URI ||
                 'mongodb://localhost/hey_you_db');
app.set('jwtSecret', process.env.JWT_SECRET || 'changethisordie');

//app.use(passport.initialize());

//require('./lib/passport')(passport);
//var jwtauth = require('./lib/jwt_auth')(app.get('jwtSecret'));

var dotRouter = express.Router();
//dotRouter.use(jwtauth);

require('./routes/user_routes')(app);
require('./routes/dot_routes')(app);
app.use('/v1', dotRouter);

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), function() {
  console.log('server listening on ' + app.get('port'));
});
