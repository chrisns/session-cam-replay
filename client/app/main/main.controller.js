'use strict';

angular.module('sessionCamReplayApp')
  .controller('MainCtrl', function ($scope, $http, $interval) {
    $scope.sessions = [];

    $scope.newSession = 'http://icanhazip.com';
    $scope.newSessionTime = 10000;

    function loadSessions() {
      console.log('loading sessions');
      $http.get('api/sessions').success(function(sessions) {
        $scope.sessions = sessions;
      });
    }
    $interval(loadSessions, 60000);
    loadSessions();

    $scope.addSession = function() {
      if ($scope.newSession === '') {
        return;
      }
      $http.post('api/sessions', {
        url: $scope.newSession,
        duration: $scope.newSessionTime
      });
      $scope.newSession = '';
      $scope.newSessionTime = '';
    };

    $scope.deleteThing = function(session) {
      $http.delete('api/sessions/' + session._id);
    };

    $scope.$on('$destroy', function () {
    });
  });
