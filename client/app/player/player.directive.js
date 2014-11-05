'use strict';

// http://me.dt.in.th/page/JavaScript-override/
function override(object, methodName, callback) {
  object[methodName] = callback(object[methodName])
}
function after(extraBehavior) {
  return function(original) {
    return function() {
      var returnValue = original.apply(this, arguments)
      extraBehavior.apply(this, arguments)
      return returnValue
    }
  }
}

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

        var onSessionEnd = after(function() {
          $log.info('showSessionPlaybackFinished()');
          throttled();
        });

        $window.sessionCamPlayer = {
          frameLoaded: function () {

            // Shortcut variables
            var p = $window.frames[0].sessionCamPlayer;
            var i$ = $window.frames[0].$;

            // Run the original function but return it later..
            var result = p.frameLoaded();

            // Auto play
            $window.frames[0].sessionCamPlayer.play();

            // Hook into when the playback is finished.
            override(p, 'showSessionPlaybackFinished', onSessionEnd);
            override(p, 'showSessionNotReady', onSessionEnd);
            override(p, 'showEventTooBigMessage', onSessionEnd);

            // Hide parts of the interace
            i$('#playbackControlsStrip,#secondNavStrip,#main-nav,#topbar,#bottomBarStrip').hide();

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
