let express = require('express');
let path = require('path');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let methodOverride = require('method-override');

let port = 8080;

let pg       = require('pg'); 
let mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost');

let passport = require('passport');

require('./models/Users');
require('./config/passport');

let routes = require('./routes/index');

let app = express();

if (app.get('env') === 'test') {
    port = 8081;
}

if (app.get('env') !== 'test') {
    app.use(logger('dev'));
}
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride());

app.use(passport.initialize());

app.use('/', routes);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

if (app.get('env') === 'development') {
    // development error handler
    // will print stacktrace
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        console.log(err.message);
        console.log(err.stack);
        res.json({message: err.message, error: err});
    });
} else {
    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.json({message: err.message});
    });
}

// run app
app.set('port', process.env.PORT || port);

let server = app.listen(app.get('port'), function() {
  console.log('Server listening on port ' + server.address().port);
});

module.exports = app;
