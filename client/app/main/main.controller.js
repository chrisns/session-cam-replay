'use strict';

angular.module('sessionCamReplayApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    $scope.sessions = [];

    $scope.newSession = 'http://icanhazip.com';
    $scope.newSessionTime = 10000;

    $http.get('/api/sessions').success(function(sessions) {
      $scope.sessions = sessions;
      socket.syncUpdates('session', $scope.sessions);
    });

    $scope.addSession = function() {
      if ($scope.newSession === '') {
        return;
      }
      $http.post('/api/sessions', {
        url: $scope.newSession,
        duration: $scope.newSessionTime
      });
      $scope.newSession = '';
      $scope.newSessionTime = '';
    };

    $scope.deleteThing = function(session) {
      $http.delete('/api/sessions/' + session._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('session');
    });
  });
