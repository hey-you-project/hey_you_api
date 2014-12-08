'use strict';

var User = require('../models/user');

module.exports = function(app, passport) {
  // login user, return jwt
  app.get('/api/users', passport.authenticate('basic', {session: false}), function(req, res) {
    res.json({jwt: req.user.generateToken(app.get('jwtSecret'))});
  });

  // create user, return jwt
  app.post('/api/users', function(req, res) {
    User.findOne({'basic.username': new RegExp('^' + req.body.username + '$', 'i')}, function(err, user) {
      if (err) return res.status(500).send('server error');
      if (user) return res.status(400).send('1003');

      // user model validation
      if (!req.body.username) return res.status(400).send('please provide username');
      if (!req.body.password) return res.status(400).send('please provide password');
      if (isNaN(req.body.birthday)) return res.status(400).send('please provide birthday');
      if (!req.body.email) return res.status(400).send('please provide email');

      // username validation
      if (req.body.username.length > 12 || req.body.username.length < 3) {
        return res.status(400).send('1004');
      }

      // password validation
      if (req.body.password.length < 6) {
        return res.status(400).send('1005');
      }

      // age validation, 31556926000 = 1 years
      if (req.body.birthday > Date.now() - (31556926000 * 18)) {
        return res.status(400).send('1006');
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
