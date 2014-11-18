process.env.MONGO_URL = 'mongodb://localhost/hey_you_test';
var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);

require('../../server');

var expect = chai.expect;

describe('basic user creation and authentcation', function() {

  var randomNum = Math.floor(Math.random() * 99999);
  var randUser = 'fred' + randomNum;
  var jwtToken;

  it('should create a new user', function(done) {
    chai.request('http://localhost:3000')
    .post('/api/users')
    .send({username: randUser, password: 'foobarfoo'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body).to.have.property('jwt');
      jwtToken = res.body.jwt;
      done();
    });
  });

  it('should deny long usernames', function(done) {
    chai.request('http://localhost:3000')
    .post('/api/users')
    .send({username: 'thisnameisjustmuchtoolong', password: 'foobarfoo'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.have.status(500);
      done();
    });
  });

  it('should deny short passwords', function(done) {
    chai.request('http://localhost:3000')
    .post('/api/users')
    .send({username: randUser, password: 'foob'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.have.status(500);
      done();
    });
  });

  it('should deny young people', function(done) {
    chai.request('http://localhost:3000')
    .post('/api/users')
    .send({username: randUser, password: 'foob', birthday: Date.now()})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.have.status(500);
      done();
    });
  });

  it('should deny already existing users', function(done) {
    chai.request('http://localhost:3000')
    .post('/api/users')
    .send({username: randUser, password: 'foobarfoo'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.have.status(500);
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

  it('should not create a duplicate user', function(done) {
    chai.request('http://localhost:3000')
    .post('/api/users')
    .send({username: randUser, password: 'foobarfoo'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.status).to.eql(500);
      expect(res.text).to.eql('cannot create that user');
      done();
    });
  });

});
