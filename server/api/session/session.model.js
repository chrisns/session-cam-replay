'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var _ = require('lodash');
var url = require('url');

var SessionSchema = new Schema({
  url: String,
  duration: Number,
  ContentWrappers: Schema.Types.Mixed,
  SentDate: Date,
  TransactionId: String,
  Version: Number
});

var Session = mongoose.model('Session', SessionSchema);

Session.transformSessionCams = function(sessions) {
  var newSessions = _.map(sessions, function(session) {
    // This is already normalised, return original object
    if ( !session.ContentWrappers ) {
      return session;
    }

    // Pull out stuff from SessionCam noise
    session = session.ContentWrappers[0].Content;

    // URL - https://console.sessioncam.com/Dashboard/Playback/?SessionId=ceefdc1c-b184-4eb0-950c-8ced80f46e64&starttime=635499082780000000
    var playbackUrl = (function () {
      var playbackUrl = url.parse('https://localhost:8000/Dashboard/Playback/');
      playbackUrl.query = {
        SessionId: session.SessionId,
        starttime: ((Date.parse(session.UTCStartDateTime) / 1000) + 62135636400) * 10000000
      };
      return url.format(playbackUrl);
    })(session);

    // Duration of playback
    var duration = Date.parse(session.UTCEndDateTime) - Date.parse(session.UTCStartDateTime);

    // Return normalised obj
    return {
      url: playbackUrl,
      duration: duration
    }

  });

  return newSessions;
};

module.exports = Session;
