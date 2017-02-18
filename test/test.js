//During the test the env variable is set to 'test'
process.env.NODE_ENV = 'test';

// mongoose
let mongoose = require("mongoose");
mongoose.Promise = global.Promise;
let User = require('../models/Users');
// pg
let pg = require('pg');
let connectionString = 'postgres://localhost';

let client = new pg.Client(connectionString);

//test
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

//Test Users
describe('Users', function() {

    before(function() { 
        //Before each test empty the users database
        User.remove({}, function (err) { 
                     
        });     
    });

    // Test the /POST register route

    describe('users register', function() {
        it('it should register new user', function() {
        let user = {
            username: "username",
            password: "password"
        }
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
            password: "password"
        }
        chai.request(server)
            .post('/user/register')
            .send(user)
            .end(function (err, res) {
                res.should.have.status(200);
            }); 
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
        }
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
            username: "username",
            password: ""
        }
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
            username: "username",
            password: "12345"
        }
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
        it('it should login user', function() {
        let user = {
            username: "username",
            password: "password"
        }
        chai.request(server)
            .post('/user/register')
            .send(user)
            .end(function (err, res) {
                res.should.have.status(200);
            });
        chai.request(server)
            .post('/user/login')
            .send(user)
            .end(function (err, res) {
                res.should.have.status(200);
            
            });
        });
        it('it should NOT login user with incorrect username', function() {
        let user = {
            username: "username",
            password: "password"
        }
        chai.request(server)
            .post('/user/register')
            .send(user)
            .end(function (err, res) {
                res.should.have.status(200);
            });
        user.username = 'username-X';            
        chai.request(server)
            .post('/user/login')
            .send(user)
            .end(function (err, res) {
                res.should.have.status(401);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Incorrect username.');
                
            });
        });
        it('it should NOT login user with incorrect password', function() {
        let user = {
            username: "username",
            password: "password"
        }
        chai.request(server)
            .post('/user/register')
            .send(user)
            .end(function (err, res) {
                res.should.have.status(200);
            });
        user.password = 'password-X';            
        chai.request(server)
            .post('/user/login')
            .send(user)
            .end(function (err, res) {
                res.should.have.status(401);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Incorrect password.');
                
            });
        });
        it('it should NOT login user without username', function() {
        let user = {
            username: "username",
            password: "password"
        }
        chai.request(server)
            .post('/user/register')
            .send(user)
            .end(function (err, res) {
                res.should.have.status(200);
            });
        user.username = '';            
        chai.request(server)
            .post('/user/login')
            .send(user)
            .end(function (err, res) {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Please fill out all fields');
                
            });
        });
        it('it should NOT login user without password', function() {
        let user = {
            username: "username",
            password: "password"
        }
        chai.request(server)
            .post('/user/register')
            .send(user)
            .end(function (err, res) {
                res.should.have.status(200);
            });
        user.password = undefined;            
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


//Test TODO list api
describe('TODO list api', function() {

    let user = {
        username: "testuser-001",
        password: "testuser-001P"
    }
    let user_id = '58a83d3774c75d1ae4d52702';
    let p1_id = 0;
    let p2_id = 0;                
    let t1_id = 0;
    let t2_id = 0;

    let projects = [
        {   
            name: "New test project 1",
            user_id: user_id
        },
        {   
            name: "New test project 2",
            user_id: user_id
        }
    ];

    let tasks =[
        {
            name: "New test task 1",
            status: "uncompleted",
            project_id: 0,
            priority: 2,
            deadline: null,
            user_id: user_id
        },
        {
            name: "New test task 2",
            status: "uncompleted",
            project_id: 0,
            priority: 0,
            deadline: null,
            user_id: user_id
        }
    ]

    before(function() { 

        //Before test empty the users database
        User.remove({}, function (err) {});

        //Register new user
        chai.request(server)
            .post('/user/register')
            .send(user)
            .end(function (err, res) {
                user.token = res.body.token;
            });

        //Before test DELETE all projects in projects table
        client.connect();
        let query = client.query( 
        "DELETE FROM projects WHERE user_id='58a83d3774c75d1ae4d52702'");
        query.on('end', function() { client.end(); });

        //Before test DELETE all tasks in tasks table
        query = client.query( 
        "DELETE FROM tasks WHERE user_id='58a83d3774c75d1ae4d52702'");
        query.on('end', function() { client.end(); });

    });

    // Test the Projects CRUD

    describe('Projects CRUD', function() {
        it('it should CREATE two new projects', function() {

            chai.request(server)
                .post('/api/' + projects[0].user_id + '/projects')
                .set('Authorization', 'Bearer ' + user.token)
                .send(projects[0])
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.should.have.lengthOf(1);
                });

            chai.request(server)
            .post('/api/' + projects[1].user_id + '/projects')
            .set('Authorization', 'Bearer ' + user.token)
            .send(projects[1])
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.should.have.lengthOf(2);
            });
        });

        it('it should GET all projects', function() {

            chai.request(server)
                .get('/api/' + user_id + '/projects')
                .set('Authorization', 'Bearer ' + user.token)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.should.have.lengthOf(2);
                    res.body[0].should.have.property('name').eql("New test project 1");
                    res.body[1].should.have.property('name').eql("New test project 2");

                    // Save project id's for UPDATE and DELETE tests
                    p1_id = res.body[0].id;
                    p2_id = res.body[1].id;
                    // Attach two test tasks to test project 1
                    tasks[0].project_id = res.body[0].id;
                    tasks[1].project_id = res.body[0].id;
                });
        });

        it('it should UPDATE project #1', function() {

            projects[0].name = "Renamed test project 1";

            chai.request(server)
                .put('/api/' + user_id + '/projects/' + p1_id)
                .set('Authorization', 'Bearer ' + user.token)
                .send(projects[0])
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.should.have.lengthOf(2);
                    res.body[1].should.have.property('name').eql("Renamed test project 1"); 
                });
        });

        it('it should DELETE project #2', function() {

            chai.request(server)
                .delete('/api/' + user_id + '/projects/' + p2_id)
                .set('Authorization', 'Bearer ' + user.token)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.should.have.lengthOf(1);
                    res.body[0].should.have.property('name').eql("Renamed test project 1");
                });
        });      
    });

    // Test the Tasks CRUD

    describe('Tasks CRUD', function() {
        it('it should CREATE two new tasks', function() {

            chai.request(server)
                .post('/api/' + user_id + '/tasks')
                .set('Authorization', 'Bearer ' + user.token)
                .send(tasks[0])
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.should.have.lengthOf(1);
                });

            chai.request(server)
                .post('/api/' + user_id + '/tasks')
                .set('Authorization', 'Bearer ' + user.token)
                .send(tasks[1])
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.should.have.lengthOf(2);        
                });
        });

        it('it should GET all tasks', function() {

            chai.request(server)
                .get('/api/' + user_id + '/tasks')
                .set('Authorization', 'Bearer ' + user.token)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.should.have.lengthOf(2);
                    res.body[0].should.have.property('name').eql("New test task 1");
                    res.body[1].should.have.property('name').eql("New test task 2");

                    // Save task id's for UPDATE and DELETE tests
                    t1_id = res.body[0].id;
                    t2_id = res.body[1].id;
                });
        });

        it('it should UPDATE task', function() {

            tasks[0].name = "Renamed test task 1";

            chai.request(server)
                .put('/api/' + user_id + '/tasks/' + t1_id)
                .set('Authorization', 'Bearer ' + user.token)
                .send(tasks[0])
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.should.have.lengthOf(2);
                    res.body[1].should.have.property('name').eql("Renamed test task 1");
                });
        });

        it('it should DELETE task', function() {

            chai.request(server)
                .delete('/api/' + user_id + '/tasks/' + t2_id)
                .set('Authorization', 'Bearer ' + user.token)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.should.have.lengthOf(1);
                    res.body[0].should.have.property('name').eql("Renamed test project 1"); 
                });
        });      
    });  

});
