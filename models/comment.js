'use strict';

var mongoose = require('mongoose');

var commentSchema = mongoose.Schema({
  user_id: mongoose.Schema.Types.ObjectId,
  username: String,
  dot_id: mongoose.Schema.Types.ObjectId,
  timestamp: Number,
  text: String
});

module.exports = mongoose.model('Comment', commentSchema);
