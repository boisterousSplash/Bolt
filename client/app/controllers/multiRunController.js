angular.module('multirun.controller', [])

.controller('MultiRunController', function ($scope, $window, $timeout, $interval, $location, $route, Geo, Run, Profile, MultiGame) {
  var session = $window.localStorage;
  var raceFinished = false;
  $scope.userLocation;
  $scope.destination;
  $scope.competitor = session.competitor;
  document.getElementById('map').style.height = "66vh";
  document.getElementById('botNav').style.height = "34vh";

  // Math functions
  var sqrt = Math.sqrt;
  var floor = Math.floor;
  var random = Math.random;
  var pow2 = function (num) {
    return Math.pow(num, 2);
  };

  //////////////////////////////////////////////////////////////////////////////
  // Multiplayer
  // Code outside of this block is very similar to runController.js
  $scope.waiting = false;
  $scope.oppFinished = false;
  var stopCheck;
  var stopFinish;
  var userNum;
  var oppNum;

  // Determine whether current user is user1 or user2 in multiplayer game
  // database instance
  if (session.username > session.competitor) {
    userNum = "user1";
    oppNum = "user2";
  } else {
    userNum = "user2";
    oppNum = "user1";
  }

  // Determine whether check or 'waiting' should be displayed to user
  $scope.showCheck = function () {
    return !$scope.waiting && !$scope.raceStarted;
  };

  // Activated when user presses the check button. In multiplayer game database
  // instance, the current user field is set to true
  // (either "user1" or "user2", see above)
  // Continously check whether both user1 and user2 are ready/true
  $scope.ready = function () {
    $scope.waiting = true;
    MultiGame.updateGame(session.gameId, userNum).then(function (game) {});
    stopCheck = $interval($scope.checkOppReady, 300);
  };

  // Check whether both user1 and user2 are ready/true
  $scope.checkOppReady = function () {
    MultiGame.getGame(session.gameId)
      .then(function (game) {
        if (game.user1 && game.user2) {
          $scope.startRun();
          $interval.cancel(stopCheck);
          stopFinish = $interval($scope.checkOppFinished, 2000);
        }
      });
  };

  // Check whether opponent has finished race
  $scope.checkOppFinished = function () {
    MultiGame.getGame(session.gameId)
      .then(function (game) {
        if (game.won) {
          $scope.oppFinished = true;
          $interval.cancel(stopFinish);
        }
      });
  };
  // End multiplayer block
  /////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////

  // Update run timer
  var updateTotalRunTime = function () {
    var secondsRan = moment().diff(startTime, 'seconds');
    runTime = moment().minute(0).second(secondsRan);
  };

  // Initiate race and start the timer
  $scope.startRun = function () {
    // Simulate finishing run for manual testing
    // setTimeout(finishRun, Math.random() * 12000);
    startTime = moment();
    $scope.raceStarted = true;
    statusUpdateLoop = $interval(updateStatus, 100);
    Run.setPointsInTime($scope);
    Run.setInitialMedalGoal($scope);
    document.getElementById('map').style.height = "89vh";
    document.getElementById('botNav').style.height = "11vh";
  };

  // Generate a new map or route after initial map has been loaded
  $scope.regenRace = function () {
    $route.reload();
  };

  // Generates google map with current location marker and run route details
  var makeInitialMap = function () {
    Geo.makeInitialMap($scope, {
      lat: parseFloat(session.multiLat),
      lng: parseFloat(session.multiLng)
    });
  };

  makeInitialMap();

  // Handle end run conditions. Update user profile to reflect latest run.
  var finishRun = function () {
    ////////////////////////////////////////////////////////////////////////////
    // Multiplayer
    if ($scope.oppFinished) {
      // Remove game from database if both players have finished
      MultiGame.removeGame(session.gameId);
    } else {
      // Set won state to true if current user finishes first
      MultiGame.updateGame(session.gameId, 'won');
    }
    ////////////////////////////////////////////////////////////////////////////

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
      racedAgainst: null
    };

    // Update current user's profile
    Profile.getUser()
    .then(function (user) {
      var achievements = user.achievements;
      var previousRuns = user.runs;
      //update achievments object
      achievements[medal] = achievements[medal] + 1;
      $window.localStorage.setItem('achievements', JSON.stringify(achievements));
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

  // Check if user is in close proximity to destination
  var checkIfFinished = function () {
    if ($scope.destination && $scope.userLocation) {
      var distRemaining = distBetween($scope.userLocation, $scope.destination);
      // Distance is in units of degrees latitude (~68 mi / deg lat)
      if (distRemaining < 0.0002 && !raceFinished) {
        raceFinished = true;
        finishRun();
      }
    }
  };

  // Calculate distance between two coordinates
  var distBetween = function (loc1, loc2) {
    return sqrt(pow2(loc1.lat - loc2.lat) + pow2(loc1.lng - loc2.lng));
  };

  // Update geographical location and timers
  var updateStatus = function () {
    Geo.updateCurrentPosition($scope);
    updateTotalRunTime();
    Run.updateGoalTimes($scope);
    checkIfFinished();
  };

  // Stop geotracker upon canceling run
  // Does this make sure to stop tracking if they close the window? --> all scripts die when the browser is no longer interpreting them
  $scope.$on('$destroy', function () {
    $interval.cancel(statusUpdateLoop);
  });
});
