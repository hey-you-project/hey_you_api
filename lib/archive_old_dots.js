'use strict';
var _ = require('underscore');
var mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL ||
                 process.env.MONGOLAB_URI ||
                 'mongodb://localhost/hey_you_test');

var Dot = require('../models/dot');
var ExpiredDot = require('../models/expiredDot');

var dateOfExpire = Date.now() - 12000;
var beforeDotCount;
var beforeExpDotCount;

  Dot.find({'time' : {$lt: dateOfExpire} }, function (err, dotArray) {
    // map array of mongoose objects to js objects before using native mongo insert.
    // https://gist.github.com/aheckmann/2859582
    var vanilla = dotArray.map(function(d){ return d.toObject() });

    console.log('Dots To Archive: ', dotArray.length);

    ExpiredDot.collection.insert(vanilla, function(err, doc) {
      console.log('ERR: ', err);
      var idArray = _.pluck(doc, '_id');

      Dot.remove({_id: {$in: idArray }}, function(err, count) {
        if (err) return err;
        console.log('Dots Transfered to Archive: ', count)
      });
    });
  });
