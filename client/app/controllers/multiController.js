angular.module('multi.Controller', [])

.controller('MultiController', function($scope){

	$scope.stopGeoUpdater = function() {
	  clearInterval($scope.geoUpdater);
	};

})