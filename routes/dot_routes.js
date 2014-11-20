/*jshint node: true*/
'use strict';

var Dot = require('../models/dot');
var Comment = require('../models/comment');
var Star = require('../models/star');
var _ = require('underscore');

module.exports = function(app, jwtAuth) {
  // get all dots
  app.get('/api/dots/all', function(req, res) {
    Dot.find({hidden: false}, function(err, data) {
      if (err) {
        console.log(err);
        return res.status(500).send('there was an error');
      }
      res.json(data);
    });
  });

  // get dots for user
  app.get('/api/dots/mydots', jwtAuth, function(req, res) {
    Dot.find({user_id: req.user._id, hidden: false}, function(err, data) {
      if (err) {
        console.log(err);
        return res.status(500).send('cannot get your dots');
      }
      res.json(data);
    });
  });

  // get single dot by id
  app.get('/api/dots/:id', function(req, res) {
    Dot.findOneAndUpdate({_id: req.params.id, hidden: false}, {$inc: {views: 1}}, function(err, data) {
      if (err || !data) {
        return res.status(500).send('cannot get dot');
      }
      var dot = data.toObject();
      Star.find({dot_id: req.params.id}, function(err, stars) {
        if (err) {
          console.log(err);
          return res.status(500).send('cannot get stars');
        }
        dot.stars = stars.length;
        dot.starred = false;
        if (req.headers.username) {
          stars.forEach(function(star) {
            if (star.username === req.headers.username) {
              dot.starred = true;
            }
          });
        }
      });
      Comment.find({dot_id: req.params.id})
      .sort('timestamp')
      .exec(function(err, comments) {
        if (err) {
          console.log(err);
          return res.status(500).send('cannot retrieve comments');
        }
        dot.comments = comments;
        res.json(dot);
      });
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
              longitude: {$gt: zone.longMin, $lt: zone.longMax},
              hidden: false},
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
    var dot = new Dot();
    try {
      dot.post = req.body.post;
      dot.longitude = req.body.longitude;
      dot.latitude = req.body.latitude;
      dot.title = req.body.title;
      dot.color = req.body.color;
      dot.time = Date.now();
      dot.username = req.user.basic.username;
      dot.user_id = req.user._id;
    } catch (err) {
      return res.status(500).send('invalid input');
    }
    dot.save(function(err, data) {
      if (err) {
        console.log(err); // for dev only
        return res.status(500).send('there was an error');
      }
      res.json({dot_id: dot._id, time: dot.time});
    });
  });

  // DELETE a dot
  //THIS NEEDS TO CHANGE FROM A REMOVE TO AN ARCHIVE
  app.delete('/api/dots/:id', jwtAuth, function(req, res) {
    Dot.remove({_id:req.params.id, user_id: req.user._id}, function(err, num) {
      if (err) return res.status(500).send('cannot delete');
      if (num !== 0) {
        res.json({msg: 'success!'});
      } else {
        res.json({msg: 'cannot delete'});
      }
    });
    /*Dot.findOneAndUpdate({_id: req.params.id, hidden:false, user_id: req.user._id}, {hidden: true}, function(err, data) {
      if (err) {
        console.log(err);
        return res.status(500).send('there was an error');
      }
      // tbc
      res.send({id: data._id, time: Date.now()});
    });*/ //archive options
  });
};
