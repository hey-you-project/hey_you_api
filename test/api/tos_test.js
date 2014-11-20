process.env.MONGO_URL = 'mongodb://localhost/hey_you_test';
var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);

require('../../server');
var Tos = require('../../models/tos');
var User = require('../../models/user')

var expect = chai.expect;
var apiBase = '/v1';
var appUrl = 'http://localhost:3000';

describe('basic ToS agreement mechanism', function() {
  var randomNum = Math.floor(Math.random() * 99999);
  var randUser = 'fred' + randomNum;
  var jwtToken;

  before(function(done) {
    chai.request(appUrl)
    .post('/api/users')
    .send({username: randUser, password: 'foobarfoo', birthday: 1, email: 'test@example.com'})
    .end(function(err, res) {
      jwtToken = res.body.jwt;
      done();
    });

    // // for creating a test ToS, uncomment route too
    // chai.request(appUrl)
    // .post('/api/tos/new')
    // .send()
    // .end(function(err, res) {
    //   console.log(res.body)
    // });
  });

  it('should get latest ToS', function(done) {
    chai.request(appUrl)
    .get('/api/tos/latest')
    .set({jwt: jwtToken})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body).to.have.property('version');
      tosId = res.body._id;
      tosVer = res.body.version;
      done();
    });
  });
  
  it('should save when user agrees to ToS', function(done) {
    chai.request(appUrl)
    .patch('/api/tos/agreed')
    .set({jwt: jwtToken})
    .send({tos_id: tosId, version: tosVer})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.text).to.eql('agreement updated');
      done();
    });
  });
});