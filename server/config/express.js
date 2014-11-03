/**
 * Express configuration
 */

'use strict';

var express = require('express');
var httpProxy = require('http-proxy');
var fs = require('fs');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var compression = require('compression');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var errorHandler = require('errorhandler');
var path = require('path');
var config = require('./environment');

module.exports = function(app) {
  var env = app.get('env');

  var proxy = httpProxy.createProxy();
  app.use('/sc',   function (req, res, next) {

    var _write = res.write;
    res.write = function (data) {
      data = data.toString();
      data = data.replace(/href="\//g, "href=\"/sc/");
      data = data.replace(/src="\//g, "src=\"/sc/");
      _write.call(res, data);
    };

    var _writeHead = res.writeHead;
    res.writeHead = function (data) {

      var location;
      if (location = this.getHeader('location')) {
        this.setHeader('location', '/sc' + location);
      }

      var cookie;
      if (cookie = this.getHeader('set-cookie')) {
        this.setHeader('set-cookie', cookie.toString().replace('secure', ''));
      }

      // Call the original method !!! see text
      _writeHead.apply(this, arguments);
    };

    next();
  });
  app.use('/sc', function(req, res) {
    proxy.web(req, res, {
      target: 'https://console.sessioncam.com'
    });
  });

  app.set('views', config.root + '/server/views');
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');
  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(cookieParser());

  if ('production' === env) {
    app.use(favicon(path.join(config.root, 'public', 'favicon.ico')));
    app.use(express.static(path.join(config.root, 'public')));
    app.set('appPath', config.root + '/public');
    app.use(morgan('dev'));
  }

  if ('development' === env || 'test' === env) {
    app.use(require('connect-livereload')());
    app.use(express.static(path.join(config.root, '.tmp')));
    app.use(express.static(path.join(config.root, 'client')));
    app.set('appPath', 'client');
    app.use(morgan('dev'));
    app.use(errorHandler()); // Error handler - has to be last
  }
};
