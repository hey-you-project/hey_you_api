process.env.MONGO_URL = 'mongodb://localhost/hey_you_test';
var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);

require('../../server');

var expect = chai.expect;
var apiBase = '/v1';
var appUrl = 'http://localhost:3000';

describe ('CRUD on authenticated dot routes', function {

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

it('should allow auth user to change a dot');

it('should allow original poster to delete dot');

it('should allow original poster to get array of their dots');

it('should allow users to post comments');

})