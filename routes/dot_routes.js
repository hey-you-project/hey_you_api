'use strict';

var Dot = require('../models/dot');
var Comment = require('../models/comment');
var Star = require('../models/star');

module.exports = function(app, jwtAuth, jwtAuthOptional) {
  // GET all dots
  app.get('/api/dots/all', function(req, res) {
    Dot.find({hidden: false}, function(err, data) {
      if (err) {
        console.log(err);
        return res.status(500).send('there was an error');
      }
      res.json(data);
    });
  });

  // GET dots for a user
  app.get('/api/dots/mydots', jwtAuth, function(req, res) {
    Dot.find({user_id: req.user._id, hidden: false}, function(err, data) {
      if (err) {
        console.log(err);
        return res.status(500).send('cannot get your dots');
      }
      res.json(data);
    });
  });

  // GET a single dot by id
  app.get('/api/dots/:id', jwtAuthOptional, function(req, res) {
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

        if (req.loggedIn) {
          stars.forEach(function(star) {
            if (star.username === req.user.basic.username) {
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
      res.status(400).send('expected zone in headers');
    }
    var zone = JSON.parse(req.headers.zone);

    Dot.find({latitude:{ $gt: zone.latMin, $lt: zone.latMax},
              longitude: {$gt: zone.longMin, $lt: zone.longMax},
              hidden: false},
             function(err, data) {
      if (err) {
        console.log(err);
        return res.status(500).send('there was an error');
      }
      res.json(data);
    });
  });

  // POST a new dot
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
      return res.status(400).send('invalid input');
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
  });
};
