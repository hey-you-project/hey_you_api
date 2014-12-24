'use strict';

var Dot = require('../models/dot');
var request = require('request');
var cheerio = require('cheerio');

module.exports = function(city) {
  console.log('running a crawl on', city);
  request('http://' + city + '.craigslist.org/search/mis?postedToday=1', function(error, response, html) {
    var noLatOrLon = 0;
    var tooOld = 0;
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(html);
      var allResults = [];
      $('p.row').each(function(i, element) {
        var result = {};
        var a = $(this);
        result.id = a.attr('data-pid');
        result.url = 'http://' + city + '.craigslist.org' + a.children().attr('href');
        allResults.push(result);
      });
      allResults.forEach(function(element, index, array) {
        request(element.url, function(error, response, html) {
          if (!error && response.statusCode == 200) {
            var $ = cheerio.load(html);
            if ($('div.viewposting').attr('data-latitude') === undefined) {
              noLatOrLon ++;
              if (noLatOrLon % 10 === 0) console.log('noLat:', noLatOrLon);
              return;
            }
            if ((new Date().getTime()) - new Date($('time').attr('datetime')).getTime() > 1800000) {
              tooOld ++;
              if (tooOld % 5 === 0) console.log('tooOld:', tooOld);
              return;
            }
            var dot = new Dot();
            dot.title = $('h2.postingtitle').text().slice(6).split('\n').join('');
            dot.latitude = $('div.viewposting').attr('data-latitude');
            dot.longitude = $('div.viewposting').attr('data-longitude');
            dot.post = $('section#postingbody').text().slice(9).split('\n').join('');
            dot.time = Date.now();
            dot.user_id = '546f8a42ea87440b00356e4d';
            dot.username = 'craigslist';
            switch (Math.floor(Math.random() * (7 - 0) + 0)) {
              case 0:
                dot.color = 'blue';
                break;
              case 1:
                dot.color = 'green';
                break;
              case 2:
                dot.color = 'red';
                break;
              case 3:
                dot.color = 'yellow';
                break;
              case 4:
                dot.color = 'orange';
                break;
              case 5:
                dot.color = 'turquoise';
                break;
              case 6:
                dot.color = 'purple';
                break;
              default:
                dot.color = 'blue';
            }
            dot.save(function(err, data) {
              if (err) {
                console.log('error in saving post from crawl', err); // for dev only
                return;
              }
              console.log('saved post from crawl:', dot);
            });
          }
        });
      });
    }
  });
};
