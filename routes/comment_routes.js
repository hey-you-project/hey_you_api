/*jshint node:true*/
'use strict';

var Comment = require('../models/comment');

module.exports = function(app, jwtAuth) {
  app.post('/api/comments/:id', jwtAuth, function(req, res) {
    var comment = new Comment();
    try {
      comment.text = req.body.text;
      comment.dot_id = req.params.id;
      comment.user_id = req.user._id;
      comment.username = req.user.basic.username;
      comment.timeStamp = Date.now();
    } catch (err) {
      console.log('ERRORRRORRRR');
      return res.status(500).send('cannot comment');
    }
    comment.save(function(err, data) {
      if (err) {
        console.log(err);
        return res.status(500).send('cannot comment');
      }
      res.json(data.text);
    });
  });

  app.delete('/api/comments/:id', jwtAuth, function(req, res) {
    Comment.remove({_id:req.params.id, user_id: req.user._id}, function(err) {
      if (err) return res.status(500).send('cannot delete');
      res.json({msg: 'success!'});
    });
  });
};
