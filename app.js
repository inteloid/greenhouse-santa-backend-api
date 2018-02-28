var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors')
var swaggerUi = require('swagger-ui-express');
var swaggerJSDoc = require('swagger-jsdoc');
var mongoose = require('mongoose');
var config = require('./config');

var jwt = require('jsonwebtoken');

var passport = require("passport");
var passportJWT = require("passport-jwt");

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

var app = express();

require('./model/user');

var db1 = mongoose.createConnection(process.env.MONGO_URL || config.mongo.dbUrl, {
    user: process.env.MONGO_USERNAME || config.mongo.user,
    pass: process.env.MONGO_PASSWORD || config.mongo.pass,
    server: config.mongo.server
});

app.db1 = {
    users: db1.model('users')
};


var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
jwtOptions.secretOrKey = 'CHANGE_THIS';

var strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
    console.log('payload received', jwt_payload);
    var user = app.db1.users.find({id: jwt_payload.id});

    console.log('user >>>', user);

    if (user) {
        next(null, user);
    } else {
        next(null, false);
    }
});

passport.use(strategy);
app.use(passport.initialize());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())

var swaggerDefinition = {
    info: {
        title: 'platform73 API',
        version: '1.0.0',
        description: 'Documentation for entity-api',
    },
    host: '35.227.96.112',
    basePath: '/api/v1/',
};

var options = {
    swaggerDefinition: swaggerDefinition,
    apis: ['./routes/*.js', 'docs/swagger.yml'],
};

var swaggerSpec = swaggerJSDoc(options);
app.get('/api-docs.json', function (req, res) {
    res.send(swaggerSpec);
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(null, {swaggerUrl: '/api-docs.json'}));

require('./controller/api')(app, passport);

app.post("/login", function (req, res) {
        var login;
        var password;
        if (req.body.login && req.body.password) {
            login = req.body.login;
            password = req.body.password;
        } else {
            res.status(401).json({message: "no such user found"});
        }
        // usually this would be a database call:
        var user = app.db1.users.findOne({login: login}).exec(function (err, user) {
            if (err) {
                res.status(401).json({message: "no such user found"});
                return;
            }
            if (user.password === password) {
                // from now on we'll identify the user by the id and the id is the only personalized value that goes into our token
                var payload = {id: user.id};
                var token = jwt.sign(payload, jwtOptions.secretOrKey);
                res.json({message: "ok", token: token});
            } else {
                res.status(401).json({message: "passwords did not match"});
            }
        });
    }
);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
