//Test TODO list api
describe('TODO list creare/get api', function() {



    before (function() { 

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

        // pg
        let pg = require('pg');
        let connectionString = 'postgres://localhost';

        pg.connect(connectionString, function(err, client, done) {
            if(err) { done(); }

            //Before test DELETE all tasks in tasks table
            
            let query = client.query( 
            "DELETE FROM tasks");
            //console.log(user._id + ' ///DELETE FROM tasks');
            query.on('end', function() {
            done();
            });
            
            //Before test DELETE all projects in projects table
            
            query = client.query( 
            "DELETE FROM projects");
            //console.log(user._id + ' ///DELETE FROM projects');
            query.on('end', function() {
            done();
            });

        });

    });

    // Test the Projects CRUD

    describe('Projects CREATE/GET', function() {
        it('it should CREATE two new projects', function() {

            chai.request(server)
                .post('/api/' + user._id + '/projects')
                .set('Authorization', 'Bearer ' + user.token)
                .send(projects[0])
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.should.have.lengthOf(1);
                    res.body[0].should.have.property('name').eql("New test project 1");
                });

            chai.request(server)
                .post('/api/' + user._id + '/projects')
                .set('Authorization', 'Bearer ' + user.token)
                .send(projects[1])
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.should.have.lengthOf(2);
                    res.body[1].should.have.property('name').eql("New test project 2");
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
                });
        });
    });
    
    describe('Projects UD', function() {
        it('it should UPDATE project #1', function() {

            projects[0].name = "Renamed test project 1";

            chai.request(server)
                .put('/api/' + user._id + '/projects/' + projects[0].id)
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

            let projects = [
                {   
                    name: "New test project 2",
                    user_id: user._id
                },
                {   
                    name: "Renamed test project 1",
                    user_id: user._id
                }
            ];

            chai.request(server)
                .get('/api/' + user._id + '/projects')
                .set('Authorization', 'Bearer ' + user.token)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.should.have.lengthOf(2);
                    res.body[0].should.have.property('name').eql("New test project 1");
                    res.body[1].should.have.property('name').eql("New test project 2");

                    projects[0].id = res.body[0].id;
                    projects[1].id = res.body[1].id;
                });
            console.log('del ---');
            console.log(projects);
            chai.request(server)
                .delete('/api/' + user._id + '/projects/' + projects[1].id)
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

/*
describe('TODO list update/delete api', function() {
    let user = {
        username: "testuser-002u",
        password: "testuser-002P"
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

    chai.request(server)
        .post('/api/' + user._id + '/projects')
        .set('Authorization', 'Bearer ' + user.token)
        .send(projects[0])
        .end(function (err, res) {
        projects[0].id = res.body[0].id;
        });

    chai.request(server)
        .post('/api/' + user._id + '/projects')
        .set('Authorization', 'Bearer ' + user.token)
        .send(projects[1])
        .end(function (err, res) {
        projects[1].id = res.body[1].id;
        });

    describe('Projects UPDATE/DELETE', function() {
        it('it should UPDATE project #1', function() {

            projects[0].name = "Renamed test project 1";

            chai.request(server)
                .put('/api/' + user._id + '/projects/' + projects[0].id)
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
                .delete('/api/' + user._id + '/projects/' + projects[1].id)
                .set('Authorization', 'Bearer ' + user.token)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.should.have.lengthOf(1);
                    res.body[0].should.have.property('name').eql("Renamed test project 1");
                });
        });      
    });


});*/