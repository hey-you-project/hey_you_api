/*jshint node: true */
'use strict';

var mongoose = require('mongoose');

var dotSchema = mongoose.model({
  location: {},                     // needs to be filled in
  time: {type: Date, default: Date.now},
  color: {type: String, required: true},
  title: {type: String, required: true},
  body: String,
  username_id: {type: String, required: true},
  comments: []
});

module.exports = mongoose.model('Dot', dotSchema);