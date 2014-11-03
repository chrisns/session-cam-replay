'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SessionSchema = new Schema({
  url: String,
  duration: Number,
  ContentWrappers: Schema.Types.Mixed,
  SentDate: Date,
  TransactionId: String,
  Version: Number
});

module.exports = mongoose.model('Session', SessionSchema);
