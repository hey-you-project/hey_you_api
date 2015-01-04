'use strict';

process.env.MONGO_URL = 'mongodb://localhost/hey_you_test';
var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);

require('../../server');

var expect = chai.expect;

describe('basic user creation and authentcation', function() {

  var randUser = 'UserTest';
  var jwtToken;

  it('should deny long usernames', function(done) {
    chai.request('http://localhost:3000')
    .post('/api/users')
    .send({username: 'thisnameisjustmuchtoolong', password: 'foobarfoo', birthday: 0, email:'test@example.com'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.have.status(400);
      done();
    });
  });

  it('should deny short passwords', function(done) {
    chai.request('http://localhost:3000')
    .post('/api/users')
    .send({username: randUser, password: 'foo', birthday: 0, email:'test@example.com'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.have.status(400);
      done();
    });
  });

  it('should deny young people', function(done) {
    chai.request('http://localhost:3000')
    .post('/api/users')
    .send({username: randUser, password: 'foobdfaasdf', birthday: 883884087000, email:'test@example.com'})
    .end(function(err, res) {
      console.log(res.body);
      expect(err).to.eql(null);
      expect(res).to.have.status(400);
      done();
    });
  });

  it('should deny no username', function(done) {
    chai.request('http://localhost:3000')
    .post('/api/users')
    .send({password: 'foob', birthday: Date.now(), email:'test@example.com'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.have.status(400);
      done();
    });
  });

  it('should deny no password', function(done) {
    chai.request('http://localhost:3000')
    .post('/api/users')
    .send({username: randUser, birthday: Date.now(), email:'test@example.com'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.have.status(400);
      done();
    });
  });

  it('should deny no birthday', function(done) {
    chai.request('http://localhost:3000')
    .post('/api/users')
    .send({username: randUser, password: 'foob', email:'test@example.com'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.have.status(400);
      done();
    });
  });

  it('should deny no email', function(done) {
    chai.request('http://localhost:3000')
    .post('/api/users')
    .send({username: randUser, password: 'foob', birthday: Date.now()})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.have.status(400);
      done();
    });
  });

  it('should create a new user with valid info', function(done) {
    chai.request('http://localhost:3000')
    .post('/api/users')
    .send({username: randUser, password: 'foobarfoo', birthday: 0, email:'test@example.com'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body).to.have.property('jwt');
      jwtToken = res.body.jwt;
      done();
    });
  });

  it('should allow birthday of 0 in UNIX time(January 1, 1970)', function(done) {
    chai.request('http://localhost:3000')
    .post('/api/users')
    .send({username: 'BirthdayTest', password: 'foobarfoo', birthday: 0, email:'test@example.com'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body).to.have.property('jwt');
      done();
    });
  });

  it('should not create a duplicate user', function(done) {
    chai.request('http://localhost:3000')
    .post('/api/users')
    .send({username: randUser, password: 'foobarfoo', birthday: 0, email:'test@example.com'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.status).to.eql(400);
      expect(res.text).to.eql('1003');
      done();
    });
  });

  it('should log in an existing user', function(done) {
    chai.request('http://localhost:3000')
    .get('/api/users')
    .auth(randUser, 'foobarfoo')
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body).to.have.property('jwt');
      expect(res.body.jwt).to.eql(jwtToken);
      done();
    });
  });

  it('should not log in non-existing user', function(done) {
    chai.request('http://localhost:3000')
    .get('/api/users')
    .auth('imnotreal', 'sofake')
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.have.status(500);
      done();
    });
  });

});
