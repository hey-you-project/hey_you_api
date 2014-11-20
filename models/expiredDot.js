/*jshint node: true*/
'use strict';

var mongoose = require('mongoose');

var expiredDotSchema = mongoose.Schema({
});

module.exports = mongoose.model('ExpiredDots', expiredDotSchema);
