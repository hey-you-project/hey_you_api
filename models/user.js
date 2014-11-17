/*jshint node: true*/
'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jwt-simple');

var userSchema = mongoose.Schema({
  basic: {
    username: String,
    password: String,
  },
  email: String,
  birthday: Date,
  creationDate: {type: Date, default: Date.now}
});

module.exports = mongoose.model('User', userSchema);