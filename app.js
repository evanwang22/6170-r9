var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var session = require('express-session');
var csrf = require('csurf');

var db = require('./db');
var routes = require('./routes/index');
var users = require('./routes/users');
var notes = require('./routes/notes');
var sessions_controller = require('./routes/sessions');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// All views rendered via layout.ejs as "body"
app.use(partials());

app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

app.use(csrf());

// Authentication middleware
// Check that the user's session passed in req.session is valid
app.use(function(req, res, next) {
    if (req.session.userId) {
        var users = db.get('users');
        users.findOne({
            _id: req.session.userId
        }, function(err, user) {
            if (user) {
                req.currentUser = user;
            } else {
                delete req.session.userId;
            }
            next();
        });
    } else {
        next();
    }
});

// // Allow Cross Origin Resource Sharing
// app.all('*', function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", req.headers.origin);
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
//  });

app.use('/', routes);
app.use('/users', users);
app.use('/notes', notes);
app.use('/sessions', sessions_controller);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
