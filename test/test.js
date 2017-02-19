//During the test the env variable is set to 'test'
process.env.NODE_ENV = 'dev';

// mongoose
let mongoose = require("mongoose");
mongoose.Promise = global.Promise;
let User = require('../models/Users');


//let client = new pg.Client(connectionString);

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
        it('it should login user', function() {

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

        it('it should NOT login user with incorrect username', function() {
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

        it('it should NOT login user with incorrect password', function() {

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

        it('it should NOT login user without username', function() {

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

        it('it should NOT login user without password', function() {

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


//Test TODO list api
describe('TODO list api', function() {

    let user = {
        username: "testuser-001",
        password: "testuser-001P"
    }

    //Before test empty the users database
    User.remove({}, function (err) {});

    //Register new user
    chai.request(server)
        .post('/user/register')
        .send(user)
        .end(function (err, res) {
            user.token = res.body.token;
            user._id = JSON.parse(new Buffer(res.body.token.split('.')[1], 'base64').toString())._id;
        });

    let p1_id = 0;
    let p2_id = 0;                
    let t1_id = 0;
    let t2_id = 0;

    let projects = [
        {   
            name: "New test project 1",
            user_id: user._id
        },
        {   
            name: "New test project 2",
            user_id: user._id
        }
    ];

    let tasks =[
        {
            name: "New test task 1",
            status: "uncompleted",
            project_id: 0,
            priority: 2,
            deadline: null,
            user_id: user._id
        },
        {
            name: "New test task 2",
            status: "uncompleted",
            project_id: 0,
            priority: 0,
            deadline: null,
            user_id: user._id
        }
    ]

    before (function() { 

    // pg
    let pg = require('pg');
    let connectionString = 'postgres://localhost';

    pg.connect(connectionString, function(err, client, done) {
        if(err) { done(); }

        //Before test DELETE all tasks in tasks table
        /*
        let query = client.query( 
        "DELETE FROM tasks");
        //console.log(user._id + ' ///DELETE FROM tasks');
        query.on('end', function() {
        done();
        });
*/
        //Before test DELETE all projects in projects table
        
       let query = client.query( 
        "DELETE FROM projects");
        //console.log(user._id + ' ///DELETE FROM projects');
        query.on('end', function() {
        done();
        });

    });

    });

    // Test the Projects CRUD

    describe('Projects CRUD', function() {
        it('it should CREATE two new projects', function() {

            chai.request(server)
                .post('/api/' + user._id + '/projects')
                .set('Authorization', 'Bearer ' + user.token)
                .send(projects[0])
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.should.have.lengthOf(1);
                });

            chai.request(server)
                .post('/api/' + user._id + '/projects')
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
                .get('/api/' + user._id + '/projects')
                .set('Authorization', 'Bearer ' + user.token)
                .end(function (err, res) {
                   
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.should.have.lengthOf(2);
                    res.body[0].should.have.property('name').eql("New test project 1");
                    res.body[1].should.have.property('name').eql("New test project 2");
                     console.log('200');
                    // Save project id's for UPDATE and DELETE tests
                    p1_id = res.body[0].id;
                    p2_id = res.body[1].id;
                    console.log('p1_id:' + p1_id + '; p2_id: '+ p2_id)
                    // Attach two test tasks to test project 1
                    tasks[0].project_id = res.body[0].id;
                    tasks[1].project_id = res.body[0].id;
                    console.log('tasks[0].project_id:' + tasks[0].project_id + '; tasks[0].project_id: '+ tasks[0].project_id)
                });
        });

        it('it should UPDATE project #1', function() {

            projects[0].name = "Renamed test project 1";

            chai.request(server)
                .put('/api/' + user._id + '/projects/' + p1_id)
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
                .delete('/api/' + user._id + '/projects/' + p2_id)
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
                .get('/api/' + user._id + '/projects')
                .set('Authorization', 'Bearer ' + user.token)
                .end(function (err, res) {
                    res.should.have.status(200);
                    // Attach two test tasks to test project 1
                    tasks[0].project_id = res.body[0].id;
                    tasks[1].project_id = res.body[0].id;
                    
                });

            console.log('tasks[0].project_id:' + tasks[0].project_id + '; tasks[0].project_id: '+ tasks[0].project_id)

            chai.request(server)
                .post('/api/' + user._id + '/tasks')
                .set('Authorization', 'Bearer ' + user.token)
                .send(tasks[0])
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.should.have.lengthOf(1);
                });

            chai.request(server)
                .post('/api/' + user._id + '/tasks')
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
                .get('/api/' + user._id + '/tasks')
                .set('Authorization', 'Bearer ' + user.token)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.should.have.lengthOf(2);
                    res.body[0].should.have.property('id');
                    res.body[1].should.have.property('id');
                    res.body[0].should.have.property('name').eql("New test task 1");
                    res.body[1].should.have.property('name').eql("New test task 2");

                    // Save task id's for UPDATE and DELETE tests
                    t1_id = res.body[0].id;
                    t2_id = res.body[1].id;
                    console.log(t1_id);
                    console.log(t2_id);
                });
        });

        it('it should UPDATE task', function() {

            tasks[0].name = "Renamed test task 1";

            chai.request(server)
                .put('/api/' + user._id + '/tasks/' + t1_id)
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
                .delete('/api/' + user._id + '/tasks/' + t2_id)
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
