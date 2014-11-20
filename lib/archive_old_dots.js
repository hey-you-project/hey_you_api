'use strict'
var mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL ||
                 process.env.MONGOLAB_URI ||
                 'mongodb://localhost/hey_you_test');

var Dot = require('../models/dot');
var ExpiredDot = require('../models/expiredDot');

var dateOfExpire = Date.now() - 12000;
var beforeDotCount;
var beforeExpDotCount;

// Dot.count(function(err, count) {
//   beforeDotCount = count;
//
//   ExpDot.count(function(err, count) {
//     beforeExpDotCount = count;

    Dot.find({'time' : {$lt: dateOfExpire} }, function (err, dotArray) {
      
      // map array of mongoose objects to js objects before using native mongo insert.
      // https://gist.github.com/aheckmann/2859582

      var vanilla = dotArray.map(function(d){ return d.toObject() });
      console.log(vanilla)
      console.log('Dots To Archive: ', dotArray.length);

      ExpiredDot.collection.insert(vanilla, function(err, doc) {
        console.log(err);
        console.log(doc);
      });
    });
//   });
// });
