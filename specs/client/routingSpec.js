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

  it('Should have /finish route, template, and controller', function () {
    expect($route.routes['/finish']).to.be.defined;
    expect($route.routes['/finish'].controller).to.equal('FinishController');
    expect($route.routes['/finish'].templateUrl).to.equal('app/views/finish.html');
  });

  it('Should have /multiLoad route, template, and controller', function () {
    expect($route.routes['/multiLoad']).to.be.defined;
    expect($route.routes['/multiLoad'].controller).to.equal('MultiController');
    expect($route.routes['/multiLoad'].templateUrl).to.equal('app/views/multiLoad.html');
  });

  it('Should have /profile route, template, and controller', function () {
    expect($route.routes['/profile']).to.be.defined;
    expect($route.routes['/profile'].controller).to.equal('ProfileController');
    expect($route.routes['/profile'].templateUrl).to.equal('app/views/profile.html');
  });

  it('Should have /createProfile route, template, and controller', function () {
    expect($route.routes['/createProfile']).to.be.defined;
    expect($route.routes['/createProfile'].controller).to.equal('CreateProfileController');
    expect($route.routes['/createProfile'].templateUrl).to.equal('app/views/createProfile.html');
  });

});
