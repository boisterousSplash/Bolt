'use strict';

describe('AchievementsController', function () {
  var $scope, $rootScope, $window, createController;

  // using angular mocks, we can inject the injector
  // to retrieve our dependencies
  beforeEach(module('bolt'));
  beforeEach(inject(function ($injector) {

    // mock out our dependencies
    $rootScope = $injector.get('$rootScope');
    $window = $injector.get('$window');

    var $controller = $injector.get('$controller');

    $scope = $rootScope.$new();

    // used to create our AchievementsController for testing
    createController = function () {
      return $controller('AchievementsController', {
        $scope: $scope,
        $window: $window
      });
    };

    createController();
  }));

  it('should be cool', function () {

  });
});
