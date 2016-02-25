angular.module('multirun.controller', [])

.controller('MultiRunController', function($scope, $window, $timeout, $interval, $location, $route, Geo, Run, Profile, MultiGame) {
  var session = $window.localStorage;
  $scope.userLocation;
  $scope.destination;

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
  $scope.oppFinished = false;
  var stopCheck;
  var stopFinish;
  var userNum;
  var oppNum;

  // This if/else can be cleaned up 
  // Determine whether current user is user1 or user2 in multiplayer game database instance
  if (session.username > session.competitor) {
    userNum = "user1";
    oppNum = "user2";
  } else {
    userNum = "user2";
    oppNum = "user1";
  }

  // Determines whether check or 'waiting' should be displayed to user
  $scope.showCheck = function() {
    return !$scope.waiting && !$scope.raceStarted;
  }

  // Activated when user presses the check button
  // In multiplayer game database instance, the current user field is set to true (either "user1" or "user2", see above)
  // Continously check whether both user1 and user2 are ready/true
  $scope.ready = function() {
    $scope.waiting = true;
    MultiGame.updateGame(session.gameId, userNum).then(function(game) {});
    stopCheck = $interval($scope.checkOppReady, 300);
  }

  // check whether both user1 and user2 are ready/true
  $scope.checkOppReady = function() {
    MultiGame.getGame(session.gameId)
      .then(function(game) {
        if (game.user1 && game.user2) {
          $scope.startRun();
          $interval.cancel(stopCheck);
          stopFinish = $interval($scope.checkOppFinished, 1000);
        }
      });
  }

  // check whether opponent has finished race
  $scope.checkOppFinished = function() {
    MultiGame.getGame(session.gameId)
      .then(function(game) {
        if (game.won) {
          $scope.oppFinished = true;
          $interval.cancel(stopFinish);
        }
      });
  }
  // End multiplayer block
  /////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////


  var updateTotalRunTime = function() {
    var secondsRan = moment().diff(startTime, 'seconds');
    runTime = moment().minute(0).second(secondsRan);
  };

  $scope.startRun = function() {
    setTimeout(finishRun, Math.random()*12000); // simulate finishing run for manual testing
    startTime = moment();
    $scope.raceStarted = true;
    statusUpdateLoop = $interval(updateStatus, 100);
    // $scope.goldTime is not declared in this controller. Where do we define it?
    // same goes for silver, bronze Times --> these get defined in services.js when we initialize the map
    Run.setPointsInTime($scope);
    Run.setInitialMedalGoal($scope);
    document.getElementById('map').style.height = "93vh";
    document.getElementById('botNav').style.height = "7vh";
  }

  $scope.regenRace =  function() {
    $route.reload();
  };

  var makeInitialMap = function() {
    console.log('make initial map');
    Geo.makeInitialMap($scope, {lat: parseFloat(session.multiLat), lng: parseFloat(session.multiLng)});
  };

  makeInitialMap();

  var finishRun = function() {
    /////////////////////////////////////////////////////////////////////////////////////////
    // Multiplayer
    if ($scope.oppFinished) {
      // remove game from database if both players have finished
      MultiGame.removeGame(session.gameId);
    } else {
      // set won state to true if current user finishes first
      MultiGame.updateGame(session.gameId, 'won');
    }
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


    // Need to add run data to profile

    $interval.cancel(statusUpdateLoop);
    $location.path('/finish');
  };

  var checkIfFinished = function() {
    if ($scope.destination && $scope.userLocation) {
      var distRemaining = distBetween($scope.userLocation, $scope.destination);
      // Reduced radius for testing
      if (distRemaining < 0.00002) {
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
