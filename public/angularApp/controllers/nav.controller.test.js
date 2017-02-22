describe('Nav controller', function() {
    var $httpBackend;
    var $window;
    var auth;
    var $controller;

    // Hardcoded data for testing
    var authToken = {token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1OGFjYWM5MDU0YzZjMjAwMDQ1OTJhZTciLCJ1c2VybmFtZSI6ImpvaG4gZG91IiwiZXhwIjoxNDkwMzAzMzc2LCJpYXQiOjE0ODc3MTEzNzZ9.g5iX088-aXMIE1-BhppaLOcCI19PJY6lybkE0QhzkOE'};
    var user = { username:'john dou',
                 password:'123qwe' };

    // Load the module that contains the `auth` service before each test
    beforeEach(module('todolistApp'));

    // Instantiate the service and "train" `$httpBackend` before each test
    beforeEach(inject(function(_$httpBackend_, _$window_, _auth_, _$controller_, _$state_) {
        $state = _$state_; 
        $window = _$window_;

        $httpBackend = _$httpBackend_;
        $httpBackend.whenPOST('/user/register').respond(authToken);
        $httpBackend.whenPOST('/user/login').respond(authToken);
        $httpBackend.whenGET('/angularApp/templates/todolist.html').respond({});
        $httpBackend.whenGET('/angularApp/templates/login.html').respond({});

        auth = _auth_;
        $controller = _$controller_;

        //auth.saveToken(authToken.token);
    }));

    // Verify that there are no outstanding expectations or requests after each test
    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should log out user and change $state to `login`', function() {
        var $scope = {};
        $scope.user = {  username:'john dou',
                         password:'123qwe' };
        $scope.isLoggedIn = auth.isLoggedIn();
        $scope.currentUser = auth.currentUser();
        

        var controller = $controller('NavCtrl', { $scope: $scope });

        $scope.logOut();

        $httpBackend.flush();

        expect($state.current.name).toBe('login');
        expect($window.localStorage['auth-token']).toBe(undefined);
    });

});