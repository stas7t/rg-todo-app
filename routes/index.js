//------------Postgress db
//uncomment to create tables in db
//require('../models/project');
//require('../models/task');

//uncomment to modify tables
//require('../models/a');
//------------

var express = require('express');
var router = express.Router();

var pg = require('pg');
var connectionString = process.env.DATABASE_URL

var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('express-jwt');
var User = mongoose.model('User');

var auth = jwt({secret: process.env.SECRET, userProperty: 'payload'});

/* GET home page. */
/*router.get('/', function(req, res) {
  res.render('index', { title: 'Todolist 2' });
});*/

router.get('/', function(req, res) {
    res.sendfile('./public/index.html');
});

router.post('/user/register', function(req, res, next){
    console.log(req.body);
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  var user = new User();

  user.username = req.body.username;

  user.setPassword(req.body.password)

  user.save(function (err){
    if(err){ return next(err); }

    return res.json({token: user.generateJWT()})
  });
});

router.post('/user/login', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  passport.authenticate('local', function(err, user, info){
    if(err){ return next(err); }

    if(user){
      return res.json({token: user.generateJWT()});
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});


// api ---------------------------------------------------------------------

// projects ================================================================
// get all projects
router.get('/api/projects', auth, function(req, res) {
    console.log(req.body);
    const results = [];

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
        if(err) {
        done();
        console.log(err);
        return res.status(500).json({success: false, data: err});
        }
        // SQL Query > Select Data
        const query = client.query('SELECT * FROM projects');
        // Stream results back one row at a time
        query.on('row', (row) => {
        results.push(row);
        });
        // After all data is returned, close connection and return results
        query.on('end', () => {
        done();
        return res.json(results);
        });
    });

});

// create project and send back all projects after creation
router.post('/api/projects', auth, function(req, res) {
    console.log(req.body);
    const results = [];

    const data = {name: req.body.name};

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
        if(err) {
        done();
        console.log(err);
        return res.status(500).json({success: false, data: err});
        }
        // SQL Query > Insert Data
        client.query('INSERT INTO projects(name) values($1)', [data.name]);
        // SQL Query > Select Data
        const query = client.query('SELECT * FROM projects');
        // Stream results back one row at a time
        query.on('row', (row) => {
        results.push(row);
        });
        // After all data is returned, close connection and return results
        query.on('end', () => {
        done();
        return res.json(results);
        });
    });

});

// update a project
router.put('/api/projects/:project_id', auth, function(req, res) {
    console.log(req.body);
    console.log(req.params);
    const results = [];

    const id = req.params.project_id;
    const name = req.body.name;

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
        if(err) {
        done();
        console.log(err);
        return res.status(500).json({success: false, data: err});
        }
        // SQL Query > update Data
        client.query('UPDATE projects SET name=($1) WHERE id=($2)', [name, id]);
        // SQL Query > Select Data
        var query = client.query('SELECT * FROM projects');
        // Stream results back one row at a time
        query.on('row', (row) => {
        results.push(row);
        });
        // After all data is returned, close connection and return results
        query.on('end', () => {
        done();
        return res.json(results);
        });
    });

});

// delete a project
router.delete('/api/projects/:project_id', auth, function(req, res) {
    console.log(req.body);
    console.log(req.params);
    const results = [];

    const id = req.params.project_id;

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
        if(err) {
        done();
        console.log(err);
        return res.status(500).json({success: false, data: err});
        }
        // SQL Query > Delete Data
        // Delete tasks before deleting project
        client.query('DELETE FROM tasks WHERE project_id=($1)', [id]);
        // Delete project
        client.query('DELETE FROM projects WHERE id=($1)', [id]);
        // SQL Query > Select Data
        var query = client.query('SELECT * FROM projects');
        // Stream results back one row at a time
        query.on('row', (row) => {
        results.push(row);
        });
        // After all data is returned, close connection and return results
        query.on('end', () => {
        done();
        return res.json(results);
        });
    });

});

// tasks ================================================================
// get all tasks
router.get('/api/tasks', auth, function(req, res) {
    console.log(req.body);
    const results = [];

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
        if(err) {
        done();
        console.log(err);
        return res.status(500).json({success: false, data: err});
        }
        // SQL Query > Select Data
        const query = client.query(
        'SELECT * FROM tasks');
        // Stream results back one row at a time
        query.on('row', (row) => {
        results.push(row);
        });
        // After all data is returned, close connection and return results
        query.on('end', () => {
        done();
        return res.json(results);
        });
    });

});

// create task and send back all tasks after creation
router.post('/api/tasks', auth, function(req, res) {
    console.log(req.body);
    const results = [];

    const data = {name: req.body.name, status: 'uncompleted', priority: 0, project_id: req.body.project_id};

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
        if(err) {
        done();
        console.log(err);
        return res.status(500).json({success: false, data: err});
        }
        // SQL Query > Insert Data
        client.query('INSERT INTO tasks(name, status, priority, project_id) values($1, $2, $3, $4)',
        [data.name, data.status, data.priority, data.project_id]);
        // SQL Query > Select Data
        const query = client.query('SELECT * FROM tasks');
        // Stream results back one row at a time
        query.on('row', (row) => {
        results.push(row);
        });
        // After all data is returned, close connection and return results
        query.on('end', () => {
        done();
        return res.json(results);
        });
    });

});

// update a task
router.put('/api/tasks/:task_id', auth, function(req, res) {
    console.log(req.body);
    console.log(req.params);
    const results = [];

    const id = req.params.task_id;
    const name = req.body.name;
    const status = req.body.status;
    const priority = req.body.priority;
    
    var deadline = req.body.deadline;

    if (!deadline) {
        deadline = null;
    }

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
        if(err) {
        done();
        console.log(err);
        return res.status(500).json({success: false, data: err});
        }
        // SQL Query > Update Data
        client.query('UPDATE tasks SET name=($1), status=($2), priority=($3), deadline=($4) WHERE id=($5)', [name, status, priority, deadline, id]);

        // SQL Query > Select Data
        const query = client.query('SELECT * FROM tasks');
        // Stream results back one row at a time
        query.on('row', (row) => {
        results.push(row);
        });
        // After all data is returned, close connection and return results
        query.on('end', () => {
        done();
        return res.json(results);
        });
    });

});

// delete a task
router.delete('/api/tasks/:task_id', auth, function(req, res) {
    console.log(req.body);
    console.log(req.params);
    const results = [];

    const id = req.params.task_id;

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
        if(err) {
        done();
        console.log(err);
        return res.status(500).json({success: false, data: err});
        }
        // SQL Query > Delete Data
        client.query('DELETE FROM tasks WHERE id=($1)', [id]);
        // SQL Query > Select Data
        const query = client.query('SELECT * FROM tasks');
        // Stream results back one row at a time
        query.on('row', (row) => {
        results.push(row);
        });
        // After all data is returned, close connection and return results
        query.on('end', () => {
        done();
        return res.json(results);
        });
    });

});
// ==========================================




module.exports = router;
