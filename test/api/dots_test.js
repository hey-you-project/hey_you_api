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
      '"latMin": 47.60,' +
      '"latMax": 47.62,' +
      '"longMin": -122.34,' +
      '"longMax": -122.32' +
      '}';

  var randomNum = Math.floor(Math.random() * 99999);
  var randUser = 'fredford' + randomNum;
  var jwtToken;

  before(function(done) {
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

  it('should create a dot (POST api/dots)', function(done) {
    chai.request(appUrl)
    .post(apiBase + '/api/dots')
    .set({jwt: jwtToken})
    .send({latitude: "47.61", longitude: "-122.33", color: "blue", title: "Hey you, with the fancy shoes", body: "Nice shoes!!", username_id: "22489701"})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.text).to.not.eql('there was an error');
      expect(res.body).to.have.property('dot_id');
      //expect username_id to exist in User._Id
      dotId = res.body.dot_id;
      done();
    });
  });

  it('should get an individual dot (GET api/dots/:id)', function(done) {
    chai.request(appUrl)
    .get(apiBase + '/api/dots/' + dotId)
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.body).to.eql('Nice shoes!!');
      expect(res.body).to.have.property('_id');
      done();
    });
  });

  it('should return an array of dots in a range (GET api/dots)', function(done) {
    chai.request(appUrl)
    .get(apiBase + '/api/dots')
    .set('zone', zoneData)
    .end(function(err, res) {
      expect(err).to.eql(null);
      //expect(res.body).to.be.an(Array);
      done();
    });
  });

  //  it('should allow an original poster to delete their dot (DELETE api/dots/:id)', function(done) {
  //    chai.request(appUrl)
  //    .delete(apiBase + '/api/dots/' + dotId)
  //    .set({jwt: jwtToken})
  //    .end(function(err, res) {
  //      expect(err).to.eql(null);
  //      expect(res.body.msg).to.eql('success!');
  //      done();
  //    });
  //  });

  it('should allow users to post comments on their own dot', function(done) {
    chai.request(appUrl)
    .put(apiBase + '/api/dots/' + dotId)
    .set({jwt: jwtToken})
    .send({text: "this is a text comment"})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.msg).to.eql('success!');
      done();
    });
  });

  it('should get check to see if that comment was pushed (GET api/dots/:id)', function(done) {
    chai.request(appUrl)
    .get(apiBase + '/api/dots/' + dotId)
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body).to.have.property('_id');
      expect(res.body.comments[0].text).to.eql('this is a text comment');
      done();
    });
  });
});
