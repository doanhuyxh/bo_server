const faker = require('faker');
const chai = require('chai');
const chaiHttp = require('chai-http');
const fs = require('fs');

// const { checkResponseStatus } = require('../../Common/test/Common');

chai.should();
chai.use(chaiHttp);
chai.use(chaiHttp);

const app = require('../../../server');

describe(`Tests Upload`, function() {
  let token = "";
  let fakeUserName = faker.name.firstName() + faker.name.lastName();
  before(done => {
    new Promise(async function(resolve, reject) {
      resolve();
    }).then(() => done());
  });

  it('Register user', done => {
    const body = {
      "username": "string",
      "password": "string",
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/User/loginUser`)
      .send(body)
      .end((err, res) => {
        if ( err ) {
          console.error(err);
        }
        // checkResponseStatus(res, 200);
        console.log(token);
        token = 'Bearer ' + res.body.data.token;
        done();
      });
  });

  it('Upload user avatar', done => {
    fs.readFile('uploads/Sample.png', function read(err, data) {
      if (err) {
        return null;
      }

      var base64data = Buffer.from(data, 'binary').toString('base64');
      const body = {
        image: base64data,
        imageFormat: "png",
      };
      chai
        .request(`0.0.0.0:${process.env.PORT}`)
        .post(`/Upload/uploadMediaFile`)
        .set('Authorization', token)
        .send(body)
        .end((err, res) => {
          if ( err ) {
            console.error(err);
          }
          // checkResponseStatus(res, 200);
          console.log(res.body);
          done();
        });
    });
  });
  
  it('Upload media file', done => {
    fs.readFile('uploads/VTSS.png', function read(err, data) {
      if (err) {
        return null;
      }

      var base64data = Buffer.from(data, 'binary').toString('base64');
      const body = {
        imageData: base64data,
        imageFormat: "jpg",
      };
      chai
        .request(`0.0.0.0:${process.env.PORT}`)
        .post(`/Upload/uploadMediaFile`)
        .set('Authorization', token)
        .send(body)
        .end((err, res) => {
          if ( err ) {
            console.error(err);
          }
          checkResponseStatus(res, 200);
          done();
        });
    });
  });
});
