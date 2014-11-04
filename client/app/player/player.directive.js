'use strict';

angular.module('sessionCamReplayApp')
  .directive('player', function ($sce, $timeout, $log, $window) {
    return {
      templateUrl: 'app/player/player.html',
      restrict: 'EA',
      scope: {
        sessions: '='
      },
      link: function (scope, element, attrs) {

        var session;
        function loadSession() {
          $log.info('loadSession()');

          // Get a random session that isn't the current one
          do {
            var randomSession = scope.sessions[Math.floor(Math.random() * scope.sessions.length)];
          } while (randomSession.url == session);


          session = randomSession.url;
          $log.info('Loading ' + session);
          scope.currentProjectUrl = $sce.trustAsResourceUrl(session);
          scope.$apply();
        }

        var throttled = _.debounce(loadSession, 10000, {
          leading: true,
          trailing: false
        });

        $window.sessionCamPlayer = {
          frameLoaded: function () {
            var p = $window.frames[0].sessionCamPlayer;

            // Run the original function but return it later..
            var result = p.frameLoaded();

            // Auto play
            $window.frames[0].sessionCamPlayer.play();

            // Hook into when the playback is finished.
            var _showSessionPlaybackFinished = p.showSessionPlaybackFinished;
            p.showSessionPlaybackFinished = function () {
              $log.info('showSessionPlaybackFinished()');
              throttled();
              _showSessionPlaybackFinished();
            };

            // Return original method
            return result;
          }
        };

        // When we get sessions start the randomisation
        var sessionWatch = scope.$watch('sessions', function (newValue) {
          if ( newValue.length > 0 ) {
            loadSession();
            sessionWatch();
          }
        });

      }
    };
  });
