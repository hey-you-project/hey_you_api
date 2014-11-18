process.env.MONGO_URL = 'mongodb://localhost/hey_you_test';
var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);

require('../../server');

var expect = chai.expect;
var apiBase = '/v1';
var appUrl = 'http://localhost:3000';

describe('basic dot CRUD', function(){
  var dotId;
  var zoneHeader = 'zone: {' +
    '"latMax":47.610,' +
    '"longMin":-122.338,' +
    '"longMax":-122.325,' +
    '"latMin":47.600}';

  it('should create a dot (POST api/dots)', function(done) {
    chai.request(appUrl)
    .post(apiBase + '/api/dots')
    //.set({jwt: jwtToken})
    .send({
      latitude: "47.611",
      longitude: "-122.330",
      color: "blue",
      title: "Hey you, with the fancy shoes",
      body: "Nice shoes!!",
      username_id: "22489701"
    })
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
    //.set({jwt: jwtToken})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.body).to.eql('Nice shoes!!');
      expect(res.body).to.have.property('_id');
      done();
    });
  });

  // it('should return an array of dots in a range (GET api/dots)', function (done) {
  //   chai.request(appUrl)
  //   .get(apiBase + '/api/dots')
  //   .set(zoneHeader)
  //   .end(function(err, res) {
  //     console.log(zoneHeader);
  //     console.log(res.body);
  //     expect(err).to.eql(null);
  //     //expect(res.body).to.be.an(Array);
  //     done();
  //   });
  // });
  
  it('should allow original poster to delete dot');
  it('should allow original poster to get array of their dots');

});
