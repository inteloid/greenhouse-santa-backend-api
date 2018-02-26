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

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
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
app.get('/api-docs.json', function(req, res) {
  res.send(swaggerSpec);
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(null, {swaggerUrl: '/api-docs.json'}));

require('./controller/api')(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
