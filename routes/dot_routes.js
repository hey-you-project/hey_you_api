/*jshint node: true*/
'use strict';

var Dot = require('../models/dot');

module.exports = function(app) {
    app.get('/api/dots/all', function(req, res) {
        Dot.find({}, function(err, data) {
            if (err) {
                console.log(err);
                return res.status(500).send('there was an error');
            }
            res.json(data);
        });
    });

    app.get('/api/dots/:id', function(req, res) {
        Dot.findOne({_id: req.params.id}, function(err, data) {
            if (err) {
                console.log(err);
                return res.status(500).send('there was an error');
            }
            res.json(data);
        });
    });

  
    app.get('/api/dots', function(req, res) {
        if(!req.headers.zone){
            res.status(500).send('expected zone in headers');
        }
        var zone = JSON.parse(req.headers.zone);
        /*
        example data from zone:
        {"latMax":47.61070610565,"longMin":-122.3387206914,"longMax":-122.3254213086,"latMin":47.60171189435}
        */
        Dot.find({latitude:{ $gt: zone.latMin, $lt: zone.latMax},
                  longitude: {$gt: zone.longMin, $lt: zone.longMax}},
                 function(err, data) {
            if (err) {
                console.log(err);
                return res.status(500).send('there was an error');
            }
            res.json(data);
        });
    });
  
  app.post('/api/dots', function(req, res) {
    var dot = new Dot(req.body);
    dot.time = Date.now();
    dot.save(function(err, data) {
      if (err) {
        console.log(err); // for dev only
        return res.status(500).send('there was an error');
      }
      res.json({dot_id: dot._id, time: dot.time});
    });
  });
};