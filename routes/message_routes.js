'use strict';

var Message = require('../models/message');

module.exports = function(app, jwtAuth) {
  app.get('/api/messages/:username', jwtAuth, function(req, res) {
    Message.find({$or: [{to_username: req.user.basic.username, from_username: req.params.username},
                  {from_username: req.user.basic.username, to_username: req.params.username}]}, function(err, data) {
      if (err) {
        console.log(err);
        return res.status(500).send('Cannot get your messages');
      }
      res.json(data);
    });
  });

  app.get('/api/messages/', jwtAuth, function(req, res) {
    Message.find({to_username: req.user.basic.username}, function(err, data) {
      if (err) {
        console.log(err);
        return res.status(500).send('Cannot get your message');
      }
      var conversations = [];
      var user;
      for (var i = 0; i < data.length; i++) {
        if (data[i].to_username === req.user.username) {
          user = data[i].from_username;
        } else {
          user = data[i].to_username;
        }
        if (conversations.indexOf(user) === -1) {
          conversations.push(user);
        }
      }
      res.json(conversations);
    });
  });

  app.post('/api/messages/:username', jwtAuth, function(req, res) {
    var message = new Message();
    try {
      message.to_username = req.params.username;
      message.from_username = req.user.basic.username;
      message.text = req.body.text;
      message.timestamp = Date.now();
    } catch (err) {
      return res.status(400).send('invalid message');
    }
    message.save(function(err, data) {
      if (err) {
        console.log(err);
        return res.status(500).send('cannot send message');
      }
      res.json(data);
    });
  });
};
