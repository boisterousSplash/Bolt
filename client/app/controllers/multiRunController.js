angular.module('multirun.controller', [])

.controller('MultiRunController', function($scope, $window, $timeout, $interval, $location, $route, Geo, Run, Profile, MultiGame) {
  var session = $window.localStorage;
  $scope.userLocation;
  $scope.destination;

  /////////////////////////////////////
  // None of these variables get used. Do we need them?
  // No, I've deleted these same variables three or four times now but the deletion never gets merged with my PRs.
  /////////////////////////////////////

  // These variables seem similar. do you think we can put them together in an object?

  var startTime;
  var runTime;
  var statusUpdateLoop;
  var startLat;
  var startLong;
  var FINISH_RADIUS = 0.0002; // miles?

  // Math functions
  var sqrt = Math.sqrt;
  var floor = Math.floor;
  var random = Math.random;
  var pow2 = function (num) {
    return Math.pow(num, 2)
  }

  /////////////////////////////////////////////////////////////////////////////////
  // Multiplayer
  $scope.waiting = false;
  var userNum;
  var oppNum;
  var stopCheck;
  var stopFinish;
  if (session.username > session.competitor) {
    userNum = "user1";
    oppNum = "user2";
  } else {
    userNum = "user2";
    oppNum = "user1";
  }

  $scope.showCheck = function() {
    return !$scope.waiting && !$scope.raceStarted
  }

  $scope.ready = function() {
    $scope.waiting = true;
    MultiGame.updateGame(session.gameId, userNum).then(function(game) {});
    stopCheck = $interval($scope.checkOppReady, 300);
  }

  $scope.checkOppReady = function() {
    console.log('check if ready');
    MultiGame.getGame(session.gameId)
      .then(function(game) {
        if (game.user1 && game.user2) {
          $scope.startRun();
          $interval.cancel(stopCheck);
          stopFinish = $interval($scope.checkOppFinished, 1000);
        }
      })
  }

  $scope.checkOppFinished = function() {
    console.log('checking for finished');
    MultiGame.getGame(session.gameId)
      .then(function(game) {
        if (game.won) {
          console.log('won');
          $interval.cancel(stopFinish);
        }
      })
  }
  // End multiplayer block
  /////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////


  var updateTotalRunTime = function() {
    var secondsRan = moment().diff(startTime, 'seconds');
    runTime = moment().minute(0).second(secondsRan);
  };

  $scope.startRun = function() {
    // setTimeout(finishRun, 4000); // simulate finishing run for manual testing
    startTime = moment();
    $scope.raceStarted = true;
    statusUpdateLoop = $interval(updateStatus, 100);
    // $scope.goldTime is not declared in this controller. Where do we define it?
    // same goes for silver, bronze Times --> these get defined in services.js when we initialize the map
    Run.setPointsInTime($scope);
    Run.setInitialMedalGoal($scope);
    document.getElementById('map').style.height = "93vh"
    document.getElementById('botNav').style.height = "7vh"
  }

  $scope.regenRace =  function() {
    $route.reload();
  };

  var makeInitialMap = function() {
    console.log('make initial map');
    Geo.makeInitialMap($scope, {lat: parseFloat(session.multiLat), lng: parseFloat(session.multiLng)});
  };

  makeInitialMap();

  // It looks like we're repeating ourselves a bit here.
  // Could we refactor to cover all three medals with one medalTime object?

  var finishRun = function() {
    /////////////////////////////////////////////////////////////////////////////////////////
    // Multiplayer
    MultiGame.updateGame(session.gameId, 'won');
    /////////////////////////////////////////////////////////////////////////////////////////

    $scope.$parent.runTime = runTime.format('mm:ss');
    var medal = $scope.$parent.achievement = $scope.currentMedal;

    var date = new Date();

    var endLocation = {
      latitude: $scope.destination.lat,
      longitude: $scope.destination.long
    };
    var googleExpectedTime = null;
    var actualTime = runTime;

    var currentRunObject = {
      date: date,
      startLocation: {
        longitude: null,
        latitude: null
      },
      endLocation: {
        longitude: $scope.destination.long,
        latitude: $scope.destination.lat
      },
      googleExpectedTime: null,
      actualTime: runTime,
      medalReceived: medal,
      racedAgainst: null,
    };


    Profile.getUser()
    .then(function(user) {
      var achievements = user.data.achievements;
      var previousRuns = user.data.runs;

      //update achievments object
      achievements[medal] = achievements[medal] + 1;
      //update runs object
      previousRuns.push(currentRunObject);

      updatedAchievementsData = {
        achievements: achievements,
        runs: previousRuns
      };

      Profile.updateUser(updatedAchievementsData, user)
      .then(function (updatedProfile) {
        return updatedProfile;
      })
      .catch(function (err) {
        console.error(err);
      });
    });

    $interval.cancel(statusUpdateLoop);
    $location.path('/finish');
  };

  var checkIfFinished = function() {
    if ($scope.destination && $scope.userLocation) {
      var distRemaining = distBetween($scope.userLocation, $scope.destination);
      if (distRemaining < 0.0002) {
        finishRun();
      }
    }
  };

  var distBetween = function(loc1, loc2) {
    return sqrt(pow2(loc1.lat - loc2.lat) + pow2(loc1.lng - loc2.lng));
  }

  var updateStatus = function() {
    Geo.updateCurrentPosition($scope);
    updateTotalRunTime();
    Run.updateGoalTimes($scope);
    checkIfFinished();
  };

  // Stop geotracker upon canceling run
  // Does this make sure to stop tracking if they close the window? --> all scripts die when the browser is no longer interpreting them
  $scope.$on('$destroy', function() {
    $interval.cancel(statusUpdateLoop);
  });
});