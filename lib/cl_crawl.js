'use strict';

var request = require('request');
var cheerio = require('cheerio');

module.exports = function(city) {
  request('http://' + city + '.craigslist.org/search/mis?', function (error, response, html) {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(html);
      var allPosts = []
      $('p.row').each(function(i, element) {
        var post = {};
        var a = $(this);
        post.id = a.attr('data-pid');
        post.url = 'http://' + city + '.craigslist.org' + a.children().attr('href');
        allPosts.push(post);
      });
      allPosts.forEach(function(element, index, array) {
        request(element.url, function(error, response, html) {
        });
        console.log('element', element.url);
        console.log('index', index);
      });
    }
  });
};

/*

should crawl a city's MS posts.
each returned URL should be crawled.
If that page has no data-lat/data-long, delete the object and go to the next in the array
If that page has a data-lat, fill the object and send it to the DB.

*/