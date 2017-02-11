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
var connectionString = process.env.DATABASE_URL || 'postgres://localhost'

var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('express-jwt');
var User = mongoose.model('User');

var auth = jwt({secret: process.env.SECRET || 'rubygarage2017rubygarage', userProperty: 'payload'});

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


// TODO list api -----------------------------------------------------------
// projects ================================================================
// get all projects
router.get('/api/:user_id/projects', auth, function(req, res) {
    const results = [];

    const user_id = req.params.user_id;

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
        if(err) {
        done();
        console.log(err);
        return res.status(500).json({success: false, data: err});
        }
        // SQL Query > Select Data
        const query = client.query('SELECT * FROM projects WHERE user_id=($1)', [user_id]);
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
router.post('/api/:user_id/projects', auth, function(req, res) {
    const results = [];

    const user_id = req.params.user_id;
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
        client.query('INSERT INTO projects(name, user_id) values($1, $2)', [data.name, user_id]);
        // SQL Query > Select Data
        const query = client.query('SELECT * FROM projects WHERE user_id=($1)', [user_id]);
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
router.put('/api/:user_id/projects/:project_id', auth, function(req, res) {
    const results = [];

    const user_id = req.params.user_id;
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
        client.query('UPDATE projects SET name=($1) WHERE id=($2) AND user_id=($3)', [name, id, user_id]);
        // SQL Query > Select Data
        var query = client.query('SELECT * FROM projects WHERE user_id=($1)', [user_id]);
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
router.delete('/api/:user_id/projects/:project_id', auth, function(req, res) {
    const results = [];

    const user_id = req.params.user_id;
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
        client.query('DELETE FROM tasks WHERE project_id=($1) AND user_id=($2)', [id, user_id]);
        // Delete project
        client.query('DELETE FROM projects WHERE id=($1) AND user_id=($2)', [id, user_id]);
        // SQL Query > Select Data
        var query = client.query('SELECT * FROM projects WHERE user_id=($1)', [user_id]);
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
router.get('/api/:user_id/tasks', auth, function(req, res) {
    const results = [];

    const user_id = req.params.user_id;

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
        'SELECT * FROM tasks WHERE user_id=($1)', [user_id]);
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
router.post('/api/:user_id/tasks', auth, function(req, res) {
    const results = [];

    const user_id = req.params.user_id;
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
        client.query('INSERT INTO tasks(name, status, priority, project_id, user_id) values($1, $2, $3, $4, $5)',
        [data.name, data.status, data.priority, data.project_id, user_id]);
        // SQL Query > Select Data
        const query = client.query('SELECT * FROM tasks WHERE user_id=($1)', [user_id]);
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
router.put('/api/:user_id/tasks/:task_id', auth, function(req, res) {
    const results = [];

    const user_id = req.params.user_id;
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
        client.query('UPDATE tasks SET name=($1), status=($2), priority=($3), deadline=($4) WHERE id=($5) AND user_id=($6)', [name, status, priority, deadline, id, user_id]);

        // SQL Query > Select Data
        const query = client.query('SELECT * FROM tasks WHERE user_id=($1)', [user_id]);
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
router.delete('/api/:user_id/tasks/:task_id', auth, function(req, res) {
    const results = [];

    const user_id = req.params.user_id;
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
        client.query('DELETE FROM tasks WHERE id=($1) AND user_id=($2)', [id, user_id]);
        // SQL Query > Select Data
        const query = client.query('SELECT * FROM tasks WHERE user_id=($1)', [user_id]);
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
