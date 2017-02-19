//During the test the env variable is set to 'test'
process.env.NODE_ENV = 'dev';

// mongoose
let mongoose = require("mongoose");
mongoose.Promise = global.Promise;
let User = require('../models/Users');


//test
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

//Test Users
describe('Users', function() {

    before(function() { 
        //Before test empty the users database
        User.remove({}, function (err) { 
                     
        });     
    });

    // Test the /POST register route

    describe('users register', function() {
        it('it should register new user', function() {

            let user = {
                username: "username",
                password: "password"
            };

            chai.request(server)
                .post('/user/register')
                .send(user)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('token'); 
                });
        });

        it('it should NOT register new user with duplicate username', function() {

            let user = {
                username: "username",
                password: "password-123"
            };

            chai.request(server)
                .post('/user/register')
                .send(user)
                .end(function (err, res) {
                    res.should.have.status(409);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('This username already exists');
                });
        });

        it('it should NOT register new user without username', function() {

            let user = {
                username: "",
                password: "password"
            };

            chai.request(server)
                .post('/user/register')
                .send(user)
                .end(function (err, res) {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Please fill out all fields');
                });
        });

        it('it should NOT register new user without password', function() {

            let user = {
                username: "username2",
                password: ""
            };

            chai.request(server)
                .post('/user/register')
                .send(user)
                .end(function (err, res) {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Please fill out all fields');
                });
        });

        it('it should NOT register new user if the password length is <6 symbols', function() {

            let user = {
                username: "username3",
                password: "12345"
            };

            chai.request(server)
                .post('/user/register')
                .send(user)
                .end(function (err, res) {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Password min length 6 symbols');
                });
            });
    });

    // Test the /POST login route

    describe('users login', function() {
        it('it should log in user', function() {

            let user = {
                username: "username",
                password: "password"
            };

            chai.request(server)
                .post('/user/login')
                .send(user)
                .end(function (err, res) {
                    res.should.have.status(200);
                });
        });

        it('it should NOT log in user with incorrect username', function() {
            let user = {
                username: "username-X",
                password: "password"
            };

            chai.request(server)
                .post('/user/login')
                .send(user)
                .end(function (err, res) {
                    res.should.have.status(401);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Incorrect username.');
                });
        });

        it('it should NOT log in user with incorrect password', function() {

            let user = {
                username: "username",
                password: "password-X"
            };
           
            chai.request(server)
                .post('/user/login')
                .send(user)
                .end(function (err, res) {
                    res.should.have.status(401);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Incorrect password.');
                });
        });

        it('it should NOT log in user without username', function() {

            let user = {
                username: "",
                password: "password"
            };
         
            chai.request(server)
                .post('/user/login')
                .send(user)
                .end(function (err, res) {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Please fill out all fields');
                });
        });

        it('it should NOT log in user without password', function() {

            let user = {
                username: "username",
                password: undefined
            };
          
            chai.request(server)
                .post('/user/login')
                .send(user)
                .end(function (err, res) {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Please fill out all fields');
                });
        });
    });

});
