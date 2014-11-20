/*jshint node: true*/
'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jwt-simple');

var userSchema = mongoose.Schema({
  basic: {
    username: String,
    password: String
  },
  email: String,
  birthday: Number,
  creationDate: Number,
  agreed_tos: {
    tos_id: ObjectID,
    version: String,
    agree_date: Number
  }
});

userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.basic.password);
};

userSchema.methods.generateToken = function(secret) {
  var _this = this;
  var token = jwt.encode({
    iss: _this._id
  }, secret);
  return token;
};

module.exports = mongoose.model('User', userSchema);
