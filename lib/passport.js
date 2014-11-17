/*jshint node: true*/
'use strict';
var BasicStrategy = require('passport-http').BasicStrategy;
var User = require('../models/user');

module.exports = function(passport) {
  passport.use('basic', new BasicStrategy({
    usernameField: 'username',
    passwordField: 'password'
  },
  function(username, password, done) {
    User.findOne({'basic.username':username}, function(err, user) {
      if (err) return done('server error');
      if (!user) return done('access error');
      if (!user.validPassword(password)) return done('access error');
      return done(null, user);
    });
  }));
};
