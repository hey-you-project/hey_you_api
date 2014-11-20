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
  var views;
  var altJwtToken;
  var commentId;
  var zoneData = '{' +
      '"latMin": 47.60,' +
      '"latMax": 47.62,' +
      '"longMin": -122.34,' +
      '"longMax": -122.32' +
      '}';

  var randomNum = Math.floor(Math.random() * 99999);
  var randUser = 'fred' + randomNum;
  var jwtToken;

  before(function(done) {
    chai.request('http://localhost:3000')
    .post('/api/users')
    .send({username: randUser, password: 'foobarfoo', birthday: 1, email: 'test@example.com'})
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
    .send({latitude: "47.61", longitude: "-122.33", color: "blue", title: "Hey you, with the fancy shoes", post: "Nice shoes!!", username_id: "22489701"})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.text).to.not.eql('there was an error');
      expect(res.body).to.have.property('dot_id');
      //expect username_id to exist in User._Id
      dotId = res.body.dot_id;
      done();
    });
  });

  it('should add a created dot to mydots', function(done) {
    chai.request(appUrl)
    .get(apiBase + '/api/dots/mydots')
    .set({jwt: jwtToken})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body).to.be.an('Array');
      done();
    });
  });

  it('should get an individual dot (GET api/dots/:id)', function(done) {
    chai.request(appUrl)
    .get(apiBase + '/api/dots/' + dotId)
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.post).to.eql('Nice shoes!!');
      expect(res.body).to.have.property('_id');
      views = res.body.views;
      done();
    });
  });

  it('should increment views on a GET', function(done) {
    chai.request(appUrl)
    .get(apiBase + '/api/dots/' + dotId)
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.views).to.eql(views + 1);
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
      //expect(res.body).to.be.an(Array);
      done();
    });
  });

  it('should allow users to post comments on their own dot', function(done) {
    chai.request(appUrl)
    .post(apiBase + '/api/comments/' + dotId)
    .set({jwt: jwtToken})
    .send({text: "this is a text comment"})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body).to.eql('this is a text comment');
      done();
    });
  });

  it('should check to see if that comment was pushed (GET api/dots/:id)', function(done) {
    chai.request(appUrl)
    .get(apiBase + '/api/dots/' + dotId)
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body).to.have.property('_id');
      expect(res.body.comments[0].text).to.eql('this is a text comment');
      expect(res.body.comments[0].username).to.eql(randUser);
      commentId = res.body.comments[0]._id;
      done();
    });
  });

  it('should allow an original commenter to delete their comment', function(done) {
    chai.request(appUrl)
    .delete(apiBase + '/api/comments/' + commentId)
    .set({jwt: jwtToken})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.msg).to.eql('success!');
      done();
    });
  });

  it('should allow an original poster to delete their dot (DELETE api/dots/:id)', function(done) {
    chai.request(appUrl)
    .delete(apiBase + '/api/dots/' + dotId)
    .set({jwt: jwtToken})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.msg).to.eql('success!');
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
