/*jshint node: true*/
'use strict';

var mongoose = require('mongoose');

var expiredDotSchema = mongoose.Schema({
  latitude: Number,
  longitude: Number,
  color: String,
  title: String,
  post: String,
  username: String,
  user_id: mongoose.Schema.Types.ObjectId,
  time: Number,
  stars: [],
  views: Number,
  hidden: {type: Boolean, default: false}
});

module.exports = mongoose.model('ExpiredDots', expiredDotSchema);
