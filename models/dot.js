'use strict';

var mongoose = require('mongoose');

var dotSchema = mongoose.Schema({
  latitude: Number,
  longitude: Number,
  color: String,
  title: String,
  post: String,
  username: String,
  user_id: mongoose.Schema.Types.ObjectId,
  time: Number,
  stars: Number,
  starred: {type: Boolean, default: false},
  views: Number,
  hidden: {type: Boolean, default: false}
});

module.exports = mongoose.model('Dot', dotSchema);
