'use strict';

// http://me.dt.in.th/page/JavaScript-override/
function override(object, methodName, callback) {
  object[methodName] = callback(object[methodName])
}
function after(extraBehavior) {
  return function (original) {
    return function () {
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

        var session, reloadIfStoppedTimeout;

        function loadSession() {

          $log.info('loadSession()');
          $timeout.cancel(reloadIfStoppedTimeout);

          // Get a random session that isn't the current one
          do {
            var randomSession = scope.sessions[Math.floor(Math.random() * scope.sessions.length)];
          } while (randomSession.url == session);


          session = randomSession.url;
          $log.info('Loading ' + session);
          scope.currentProjectUrl = $sce.trustAsResourceUrl(session);
          scope.$apply();

          // Backup for next session if hijacking the player methods below doesn't
          // work. If it does work this timeout is cancelled at start of method
          reloadIfStoppedTimeout = $timeout(function () {
            $log.info('reloadIfStopped');
            loadSession();
          }, randomSession.duration);
        }

        var throttled = _.debounce(loadSession, 1000, {
          leading: true,
          trailing: false
        });

        var onSessionEnd = after(function () {
          $log.info('showSessionPlaybackFinished()');
          throttled();
        });

        $window.sessionCamPlayer = {
          frameLoaded: function () {

            // Shortcut variables
            var frame = $window.frames[0];
            var p = frame.sessionCamPlayer;
            var i$ = frame.$;

            // Disable the window.alert box which can stop it...
            frame.window.alert = frame.window.frames[0].window.alert = function (msg) {
              console.log("Alert: " + msg);
            };

            // Run the original function but return it later..
            var result = p.frameLoaded();

            // Auto play
            $window.frames[0].sessionCamPlayer.play();

            // Hook into when the playback is finished.
            override(p, 'showSessionPlaybackFinished', onSessionEnd);
            override(p, 'showSessionNotReady', onSessionEnd);
            override(p, 'showEventTooBigMessage', onSessionEnd);

            // Hide parts of the interface
            i$('#playbackControlsStrip,#secondNavStrip,#main-nav,#topbar,#bottomBarStrip').hide();

            // Return original method
            return result;
          }
        };

        // When we get sessions start the randomisation
        var sessionWatch = scope.$watch('sessions', function (newValue) {
          if (newValue.length > 0) {
            $log.info('session watch');
            loadSession();
            sessionWatch();
          }
        });

      }
    };
  });
