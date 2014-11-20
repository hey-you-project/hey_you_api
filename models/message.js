/*jshint node: true*/
'use strict';

var mongoose = require('mongoose');

var messageSchema = mongoose.Schema({
  to_user_id: mongoose.Schema.Types.ObjectId,
  to_username: String,
  from_user_id: mongoose.Schema.Types.ObjectId,
  from_username: String,
  text: String,
  timestamp: Number,
  read: {type: Boolean, default: false}
});

module.exports = mongoose.model('Message', messageSchema);
