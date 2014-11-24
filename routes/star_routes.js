'use strict';

var Star = require('../models/star');

module.exports = function(app, jwtAuth) {
  app.post('/api/stars/:id', jwtAuth, function(req, res) {
    Star.findOne({dot_id: req.params.id, username: req.user.basic.username},
                          function(err, data) {
      if (!data) {
        var star = new Star();
        star.dot_id = req.params.id;
        star.username = req.user.basic.username;
        star.save(function(err, data) {
          if (err) {
            console.log(err);
            return res.status(500).send('cannot star');
          }
          return res.json({msg: 'starred!'});
        });
      } else {
        Star.remove({dot_id: req.params.id, username: req.user.basic.username},
                    function(err) {
          if (err) {
            console.log(err);
            return res.status(500).send('cannot delete');
          }
          return res.json({msg: 'unstarred!'});
        });
      }
    });
  });
};
