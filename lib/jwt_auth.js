/*jshint node: true*/
'use strict';
var jwt = require('jwt-simple');
var User = require('../models/user');

module.exports = function(secret) {
  return function(req, res, next) {
    var token = req.headers.jwt || req.body.jwt;

    var decoded;
    try {
      decoded = jwt.decode(token, secret);
    } catch (err) {
      // 1000 = user is not sending jwt token
      return res.status(403).send('1000');
    }

    User.findOne({_id: decoded.iss}, function(err, user) {
      if (err) return res.status(403).send('access denied');
      if (!user) return res.status(403).send('1001');
      req.user = user;
      next();
    });
  };
};
