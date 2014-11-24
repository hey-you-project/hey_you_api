'use strict';

var mongoose = require('mongoose');

var starSchema = mongoose.Schema({
  username: String,
  dot_id: mongoose.Schema.Types.ObjectId
});

module.exports = mongoose.model('Star', starSchema);
