process.env.MONGO_URL = 'mongodb://localhost/hey_you_test';
var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);

require('../../server');

var expect = chai.expect;
var apiBase = '/v1';
var appUrl = 'http://localhost:3000';

describe('basic dot CRUD', function() {
  var dotId;
  var zoneData = '{' +
      '"latMin": 47.59,' +
      '"latMax": 47.61,' +
      '"longMin": -122.34,' +
      '"longMax": -122.32' +
      '}';

  var User = {username: 'dotUser', password: 'foobarfoo', birthday: 1, email: 'test@example.com'};
  var User2 = {username: 'dotUser2', password: 'foobarfoo', birthday: 100, email: 'test2@example.com'};
  var jwtToken, jwtToken2;

  before(function(done) {
    chai.request('http://localhost:3000')
    .post('/api/users')
    .send(User)
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('jwt');
      jwtToken = res.body.jwt;
      done();
    });
  });

  before(function(done) {
    chai.request('http://localhost:3000')
    .post('/api/users')
    .send(User2)
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('jwt');
      jwtToken2 = res.body.jwt;
      done();
    });
  });

  it('should create a dot in San Fransico (POST api/dots)', function(done) {
    chai.request(appUrl)
    .post(apiBase + '/api/dots')
    .set({jwt: jwtToken})
    .send({latitude: "37.7833", longitude: "-122.4167", color: "blue", title: "Hey you, with the startup", post: "I am in San Fransico"})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.have.status(200);
      expect(res.text).to.not.eql('there was an error');
      expect(res.body).to.have.property('dot_id');
      done();
    });
  });

  it('should create a dot in Seattle (POST api/dots)', function(done) {
    chai.request(appUrl)
    .post(apiBase + '/api/dots')
    .set({jwt: jwtToken})
    .send({latitude: "47.6097", longitude: "-122.3331", color: "green", title: "Hey you, with the coffee", post: "I am in Seattle"})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.have.status(200);
      expect(res.text).to.not.eql('there was an error');
      expect(res.body).to.have.property('dot_id');
      dotId = res.body.dot_id;
      done();
    });
  });

  it('should create a dot in NYC (POST api/dots)', function(done) {
    chai.request(appUrl)
    .post(apiBase + '/api/dots')
    .set({jwt: jwtToken})
    .send({latitude: "40.7127", longitude: "74.0059", color: "red", title: "Hey you, with the skyscrappers", post: "I am in NYC"})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.have.status(200);
      expect(res.text).to.not.eql('there was an error');
      expect(res.body).to.have.property('dot_id');
      done();
    });
  });

  it('should add a created dot to mydots', function(done) {
    chai.request(appUrl)
    .get(apiBase + '/api/dots/mydots')
    .set({jwt: jwtToken})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('Array');
      done();
    });
  });

  it('should get an individual dot (GET api/dots/:id)', function(done) {
    chai.request(appUrl)
    .get(apiBase + '/api/dots/' + dotId)
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.have.status(200);
      expect(res.body.post).to.eql('I am in Seattle');
      expect(res.body).to.have.property('_id');
      done();
    });
  });

  it('should handle getting a dot that DNE', function(done) {
    chai.request(appUrl)
    .get(apiBase + '/api/dots/' + 1234567890)
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.have.status(500);
      done();
    });
  });

  it('should return an array of dots in a range (GET api/dots)', function(done) {
    chai.request(appUrl)
    .get(apiBase + '/api/dots')
    .set('zone', zoneData)
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.have.status(200);
      expect(res.body[0].post).to.eql('I am in Seattle');
      done();
    });
  });

  it('should allow users to post comments on their own dot', function(done) {
    chai.request(appUrl)
    .post(apiBase + '/api/comments/' + dotId)
    .set({jwt: jwtToken})
    .send({text: "this is a text comment from the OP"})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.have.status(200);
      expect(res.body).to.eql('this is a text comment from the OP');
      done();
    });
  });

  it('should allow other users to post comments on a dot', function(done) {
    chai.request(appUrl)
    .post(apiBase + '/api/comments/' + dotId)
    .set({jwt: jwtToken2})
    .send({text: "this is a text comment from another user"})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.have.status(200);
      expect(res.body).to.eql('this is a text comment from another user');
      done();
    });
  });

  it('should check to see if that comment was pushed (GET api/dots/:id)', function(done) {
    chai.request(appUrl)
    .get(apiBase + '/api/dots/' + dotId)
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('_id');
      expect(res.body.comments[0].text).to.eql('this is a text comment from the OP');
      expect(res.body.comments[0].username).to.eql(User.username);
      done();
    });
  });

  it('should allow an original poster to delete their dot (DELETE api/dots/:id)', function(done) {
    chai.request(appUrl)
    .delete(apiBase + '/api/dots/' + dotId)
    .set({jwt: jwtToken})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.have.status(200);
      expect(res.body.id).to.eql(dotId);
      done();
    });
  });

  it('should not be able to get a deleted dot', function(done) {
    chai.request(appUrl)
    .get(apiBase + '/api/dots/' + dotId)
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.have.status(500);
      done();
    });
  });
});
