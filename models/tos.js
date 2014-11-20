/*jshint node: true*/
'use strict';

var mongoose = require('mongoose');

var tosSchema = mongoose.Schema({
  html: String,
  version: String,
  post_date: Number
});

module.exports = mongoose.model('Tos', tosSchema);
