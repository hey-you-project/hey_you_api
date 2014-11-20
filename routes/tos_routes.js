/*jshint node: true*/
'use strict';

var Tos = require('../models/tos');
var User = require('../models/user');

module.exports = function(app, jwtAuth) {

  // get latest tos
  app.get('/api/tos/latest', jwtAuth, function(req, res) {
    Tos.findOne(function(err, data) {
      if (err) {
        console.log(err);
        return res.status(500).send('there was an error');
      }
      res.json(data);
    });
  });

  // update user when tos is agreed to
  app.patch('/api/tos/agreed', jwtAuth, function(req, res) {
    var query = {_id: req.user._id};
    var update = {agreed_tos: {tos_id: req.body.tos_id, version: req.body.version, agree_date: Date.now()}};

    User.findOneAndUpdate(query, update, function(err, data) {
      if (err) {
        console.log(err);
        return res.status(500).send('there was an error');
      }
      res.send('agreement updated');
    });
  });

  // for creating new ToS in travis
  app.post('/api/tos/new', function(req, res) {
    var tos = new Tos();
    tos.html = '<h1>hello world</h1>';
    tos.version = '1.0';
    tos.post_date = 1388534400;
    tos.save(function(err, data) {
      if (err) {
        console.log(err); // for dev only
        return res.status(500).send('there was an error');
      }
      res.json(data);
    });
  });
};
