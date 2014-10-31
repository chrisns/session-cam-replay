'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SessionSchema = new Schema({
  url: String,
  duration: Number
});

module.exports = mongoose.model('Session', SessionSchema);
