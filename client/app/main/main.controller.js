'use strict';

angular.module('sessionCamReplayApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    $scope.sessions = [
      { url: 'http://www.sessioncam.com', duration: 10000 },
      { url: 'http://www.everline.com', duration: 10000 },
      { url: 'http://waww.com.au', duration: 10000 }
    ];

    $http.get('/api/sessions').success(function(sessions) {
      $scope.sessions = sessions;
      socket.syncUpdates('sessions', $scope.sessions);
    });

    $scope.addSession = function() {
      if($scope.newSession === '') {
        return;
      }
      $http.post('/api/sessions', { name: $scope.newSession });
      $scope.newSession = '';
    };

    $scope.deleteThing = function(session) {
      $http.delete('/api/sessions/' + session._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('sessions');
    });
  });
