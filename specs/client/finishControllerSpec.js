'use strict';

describe('FinishController', function () {
  var $scope, $rootScope, $location, $route, createController;

  // using angular mocks, we can inject the injector
  // to retrieve our dependencies
  beforeEach(module('bolt'));
  beforeEach(inject(function ($injector) {

    // mock out our dependencies
    $rootScope = $injector.get('$rootScope');
    $location = $injector.get('$location');
    $route = $injector.get('$route');

    $scope = $rootScope.$new();

    var $controller = $injector.get('$controller');

    // used to create our FinishController for testing
    createController = function () {
      return $controller('FinishController', {
        $scope: $scope,
        $location: $location,
        $route: $route
      });
    };

    createController();
  }));

  it('$scope.raceAgain should be defined', function () {
    expect($scope.raceAgain).to.exist;
  });

  it('$scope.raceAgain should be a function', function () {
    expect($scope.raceAgain).to.be.a('function');
  });

});
