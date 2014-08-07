var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes');
var User = require('./controllers/User');
var newsPost  = require('./controllers/NewsPost')

var app = express();
var View = require("./views/Base");


// view engine setup
app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'hjs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(cookieParser('secret'));
app.use(express.session({secret:'secret'}));
 

app.use(require('less-middleware')({ src: path.join(__dirname, 'public') }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);


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
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.render('error', {
        message: err.message,
        error: {}
    });
});


// Import Config Settings 
var config = require('./config')();
 var MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb://' + config.mongo.host + ':' + config.mongo.port + '/newsApp', function(err, db) {
    if(err) {
        console.log('Sorry, there is no mongo db server running.');
    } else {
        var attachDB = function(req, res, next) {
            console.log("attachDB");
            console.log(db)
            req.db = db;
            next();
        };

        // check for counters whether they are set or not
        

        app.get('/', routes.index);
        
        app.get('/news/add', attachDB, function(req, res, next){
            console.log("Hello")
            newsPost.newsForm(req, res, next)
        });
        app.post('/news/:id/addComment', attachDB, function( req, res, next){
            console.log("adding comment ")
            
            newsPost.addComment(req, res, next)
        });
        app.post('/news/create', attachDB, function( req, res, next){
            console.log("adding Post")
            console.log(req.body + "--Over")
            newsPost.add(req, res, next)



        });

        app.get('/sign_up',attachDB, function(req, res, next){
            var v = new View(res, 'newUser');
            v.render();
        });


        app.post('/sign_up',attachDB, function(req, res, next){
            User.create(req, res, next);
        });

        app.get('/login',function(req, res, next){
            User.loginPage(req, res, next);
        } ); 
        app.post('/login',attachDB,function(req, res, next){
            User.login(req, res, next);
        }); 
        app.get('/logout',function(req, res, next){
            User.logout(req, res, next);
        }); 
        app.get('/news/:id',attachDB,function(req, res, next){
            newsPost.view(req, res, next);
        });

        app.all('/news', attachDB, function(req, res, next) {
            newsPost.run(req, res, next);
        });
          

        http.createServer(app).listen(config.port, function(){
            console.log('Express server listening on port ' + config.port);
        });
    }
});



module.exports = app;
