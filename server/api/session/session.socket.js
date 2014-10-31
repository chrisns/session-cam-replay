/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var session = require('./session.model.js');

exports.register = function(socket) {
  session.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  session.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
};

function onSave(socket, doc, cb) {
  socket.emit('session:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('session:remove', doc);
}
