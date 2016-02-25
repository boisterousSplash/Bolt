'use strict';

describe('Routing', function () {
  var $route;
  beforeEach(module('bolt'));

  beforeEach(inject(function ($injector) {
    $route = $injector.get('$route');
  }));

  it('Should have /signup route, template, and controller', function () {
    expect($route.routes['/signup']).to.be.defined;
    expect($route.routes['/signup'].controller).to.equal('AuthController');
    expect($route.routes['/signup'].templateUrl).to.equal('app/auth/signup.html');
  });

  it('Should have /signin route, template, and controller', function () {
    expect($route.routes['/signin']).to.be.defined;
    expect($route.routes['/signin'].controller).to.equal('AuthController');
    expect($route.routes['/signin'].templateUrl).to.equal('app/auth/signin.html');
  });

  it('Should have /bolt route, template, and controller', function () {
    expect($route.routes['/']).to.be.defined;
    expect($route.routes['/'].controller).to.equal('BoltController');
    expect($route.routes['/'].templateUrl).to.equal('app/views/bolt.html');
  });

  it('Should have /finish route, template, and controller', function () {
    expect($route.routes['/finish']).to.be.defined;
    expect($route.routes['/finish'].controller).to.equal('FinishController');
    expect($route.routes['/finish'].templateUrl).to.equal('app/views/finish.html');
  });
});
//
// .when('/achievements', {
//   templateUrl: 'app/views/achievements.html',
//   controller: 'AchievementsController',
//   authenticate: true
// })
// .when('/multiLoad', {
//   templateUrl: 'app/views/multiLoad.html',
//   controller: 'MultiController',
//   authenticate: true
// })
// .when('/signin', {
//   templateUrl: 'app/auth/signin.html',
//   controller: 'AuthController'
// })
// .when('/signup', {
//   templateUrl: 'app/auth/signup.html',
//   controller: 'AuthController'
// })
// .when('/profile', {
//   templateUrl: 'app/profile/profile.html',
//   controller: 'ProfileController',
//   authenticate: true
// })
// .when('/createProfile', {
//   templateUrl: 'app/views/createProfile.html',
//   controller: 'CreateProfileController',
//   authenticate: true
// })
