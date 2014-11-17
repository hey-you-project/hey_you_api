/*jshint node: true*/
'use strict';

var mongoose = require('mongoose');

var messageSchema = mongoose.Schema({
  from: 'ObjectId', //{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  to: 'ObjectId', //{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  messageBody: String,
  time: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Message', messageSchema);
