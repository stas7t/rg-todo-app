describe('Auth service', function() {
    var $httpBackend;
    var $window;
    var auth;

    // Hardcoded data for testing
    var authToken = {token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1OGFjYWM5MDU0YzZjMjAwMDQ1OTJhZTciLCJ1c2VybmFtZSI6ImpvaG4gZG91IiwiZXhwIjoxNDkwMzAzMzc2LCJpYXQiOjE0ODc3MTEzNzZ9.g5iX088-aXMIE1-BhppaLOcCI19PJY6lybkE0QhzkOE'};
    var user = {  username:'john dou',
                  password:'123qwe' };

    // Load the module that contains the `auth` service before each test
    beforeEach(module('todolistApp'));

    // Instantiate the service and "train" `$httpBackend` before each test
    beforeEach(inject(function(_$httpBackend_, _$window_, _auth_) {
        $window = _$window_;

        $httpBackend = _$httpBackend_;
        $httpBackend.whenPOST('/user/register').respond(authToken);
        $httpBackend.whenPOST('/user/login').respond(authToken);
        $httpBackend.whenGET('/angularApp/templates/todolist.html').respond({});
        $httpBackend.whenGET('/angularApp/templates/login.html').respond({});

        auth = _auth_;
    }));

    // Verify that there are no outstanding expectations or requests after each test
    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should register new user (POST: `/user/register`)', function() {
        var Promise = auth.register(user);

        $httpBackend.flush();

        expect(Promise).toBeDefined();
        expect(Promise.$$state.value.status).toEqual(200);
        expect(Promise.$$state.value.config.url).toEqual('/user/register');
        expect(Promise.$$state.value.config.data.username).toEqual('john dou');
    });

    it('should log in user (POST: `/user/login`)', function() {
        var Promise = auth.logIn(user);

        $httpBackend.flush();

        expect(Promise).toBeDefined();
        expect(Promise.$$state.value.status).toEqual(200);
        expect(Promise.$$state.value.config.url).toEqual('/user/login');
        expect(Promise.$$state.value.config.data.username).toEqual('john dou');
    });

    it('should save token to localStorage', function() {
        auth.saveToken(authToken.token);

        $httpBackend.flush();

        expect($window.localStorage['auth-token']).toEqual(authToken.token);
    });

    it('should get token from localStorage', function() {
        var token = auth.getToken();

        $httpBackend.flush();

        expect(token).toEqual(authToken.token);
    });

    it('should return true if user logged in', function() {
        var isLoggedIn = auth.isLoggedIn();

        $httpBackend.flush();

        expect(isLoggedIn).toBe(true);
        /*  auth-token is hardcoded fot these tests
            current token has expiration date about March 21 2017
            after March 21 these test will be shown as failed
            you need to update token
        */
    });    

    it('should return current user', function() {
        var currentUser = auth.currentUser();

        $httpBackend.flush();

        expect(currentUser).toEqual(jasmine.any(Object));
        expect(currentUser._id).toEqual('58acac9054c6c20004592ae7');
        expect(currentUser.username).toEqual('john dou');
    });  

    it('should log out', function() {
        auth.logOut();

        $httpBackend.flush();

        expect($window.localStorage['auth-token']).toBe(undefined);
    });     

});