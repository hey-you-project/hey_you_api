'use strict';
var _ = require('underscore');
var moment = require('moment');
var mongoose = require('mongoose');

var clist = require('./cl_crawl');
var crawlCount = 0;
var Dot = require('../models/dot');
var ExpiredDot = require('../models/expiredDot');

module.exports = function(dotAgeOfExpire) {

  var dateOfExpire = Date.now() - (dotAgeOfExpire * 1000);

  Dot.find({time: {$lt: dateOfExpire} }, function(err, dotArray) {
    // map array of mongoose objects to js objects before using native mongo insert.
    // https://gist.github.com/aheckmann/2859582
    var vanilla = dotArray.map(function(d) { return d.toObject(); });
    console.log('===================================');
    if (err) console.log('error finding: ', err);
    console.log('Dots To Archive: ', dotArray.length);
    if (dotArray.length < 1) {
      console.log(moment().format('DD MMM HH:mm:ss'));
      console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
      return;
    }

    ExpiredDot.collection.insert(vanilla, function(err, doc) {
      if (err) console.log('error inserting: ', err);
      var idArray = _.pluck(doc, '_id');

      Dot.remove({_id: {$in: idArray }}, function(err, count) {
        if (err) console.log('error removing: ', err);
        console.log('Dots Transfered to Archive: ', count);
        console.log(moment().format('DD MMM HH:mm:ss'));
        console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
      });
    });
  });
  if (crawlCount % 2 === 0) {
    clist('seattle');
    clist('boston');
  }
  if (crawlCount % 2 === 1) {
    clist('sfbay');
  }
  crawlCount++;
  if (crawlCount > 100) {
    console.log ('Crawled', crawlCount, 'times. Resetting crawl count.');
  }
};
