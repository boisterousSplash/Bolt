angular.module('finish.controller', [])
  .controller('FinishController', function($scope) {
    $scope.runTime = sessionStorage.getItem('runTime');
    $scope.achievement = sessionStorage.getItem('achievement');
  });
