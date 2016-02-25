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
    expect($route.routes['/bolt']).to.be.defined;
    expect($route.routes['/bolt'].controller).to.equal('BoltController');
    expect($route.routes['/bolt'].templateUrl).to.equal('app/views/bolt.html');
  });

  // it('Should have /shorten route, template, and controller', function () {
  //   expect($route.routes['/shorten']).to.be.defined;
  //   expect($route.routes['/shorten'].controller).to.equal('ShortenController');
  //   expect($route.routes['/shorten'].templateUrl).to.equal('app/shorten/shorten.html');
  // });
});
