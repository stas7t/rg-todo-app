//------------Postgress db---------
//uncomment to create tables in db
//require('../models/Projects');
//require('../models/Tasks');

let express = require('express');
let router = express.Router();

let pg = require('pg');
let connectionString = process.env.DATABASE_URL || 'postgres://localhost';

let mongoose = require('mongoose');
let passport = require('passport');
let jwt = require('express-jwt');
let User = mongoose.model('User');

let auth = jwt({secret: process.env.SECRET || 'rubygarage2017rubygarage', userProperty: 'payload'});


// GET index.html
router.get('/', function(req, res) {
    res.sendfile('./public/index.html');
});


// User login/register
router.post('/user/register', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  } else if (req.body.password.length < 6) {
    return res.status(400).json({message: 'Password min length 6 symbols'});
  }

  // Check is user already in DB
  let isUserExists = false;

  User.findOne({ username: req.body.username }, function (err, user) {
      
    if (err) { return next(err); }

    if (user) {
        isUserExists = true;
    }
  });


  let user = new User();

  user.username = req.body.username;

  user.setPassword(req.body.password)

  user.save(function (err) {
    if(err){ 
        if (isUserExists) {
            return res.status(409).json({message: 'This username already exists'});            
        } else {return next(err);}    
    }

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


// TODO list api
// projects ==============================================================
// get all projects
router.get('/api/:user_id/projects', auth, function(req, res) {
    let results = [];

    let user_id = req.params.user_id;

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
        if(err) {
        done();
        console.log(err);
        return res.status(500).json({success: false, data: err});
        }
        // SQL Query > Select Data
        let query = client.query('SELECT * FROM projects WHERE user_id=($1)', [user_id]);
        // Stream results back one row at a time
        query.on('row', function(row) {
        results.push(row);
        });
        // After all data is returned, close connection and return results
        query.on('end', function() {
        done();
        return res.json(results);
        });
    });

});

// create project
router.post('/api/:user_id/projects', auth, function(req, res) {
    let results = [];

    let user_id = req.params.user_id;
    let data = {name: req.body.name};

    if (!req.body.name) {
        //console.log('No name: TODO list name required');
        return res.status(400).json({success: false, data: 'No name: TODO list name required'});
    }

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
        let query = client.query('SELECT * FROM projects WHERE user_id=($1)', [user_id]);
        // Stream results back one row at a time
        query.on('row', function(row) {
        results.push(row);
        });
        // After all data is returned, close connection and return results
        query.on('end', function() {
        done();
        return res.json(results);
        });
    });

});

// update a project
router.put('/api/:user_id/projects/:project_id', auth, function(req, res) {
    let results = [];

    let user_id = req.params.user_id;
    let id = req.params.project_id;
    let name = req.body.name;

    if (!req.body.name) {
        //console.log('No name: TODO list name required');
        return res.status(400).json({success: false, data: 'No name: TODO list name required'});
    }

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
        let query = client.query('SELECT * FROM projects WHERE user_id=($1)', [user_id]);
        // Stream results back one row at a time
        query.on('row', function(row) {
        results.push(row);
        });
        // After all data is returned, close connection and return results
        query.on('end', function() {
        done();
        return res.json(results);
        });
    });

});

// delete a project
router.delete('/api/:user_id/projects/:project_id', auth, function(req, res) {
    let results = [];

    let user_id = req.params.user_id;
    let id = req.params.project_id;

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
        let query = client.query('SELECT * FROM projects WHERE user_id=($1)', [user_id]);
        // Stream results back one row at a time
        query.on('row', function(row) {
        results.push(row);
        });
        // After all data is returned, close connection and return results
        query.on('end', function() {
        done();
        return res.json(results);
        });
    });

});

// tasks =================================================================
// get all tasks
router.get('/api/:user_id/tasks', auth, function(req, res) {
    let results = [];

    let user_id = req.params.user_id;

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
        if(err) {
        done();
        console.log(err);
        return res.status(500).json({success: false, data: err});
        }
        // SQL Query > Select Data
        let query = client.query(
        'SELECT * FROM tasks WHERE user_id=($1)', [user_id]);
        // Stream results back one row at a time
        query.on('row', function(row) {
        results.push(row);
        });
        // After all data is returned, close connection and return results
        query.on('end', function() {
        done();
        return res.json(results);
        });
    });

});

// create task
router.post('/api/:user_id/tasks', auth, function(req, res) {
    let results = [];

    let user_id = req.params.user_id;
    let data = {name: req.body.name, status: 'uncompleted', priority: 0, project_id: req.body.project_id};

    if (!req.body.name) {
        //console.log('No name: task name required');
        return res.status(400).json({success: false, data: 'No name: task name required'});
    }

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
        let query = client.query('SELECT * FROM tasks WHERE user_id=($1)', [user_id]);
        // Stream results back one row at a time
        query.on('row', function(row) {
        results.push(row);
        });
        // After all data is returned, close connection and return results
        query.on('end', function() {
        done();
        return res.json(results);
        });
    });

});

// update a task
router.put('/api/:user_id/tasks/:task_id', auth, function(req, res) {
    let results = [];

    let user_id = req.params.user_id;
    let task_id = req.params.task_id;

    let name = req.body.name;
    let status = req.body.status;
    let priority = req.body.priority;
    let deadline = req.body.deadline;

    if (!name) {
        //console.log('No name: task name required');
        return res.status(400).json({success: false, data: 'No name: task name required'});
    }

    if (!status) {
        status = 'uncompleted'
    } else if (['completed', 'uncompleted', 'uncompleted expired'].indexOf(status) === -1) {
        return res.status(400).json({success: false, data: "Unknown status: status must be 'completed', 'uncompleted' or 'uncompleted expired'"});
    }

    if (!priority) {
        priority = 0;
    } else if ( isNaN( Number( priority ) ) ) {
        //console.log('Wrong data type: priority must be a number');
        return res.status(400).json({success: false, data: 'Wrong data type: priority must be a number'});
    }

    let reISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;

    if (!deadline) {
        deadline = null;
    } else if (!deadline.match(reISO)) {
        return res.status(400).json({success: false, data: 'Wrong format: deadline date format must be ISO'});
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
        client.query('UPDATE tasks SET name=($1), status=($2), priority=($3), deadline=($4) WHERE id=($5) AND user_id=($6)', [name, status, priority, deadline, task_id, user_id]);

        // SQL Query > Select Data
        let query = client.query('SELECT * FROM tasks WHERE user_id=($1)', [user_id]);
        // Stream results back one row at a time
        query.on('row', function(row) {
        results.push(row);
        });
        // After all data is returned, close connection and return results
        query.on('end', function() {
        done();
        return res.json(results);
        });
    });

});

// delete a task
router.delete('/api/:user_id/tasks/:task_id', auth, function(req, res) {
    let results = [];

    let user_id = req.params.user_id;
    let id = req.params.task_id;

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
        let query = client.query('SELECT * FROM tasks WHERE user_id=($1)', [user_id]);
        // Stream results back one row at a time
        query.on('row', function(row) {
        results.push(row);
        });
        // After all data is returned, close connection and return results
        query.on('end', function() {
        done();
        return res.json(results);
        });
    });

});
// ==========================================


module.exports = router;