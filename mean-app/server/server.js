#!/usr/bin/env node

var debug = require('debug')('passport-mongo');
var app = require('./app');
var fs = require('fs');
var server=require('https');


app.set('port', process.env.PORT || 3000);


server.createServer({
      key: fs.readFileSync('local.key'),
      cert: fs.readFileSync('local.crt')
    }, app).listen(3000);
