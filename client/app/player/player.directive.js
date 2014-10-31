'use strict';

angular.module('sessionCamReplayApp')
  .directive('player', function ($sce, $timeout) {
    return {
      templateUrl: 'app/player/player.html',
      restrict: 'EA',
      scope: {
        sessions: '='
      },
      link: function (scope, element, attrs) {

        function loadSession() {
          var session = scope.sessions[Math.floor(Math.random() * scope.sessions.length)];
          scope.currentProjectUrl = $sce.trustAsResourceUrl(session.url);
          $timeout(loadSession, session.duration);
        }

        loadSession();
      }
    };
  });
