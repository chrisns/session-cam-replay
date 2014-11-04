/**
 * Express configuration
 */

'use strict';

var https = require('https');
var httpProxy = require('http-proxy');
var fs = require('fs');

module.exports = function(app) {

  var proxy = httpProxy.createProxyServer({
    target: {
      host: 'localhost',
      port: 9000
    }
  });
  var privateKey = fs.readFileSync('./server/server.key').toString();
  var certificate = fs.readFileSync('./server/server.crt').toString();
  var credentials = {key: privateKey, cert: certificate};
  var server = require('https').createServer(credentials, function (req, res) {

    // Proxy to our Node Server
    if ( req.url.indexOf('/replay') === 0 || req.url.indexOf('/socket.io-client') === 0)  {
      proxy.web(req, res, { target: 'http://localhost:9000' });
    }
    // Proxy to Session Cam
    else {
      proxy.web(req, res, { target: 'https://console.sessioncam.com' });
    }

  }).listen(8000);

  proxy.on('upgrade', function (req, socket, head) {
    console.log('proxy socket');
    proxy.ws(req, socket, head);
  });

};
