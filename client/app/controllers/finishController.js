angular.module('finish.controller', [])
  .controller('FinishController', function($scope, $location, $route) {
    $scope.raceAgain = function () {
      // $location.path('/bolt');
      $route.reload('/bolt');
    }
  });
