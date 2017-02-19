//During the test the env variable is set to 'test'
process.env.NODE_ENV = 'dev';

// mongoose
let mongoose = require("mongoose");
mongoose.Promise = global.Promise;
let User = require('../models/Users');
// pg
let pg = require('pg');
let connectionString = 'postgres://localhost';

//test
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

User.remove({}, function (err) { });

let user = {
    username: "username123",
    password: "password123"
};

let projects = [
    {   
        name: "Test project 001"
    },
    {   
        name: "Test project 002"
    }
];

let tasks =[
    {
        name: "Test task 001",
        status: "uncompleted",
        priority: 0,
        deadline: null,
    },
    {
        name: "Test task 002",
        status: "uncompleted",
        priority: 0,
        deadline: null,
    }
]

chai.request(server)
    .post('/user/register')
    .send(user)
    .end(function (err, res) {
        user.token = res.body.token;
        user._id = JSON.parse(new Buffer(res.body.token.split('.')[1], 'base64').toString())._id;
        createProjects(user._id);
    });

let createProjects = function (user_id) {
    pg.connect(connectionString, function(err, client, done) {
        if(err) { done(); }
        client.query('INSERT INTO projects(name, user_id) values($1, $2)', [projects[0].name, user_id]);
        client.query('INSERT INTO projects(name, user_id) values($1, $2)', [projects[1].name, user_id]);
        getProjects(user_id);
        done();
    });    
};

let getProjects = function (user_id) {
    pg.connect(connectionString, function(err, client, done) {
        if(err) { done(); }

        let query = client.query('SELECT * FROM projects WHERE user_id=($1)', [user_id]);
        query.on('row', function(row, result) {
            result.addRow(row);
        });
        query.on('end', function(result) {
            projects = result.rows;
            createTasks(user_id);
            done();
        });

    }); 
};

let createTasks = function (user_id) {
    pg.connect(connectionString, function(err, client, done) {
        if(err) { done(); }
        client.query(
            'INSERT INTO tasks(name, status, priority, project_id, user_id) values($1, $2, $3, $4, $5)',
            [tasks[0].name, tasks[0].status, tasks[0].priority, projects[0].id, user_id]);
        client.query(
            'INSERT INTO tasks(name, status, priority, project_id, user_id) values($1, $2, $3, $4, $5)',
            [tasks[1].name, tasks[1].status, tasks[1].priority, projects[0].id, user_id]);
        getTasks(user_id);
        done();
    });    
};

let getTasks = function (user_id) {
    pg.connect(connectionString, function(err, client, done) {
        if(err) { done(); }

        let query = client.query('SELECT * FROM tasks WHERE user_id=($1)', [user_id]);
        query.on('row', function(row, result) {
            result.addRow(row);
        });
        query.on('end', function(result) {
            tasks = result.rows;
            done();
        });

    }); 
};


describe('TODO list', function() {

    after(function() { 
        
        // pg
        let pg = require('pg');
        let connectionString = 'postgres://localhost';

        pg.connect(connectionString, function(err, client, done) {
            if(err) { done(); }

            //After tests DELETE all tasks and projects
            client.query("DELETE FROM tasks    WHERE user_id=($1)", [user._id]);
            client.query("DELETE FROM projects WHERE user_id=($1)", [user._id]);
            done();
        });
    });

    describe('Prepare projects and tasks', function() {

        it('it should be two projects in db', function(done) {
            projects.should.be.a('array');
            projects.should.have.lengthOf(2);
            projects[0].should.have.property('id');
            projects[0].should.have.property('name').eql('Test project 001');
            projects[0].should.have.property('user_id').eql(user._id);
            done();
        });

        it('it should be two tasks in db', function(done) {
            tasks.should.be.a('array');
            tasks.should.have.lengthOf(2);
            tasks[0].should.have.property('id');
            tasks[0].should.have.property('name').eql('Test task 001');
            tasks[0].should.have.property('status').eql('uncompleted');
            tasks[0].should.have.property('priority').eql(0);
            tasks[0].should.have.property('project_id').eql(projects[0].id);
            tasks[0].should.have.property('user_id').eql(user._id);
            done();
        });
    });

    describe('Projects CRUD', function() {

        it('it should CREATE new project 1', function(done) {

            chai.request(server)
                .post('/api/' + user._id + '/projects')
                .set('Authorization', 'Bearer ' + user.token)
                .send( {name: "New test project 001"} )
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.should.have.lengthOf(3);
                    res.body[0].name.should.be.oneOf(
                        ['Test project 001', 'Test project 002', 'New test project 001']);
                    res.body[1].name.should.be.oneOf(
                        ['Test project 001', 'Test project 002', 'New test project 001']);
                    res.body[2].name.should.be.oneOf(
                        ['Test project 001', 'Test project 002', 'New test project 001']);
                     done();
                });
        });

        it('it should CREATE new project 2', function(done) {

            chai.request(server)
                .post('/api/' + user._id + '/projects')
                .set('Authorization', 'Bearer ' + user.token)
                .send( {name: "New test project 002"} )
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.should.have.lengthOf(4);
                    res.body[0].name.should.be.oneOf(
                        ['Test project 001', 'Test project 002', 'New test project 001', 'New test project 002']);
                    res.body[1].name.should.be.oneOf(
                        ['Test project 001', 'Test project 002', 'New test project 001', 'New test project 002']);
                    res.body[2].name.should.be.oneOf(
                        ['Test project 001', 'Test project 002', 'New test project 001', 'New test project 002']);
                    res.body[3].name.should.be.oneOf(
                        ['Test project 001', 'Test project 002', 'New test project 001', 'New test project 002']);
                    done();
                });
        });

        it('it should GET 4 projects', function(done) {

            chai.request(server)
                .get('/api/' + user._id + '/projects')
                .set('Authorization', 'Bearer ' + user.token)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.should.have.lengthOf(4);
                    res.body[0].user_id.should.be.eql(user._id);
                    res.body[0].name.should.be.oneOf(
                        ['Test project 001', 'Test project 002', 'New test project 001', 'New test project 002']);
                    res.body[1].name.should.be.oneOf(
                        ['Test project 001', 'Test project 002', 'New test project 001', 'New test project 002']);
                    res.body[2].name.should.be.oneOf(
                        ['Test project 001', 'Test project 002', 'New test project 001', 'New test project 002']);
                    res.body[3].name.should.be.oneOf(
                        ['Test project 001', 'Test project 002', 'New test project 001', 'New test project 002']);
                    done();
                });
        });

        it('it should UPDATE project #1', function(done) {

            chai.request(server)
                .put('/api/' + user._id + '/projects/' + projects[0].id)
                .set('Authorization', 'Bearer ' + user.token)
                .send(
                    {
                        id: projects[0].id,
                        name: "Renamed test project 001",
                        user_id: user._id
                    }
                )
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.should.have.lengthOf(4);
                    res.body[0].name.should.be.oneOf(
                        ['Test project 002', 'New test project 001', 'New test project 002','Renamed test project 001']);
                    res.body[1].name.should.be.oneOf(
                        ['Test project 002', 'New test project 001', 'New test project 002','Renamed test project 001']);
                    res.body[2].name.should.be.oneOf(
                        ['Test project 002', 'New test project 001', 'New test project 002','Renamed test project 001']);
                    res.body[3].name.should.be.oneOf(
                        ['Test project 002', 'New test project 001', 'New test project 002','Renamed test project 001']);
                    done(); 
                });
        });     

        it('it should DELETE project #2', function(done) {

            chai.request(server)
                .delete('/api/' + user._id + '/projects/' + projects[1].id)
                .set('Authorization', 'Bearer ' + user.token)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.should.have.lengthOf(3);
                    res.body[0].name.should.be.oneOf(
                        ['New test project 001', 'New test project 002','Renamed test project 001']);
                    res.body[1].name.should.be.oneOf(
                        ['New test project 001', 'New test project 002','Renamed test project 001']);
                    res.body[2].name.should.be.oneOf(
                        ['New test project 001', 'New test project 002','Renamed test project 001']);
                    done();
                });
        });  

        it('it should GET 3 projects', function(done) {

            chai.request(server)
                .get('/api/' + user._id + '/projects')
                .set('Authorization', 'Bearer ' + user.token)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.should.have.lengthOf(3);
                    res.body[0].name.should.be.oneOf(
                        ['New test project 001', 'New test project 002','Renamed test project 001']);
                    res.body[1].name.should.be.oneOf(
                        ['New test project 001', 'New test project 002','Renamed test project 001']);
                    res.body[2].name.should.be.oneOf(
                        ['New test project 001', 'New test project 002','Renamed test project 001']);
                    done();
                });
        });

    });

    describe('Tasks CRUD', function() {

        it('it should CREATE new task 1', function(done) {

            chai.request(server)
                .post('/api/' + user._id + '/tasks')
                .set('Authorization', 'Bearer ' + user.token)
                .send( {name: "New test task 001", project_id: projects[0].id} )
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.should.have.lengthOf(3);
                    res.body[0].name.should.be.oneOf(
                        ['Test task 001', 'Test task 002', 'New test task 001']);
                    res.body[1].name.should.be.oneOf(
                        ['Test task 001', 'Test task 002', 'New test task 001']);
                    res.body[2].name.should.be.oneOf(
                        ['Test task 001', 'Test task 002', 'New test task 001']);
                     done();
                });
        });

        it('it should CREATE new task 2', function(done) {

            chai.request(server)
                .post('/api/' + user._id + '/tasks')
                .set('Authorization', 'Bearer ' + user.token)
                .send( {name: "New test task 002", project_id: projects[0].id} )
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.should.have.lengthOf(4);
                    res.body[0].name.should.be.oneOf(
                        ['Test task 001', 'Test task 002', 'New test task 001', 'New test task 002']);
                    res.body[1].name.should.be.oneOf(
                        ['Test task 001', 'Test task 002', 'New test task 001', 'New test task 002']);
                    res.body[2].name.should.be.oneOf(
                        ['Test task 001', 'Test task 002', 'New test task 001', 'New test task 002']);
                    res.body[3].name.should.be.oneOf(
                        ['Test task 001', 'Test task 002', 'New test task 001', 'New test task 002']);
                    done();
                });
        });
        
        it('it should GET 4 tasks', function(done) {

            chai.request(server)
                .get('/api/' + user._id + '/tasks')
                .set('Authorization', 'Bearer ' + user.token)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.should.have.lengthOf(4);
                    res.body[0].project_id.should.be.eql(projects[0].id);
                    res.body[0].user_id.should.be.eql(user._id);
                    res.body[0].name.should.be.oneOf(
                        ['Test task 001', 'Test task 002', 'New test task 001', 'New test task 002']);
                    res.body[1].name.should.be.oneOf(
                        ['Test task 001', 'Test task 002', 'New test task 001', 'New test task 002']);
                    res.body[2].name.should.be.oneOf(
                        ['Test task 001', 'Test task 002', 'New test task 001', 'New test task 002']);
                    res.body[3].name.should.be.oneOf(
                        ['Test task 001', 'Test task 002', 'New test task 001', 'New test task 002']);
                    done();
                });
        });
        
        it('it should UPDATE task #1', function(done) {

            chai.request(server)
                .put('/api/' + user._id + '/tasks/' + tasks[0].id)
                .set('Authorization', 'Bearer ' + user.token)
                .send(
                    {
                        id: tasks[0].id,
                        name: "Renamed test task 001",
                        project_id: projects[0].id,
                        user_id: user._id
                    }
                )
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.should.have.lengthOf(4);
                    res.body[0].name.should.be.oneOf(
                        ['Test task 002', 'New test task 001', 'New test task 002', 'Renamed test task 001']);
                    res.body[1].name.should.be.oneOf(
                        ['Test task 002', 'New test task 001', 'New test task 002', 'Renamed test task 001']);
                    res.body[2].name.should.be.oneOf(
                        ['Test task 002', 'New test task 001', 'New test task 002', 'Renamed test task 001']);
                    res.body[3].name.should.be.oneOf(
                        ['Test task 002', 'New test task 001', 'New test task 002', 'Renamed test task 001']);
                    done(); 
                });
        });     
        
        it('it should DELETE task #2', function(done) {

            chai.request(server)
                .delete('/api/' + user._id + '/tasks/' + tasks[1].id)
                .set('Authorization', 'Bearer ' + user.token)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.should.have.lengthOf(3);
                    res.body[0].name.should.be.oneOf(
                        ['New test task 001', 'New test task 002','Renamed test task 001']);
                    res.body[1].name.should.be.oneOf(
                        ['New test task 001', 'New test task 002','Renamed test task 001']);
                    res.body[2].name.should.be.oneOf(
                        ['New test task 001', 'New test task 002','Renamed test task 001']);
                    done();
                });
        });
          
    });
});