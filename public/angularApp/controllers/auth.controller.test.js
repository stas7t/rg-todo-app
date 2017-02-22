describe('auth controller', function() {
    var $httpBackend;
    var $window;
    var auth;
    var $controller;

    // Hardcoded data for testing
    var authToken = {token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1OGFjYWM5MDU0YzZjMjAwMDQ1OTJhZTciLCJ1c2VybmFtZSI6ImpvaG4gZG91IiwiZXhwIjoxNDkwMzAzMzc2LCJpYXQiOjE0ODc3MTEzNzZ9.g5iX088-aXMIE1-BhppaLOcCI19PJY6lybkE0QhzkOE'};
    var user = {  username:'john dou',
                  password:'123qwe' };

    // Load the module that contains the `auth` service before each test
    beforeEach(module('todolistApp'));

    // Instantiate the service and "train" `$httpBackend` before each test
    beforeEach(inject(function(_$httpBackend_, _$window_, _auth_, _$controller_, _$state_, _$rootScope_) {
        $state = _$state_; 
        $rootScope = _$rootScope_;
        $window = _$window_;
        $httpBackend = _$httpBackend_;
        $httpBackend.whenPOST('/user/register').respond(authToken);
        $httpBackend.whenPOST('/user/login').respond(authToken);
        // Looks like $httpBackend don't support http respond promise (https://github.com/angular/angular.js/issues/11245)
        // Proper user register/login functionality will be tested in auth.controller.test.js

        auth = _auth_;
        $controller = _$controller_;
    }));

    // Verify that there are no outstanding expectations or requests after each test
    afterEach(function () {
        //$httpBackend.verifyNoOutstandingExpectation();
        //$httpBackend.verifyNoOutstandingRequest();
    });

    it('should transition to register', function(done) {
        var $scope = {};
        $scope.user = {  username:'john dou',
                         password:'123qwe' };
        var controller = $controller('AuthCtrl', { $scope: $scope,  $state: $state, auth: auth });

        $scope.register();

        
        //$state.transitionTo('register');
        //$rootScope.$apply();
        expect($state.current.name).toBe('todolist');
        expect($window.localStorage['auth-token']).toEqual(authToken.token);
        done();
    });

});