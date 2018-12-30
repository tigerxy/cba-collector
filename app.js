var createError = require('http-errors');
var express = require('express');
var expressWs = require('express-ws');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var exapp = expressWs(express());
var app = exapp.app;

var db = require('./model/db');
db.on('db', function (data) { 
  console.log('emit app.js');
  app.emit('db', data); 
});
/*db.tree.watch().on('change', function (data) {
  app.emit('db',data);
});
/*exapp.getWss().addListener('connect', function (ws) {
  console.log('connected1');
  clients.push(ws);
});*/

var indexRouter = require('./routes/index');
var tokenRouter = require('./routes/token');
var apiRouter = require('./routes/api');
var api2Router = require('./routes/api2');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/map', tokenRouter);
app.use('/api', apiRouter);
app.use('/api2', api2Router);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
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
