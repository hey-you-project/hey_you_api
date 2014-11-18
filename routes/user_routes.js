/*jshint node: true*/
'use strict';

var User = require('../models/user');

module.exports = function(app, passport) {
  app.get('/api/users', passport.authenticate('basic', {session: false}), function(req, res) {
    res.json({jwt: req.user.generateToken(app.get('jwtSecret'))});
  });

  app.post('/api/users', function(req, res) {
    User.findOne({'basic.username': req.body.username}, function(err, user) {
      if (err) return res.status(500).send('server error');
      if (user) return res.status(500).send('cannot create that user');

      // username validation
      if (req.body.username > 12) {
        return res.status('500').send('invalid username');
      }

      // password confirmation/validation
      if (!req.body.password) return res.status(500).send('please provide password');
      if (req.body.password.length < 6) {
        return res.status(500).send('invalid password');
      }

      // age validation, 31556926000 = 18 years
      if (req.body.birthday > Date.now() - 31556926000) {
        return res.status(401).send('unauthorized');
      }

      var newUser = new User();
      newUser.basic.username = req.body.username;
      newUser.basic.password = newUser.generateHash(req.body.password);
      newUser.email = req.body.email;
      newUser.birthday = req.body.birthday;
      newUser.creationDate = Date.now();

      newUser.save(function(err, data) {
        if (err) return res.status(500).send('server error');
        res.json({jwt: newUser.generateToken(app.get('jwtSecret'))});
      });
    });
  });
};
