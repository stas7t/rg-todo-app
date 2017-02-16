//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
mongoose.Promise = global.Promise;
let User = require('../models/Users');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('Users', function() {
    beforeEach(function(done) { //Before each test we empty the database
        User.remove({}, (err) => { 
           done();         
        });     
    });

  // Test the /POST register route

  describe('/POST register', function() {
      it('it should register new user', function(done) {
        let user = {
            username: "testuser-001",
            password: "testuser-001P"
        }
        chai.request(server)
            .post('/user/register')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('token');
                done();
            });
      });
      it('it should NOT register new user with duplicate name', function(done) {
        let user = {
            username: "testuser-001",
            password: "testuser-001P"
        }
        chai.request(server)
            .post('/user/register')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
            }); 
        chai.request(server)
            .post('/user/register')
            .send(user)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('This username already exists');
                done();
            });
      });
      it('it should NOT register new user without username', function(done) {
        let user = {
            username: "",
            password: "password"
        }
        chai.request(server)
            .post('/user/register')
            .send(user)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Please fill out all fields');
                done();
            });
      });
      it('it should NOT register new user without password', function(done) {
        let user = {
            username: "username",
            password: ""
        }
        chai.request(server)
            .post('/user/register')
            .send(user)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Please fill out all fields');
                done();
            });
      });
  });

  // Test the /POST login route

  describe('/POST login', function() {
      it('it should login user', function(done) {
        let user = {
            username: "testuser-001",
            password: "testuser-001P"
        }
        chai.request(server)
            .post('/user/register')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
            });
        chai.request(server)
            .post('/user/login')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
            done();
            });
      });
      it('it should NOT login user with incorrect username', function(done) {
        let user = {
            username: "testuser-001",
            password: "testuser-001P"
        }
        chai.request(server)
            .post('/user/register')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
            });
        user.username = 'testuser-001-X';            
        chai.request(server)
            .post('/user/login')
            .send(user)
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Incorrect username.');
                done();
            });
      });
      it('it should NOT login user with incorrect password', function(done) {
        let user = {
            username: "testuser-001",
            password: "testuser-001P"
        }
        chai.request(server)
            .post('/user/register')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
            });
        user.password = 'testuser-001P-X';            
        chai.request(server)
            .post('/user/login')
            .send(user)
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Incorrect password.');
                done();
            });
      });
      it('it should NOT login user without username', function(done) {
        let user = {
            username: "testuser-001",
            password: "testuser-001P"
        }
        chai.request(server)
            .post('/user/register')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
            });
        user.username = '';            
        chai.request(server)
            .post('/user/login')
            .send(user)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Please fill out all fields');
                done();
            });
      });
      it('it should NOT login user without password', function(done) {
        let user = {
            username: "testuser-001",
            password: "testuser-001P"
        }
        chai.request(server)
            .post('/user/register')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
            });
        user.password = undefined;            
        chai.request(server)
            .post('/user/login')
            .send(user)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Please fill out all fields');
                done();
            });
      });
  });



});