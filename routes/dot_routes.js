/*jshint node: true*/
'use strict';

var Dot = require('../models/dot');
var User = require('../models/user'); // for mydots
var eachAsync = require('each-async'); // for mydots

module.exports = function(app, jwtAuth) {
  // get all dots
  app.get('/api/dots/all', function(req, res) {
    Dot.find({}, function(err, data) {
      if (err) {
        console.log(err);
        return res.status(500).send('there was an error');
      }
      res.json(data);
    });
  });

  // get dots for user
  app.get('/api/dots/mydots', jwtAuth, function(req, res) {
    User.findOne({_id: req.user._id})
    .populate('mydots')
    .exec(function(err, user) {
      if (err) return res.status(500).send('cannot get your dots');
      res.json(user.mydots);
    });
  });

    /*var dots = [];
    console.log(req.user.mydots);
    eachAsync(req.user.mydots, function(dotId, index, callback) {
      console.log(dotId);
      Dot.findOne({_id: dotId}, function(err, data) {
        if (err) return res.status(500).send('cannot get your dots');
        dots.push(data);
      });
      callback();
    }, function(err) {
      res.json(dots);
    });*/

  // get single dot by id
  app.get('/api/dots/:id', function(req, res) {
    Dot.findOne({_id: req.params.id}, function(err, data) {
      if (err) {
        console.log(err);
        return res.status(500).send('there was an error');
      }
      res.json(data);
    });
  });

  // GET all dots within lat/long range
  app.get('/api/dots', function(req, res) {
    if (!req.headers.zone) {
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
      // should no send raw schema data, but instead should be parsed
      res.json(data);
    });
  });

  // POSTing a new dot
  // tbd : catching bad json without crashing the server
  app.post('/api/dots', jwtAuth, function(req, res) {
    var dot = new Dot(req.body);
    dot.time = Date.now();
    dot.stars = 0;
    dot.username_id = req.user.basic.username;
    dot.save(function(err, data) {
      if (err) {
        console.log(err); // for dev only
        return res.status(500).send('there was an error');
      }

      // add id of created dot to user
      User.findOneAndUpdate(
        {_id: req.user._id}, {$push: {mydots: dot._id}}, function(err, data) {
          if (err) {
            console.log(err);
            return res.status(500).send('could not post');
          }
        });
      res.json({dot_id: dot._id, time: dot.time});
    });
  });

  // DELETE a dot
  //THIS NEEDS TO CHANGE FROM A REMOVE TO AN ARCHIVE
  app.delete('/api/dots/:id', jwtAuth, function(req, res) {
    Dot.findOne({_id: req.params.id}, function(err, data) {
      if (err) {
        console.log(err);
        return res.status(500).send('there was an error');
      }
      if (data.username_id !== req.user.basic.username) {
        res.send(401).send('cannot delete this dot');
      }
      // tbc
      Dot.remove({_id: req.params.id}, function(err, data) {
        if (err) {
          console.log(err);
          return res.status(500).send('there was an error');
        }
        res.json({msg: 'success!'});
      });
    });
  });

  // PUT adding user comments
  app.put('/api/dots/:id', jwtAuth, function(req, res) {
    if (!req.body.text) {
      return res.status(401).send('requires a message');
    }
    var comment = {
      username: req.user.basic.username,
      text: req.body.text,
      time: Date.now()
    };

    Dot.findOneAndUpdate(
      {_id: req.params.id}, {$push: {comments: comment}},
      function(err) {
        if (err) {
          console.log(err);
          return res.status(500).send('there was an error');
        }
        res.json({msg: 'success!'});
      });
  });
};
