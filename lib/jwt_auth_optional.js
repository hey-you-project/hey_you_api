/*jshint node: true*/
'use strict';
var jwt = require('jwt-simple');
var User = require('../models/user');

module.exports = function(secret) {
  return function(req, res, next) {
    if (!req.headers.jwt) {
      req.loggedIn = false;
      return next();
    }

    req.loggedIn = true;
    var token = req.headers.jwt || req.body.jwt;

    var decoded;
    try {
      decoded = jwt.decode(token, secret);
    } catch (err) {
      return res.status(403).send('access denied');
    }

    User.findOne({_id: decoded.iss}, function(err, user) {
      if (err) return res.status(403).send('access denied');
      if (!user) return res.status(403).send('access denied');
      req.user = user;
      next();
    });
  };
};
