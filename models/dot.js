/*jshint node: true */
'use strict';

var mongoose = require('mongoose');

var dotSchema = mongoose.Schema({
  latitude: Number,
  longitude: Number,
  color: {type: String, required: true},
  title: {type: String, required: true},
  body: String,
  username_id: String,
  comments: [],
  time: Number
});

module.exports = mongoose.model('Dot', dotSchema);
