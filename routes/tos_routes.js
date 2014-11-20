/*jshint node: true*/
'use strict';

var tos = require('../models/tos');
var user = require('../models/user');

module.exports = function(app) {
  // get latest tos
  app.get('/api/tos/latest', function(req, res) {
    Tos.findOne({}, function(err, data) {
      if (err) {
        console.log(err);
        return res.status(500).send('there was an error');
      }
      res.json(data);
    });
  });
  
  // update user when tos agreed
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
};