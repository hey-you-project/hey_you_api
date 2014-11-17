/*jshint node: true*/
'use strict';

var mongoose = require('mongoose');

var archiveSchema = mongoose.Schema({
  item: {}            // possibly needs to split by type
});

module.exports = mongoose.model('Archive', archiveSchema);
