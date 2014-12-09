'use strict';
process.env.MONGO_URL = 'mongodb://localhost/hey_you_test';
var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);

require('../../server');

var expect = chai.expect;
var apiBase = '/v1';
var apiUrl = 'http://localhost:3000';

describe('message functions', function() {
  var User = {username: 'messageUser', password: 'foobarfoo', birthday: 1, email: 'test@example.com'};
  var User2 = {username: 'messageUser2', password: 'foobarfoo', birthday: 100, email: 'test2@example.com'};
  var jwtToken;
  var jwtToken2;

  before(function(done) {
    chai.request(apiUrl)
    .post('/api/users')
    .send(User)
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body).to.have.property('jwt');
      jwtToken = res.body.jwt;
      done();
    });
  });

  before(function(done) {
    chai.request(apiUrl)
    .post('/api/users')
    .send(User2)
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body).to.have.property('jwt');
      jwtToken2 = res.body.jwt;
      done();
    });
  });

  it('should be able to send a message', function(done) {
    chai.request(apiUrl)
    .post(apiBase + '/api/messages/messageUser2')
    .set({jwt: jwtToken})
    .send({text: 'hello there'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.have.status(200);
      expect(res.body.text).to.eql('hello there');
      done();
    });
  });

  it('should be able to get a list of conversations', function(done) {
    chai.request(apiUrl)
    .get(apiBase + '/api/messages')
    .set({jwt: jwtToken2})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.have.status(200);
      expect(res.body[0]).to.eql('messageUser');
      done();
    });
  });

  it('should be able to get a conversation', function(done) {
    chai.request(apiUrl)
    .get(apiBase + '/api/messages/messageUser2')
    .set({jwt: jwtToken})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.have.status(200);
      expect(res.body[0]).to.have.property('text');
      expect(res.body[0].text).to.eql('hello there');
      done();
    });
  });
});
