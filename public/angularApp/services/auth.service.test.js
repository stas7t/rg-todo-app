describe('Auth factory', function() {
    var auth;


    var user = {  username:'john dou',
                    password:'123qwe' };

    var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1OGFjYWM5MDU0YzZjMjAwMDQ1OTJhZTciLCJ1c2VybmFtZSI6ImpvaG4gZG91IiwiZXhwIjoxNDkwMzAzMzc2LCJpYXQiOjE0ODc3MTEzNzZ9.g5iX088-aXMIE1-BhppaLOcCI19PJY6lybkE0QhzkOE";


  // Before each test load our todolistApp module
  beforeEach(angular.mock.module('todolistApp'));

  // Before each test set our injected Auth factory (_Auth_) to our local Auth variable
  beforeEach(inject(function(_auth_) {
    auth = _auth_;

  }));

  // A simple test to verify the Auth factory exists
  it('should exist', function() {
    expect(auth).toBeDefined();
  });

    // A set of tests for our Users.all() method
    describe('.register()', function() {

        it('should exist', function() {
            expect(auth.register).toBeDefined();
        });

    });

    describe('.login()', function() {

        it('should exist', function() {
            expect(auth.logIn).toBeDefined();
        });

    });


});