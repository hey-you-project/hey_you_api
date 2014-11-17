var chaihttp = require('chai-http');
chai.use(chaihttp);

require('../../server');

var expect = chai.expect;

describe('basic dot CRUD', function(){
  
  it('should return an array of dots (GET api/dots)')
  
  it('should create a dot (POST api/dots)', function() {
    chai.request('http://localhost:3000')
    .post(apiBase + '/api/dots')
    //.set({jwt: jwtToken})
    .send({
      latitude: 75,
      longitude: -122,
      color: "blue",
      title: "Hey you, with the fancy shoes",
      body: "Nice shoes!!",
      username_id: "22489701"
    })
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body).to.not.eql('there was an error');
      expect(res.body.body).to.eql('Nice shoes!!');
      expect(res.body).to.have.property('_id');
      //expect username_id to exist in User._Id
      id = res.body._id;
      done();
    });
  });
  
  it('should get an individual dot (GET api/dots/:id)')
  
});
