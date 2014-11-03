'use strict';

angular.module('sessionCamReplayApp')
  .directive('player', function ($sce, $timeout, $log) {
    return {
      templateUrl: 'app/player/player.html',
      restrict: 'EA',
      scope: {
        sessions: '='
      },
      link: function (scope, element, attrs) {

        function loadSession() {
          var session = scope.sessions[Math.floor(Math.random() * scope.sessions.length)];
          if ( session ) {
            $log.info('Loading ' + session.url + ' for ' + session.duration + ' seconds');
            scope.currentProjectUrl = $sce.trustAsResourceUrl(session.url);
            $timeout(loadSession, session.duration);
          }
        }

        // This doesn't get fired from socket.io for some reason
        scope.$watch('sessions', function (newValue) {
          if ( newValue.length > 0 ) {
            loadSession();
          }
        });

      }
    };
  });
