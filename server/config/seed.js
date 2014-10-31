/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Session = require('../api/session/session.model');


Session.find({}).remove(function() {
  Session.create(
    { url: 'http://www.sessioncam.com', duration: 10000 },
    { url: 'http://www.everline.com', duration: 10000 },
    { url: 'http://waww.com.au', duration: 10000 }
  );
});
