describe('Controller: testController', function () {
  beforeEach(module('core:ComposeController'))

  var scope, controller, httpBackend, authRequestHandler;


  beforeEach(inject(function ($controller, $rootScope, _$httpBackend_) {
    scope = $rootScope.$new();
    httpBackend = _$httpBackend_;

    controller = $controller('ComposeController as vm', {
      $scope: scope,
    });

    scope.vm.user = {};

    spyOn(controller, 'findCoordinates').and.callFake(function () {
      console.log('hi');
    });

  }));

  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  })

  it('should return copy user', function () {
    scope.vm.user.name =  'Jon' 
    scope.vm.createUser(  scope.vm.user.name  );

    expect(scope.vm.user).toEqual( { name: 'Jon' } );
  });

  // it('when called returns the requested value', function () {
  //   expect(scope.vm.user).toEqual(10);
  // });

});