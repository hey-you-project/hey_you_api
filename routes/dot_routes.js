/*jshint node: true*/
'use strict';

var Dot = require('../models/dot');

module.exports = function(app, jwtAuth) {
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
    console.log('USER:', req.user);
    dot.time = Date.now();
    dot.username_id = req.user.basic.username;
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

    console.log('COMMENT:', comment);
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
