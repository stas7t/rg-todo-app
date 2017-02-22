describe('Projects service', function() {
    var $httpBackend;
    var auth;
    var Projects;

    // Hardcoded data for testing
    var authToken = {token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1OGFjYWM5MDU0YzZjMjAwMDQ1OTJhZTciLCJ1c2VybmFtZSI6ImpvaG4gZG91IiwiZXhwIjoxNDkwMzAzMzc2LCJpYXQiOjE0ODc3MTEzNzZ9.g5iX088-aXMIE1-BhppaLOcCI19PJY6lybkE0QhzkOE'};
    var user = {  _id: '58acac9054c6c20004592ae7',
                  username:'john dou',
                  password:'123qwe' };

    var projects = [
        {id: 1, name: 'Test project 001', user_id: '58acac9054c6c20004592ae7'},
        {id: 2, name: 'Test project 002', user_id: '58acac9054c6c20004592ae7'}
    ];

    var newProjects = [
        {id: 1, name: 'Test project 001', user_id: '58acac9054c6c20004592ae7'},
        {id: 2, name: 'Test project 002', user_id: '58acac9054c6c20004592ae7'},
        {id: 3, name: 'New project 001', user_id: '58acac9054c6c20004592ae7'}
    ];

    var updatedProjects = [
        {id: 1, name: 'Renamed project 001', user_id: '58acac9054c6c20004592ae7'},
        {id: 2, name: 'Test project 002', user_id: '58acac9054c6c20004592ae7'},
        {id: 3, name: 'New project 001', user_id: '58acac9054c6c20004592ae7'},
    ];

    var projectsAfterDel = [
        {id: 1, name: 'Renamed project 001', user_id: '58acac9054c6c20004592ae7'},
        {id: 3, name: 'New project 001', user_id: '58acac9054c6c20004592ae7'},
    ];

    // Load the module that contains the `Projects` service before each test
    beforeEach(module('todolistApp'));

    // Instantiate the service and "train" `$httpBackend` before each test
    beforeEach(inject(function(_$httpBackend_, _auth_, _Projects_) {
        auth = _auth_;
        
        $httpBackend = _$httpBackend_;
        $httpBackend.whenPOST('/user/register').respond(authToken);
        $httpBackend.whenPOST('/user/login').respond(authToken);
        $httpBackend.whenGET('/angularApp/templates/todolist.html').respond({});
        $httpBackend.whenGET('/angularApp/templates/login.html').respond({});

        $httpBackend.whenGET('/api/' + auth.currentUser()._id + '/projects').respond(projects);
        $httpBackend.whenPOST('/api/' + auth.currentUser()._id + '/projects').respond(newProjects);
        $httpBackend.whenPUT('/api/' + auth.currentUser()._id + '/projects/' +  1).respond(updatedProjects);
        $httpBackend.whenDELETE('/api/' + auth.currentUser()._id + '/projects/' + 2).respond(projectsAfterDel);
        
        Projects = _Projects_;

        auth.saveToken(authToken.token);
    }));

    // Verify that there are no outstanding expectations or requests after each test
    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should load list of projects (GET: `/api/..._id.../projects`)', function() {
        var Promise = Projects.get();

        $httpBackend.flush();

        expect(Promise).toBeDefined();
        expect(Promise.$$state.value.status).toEqual(200);
        expect(Promise.$$state.value.data).toEqual( [ {id: 1, name: 'Test project 001', user_id: '58acac9054c6c20004592ae7'},
                                                      {id: 2, name: 'Test project 002', user_id: '58acac9054c6c20004592ae7'}] );

    });
  
    it('should create new project (POST: `/api/..._id.../projects`)', function() {
        var Promise = Projects.create({id: 3, name: 'New project 001', user_id: '58acac9054c6c20004592ae7'});

        $httpBackend.flush();

        expect(Promise).toBeDefined();
        expect(Promise.$$state.value.status).toEqual(200);
        expect(Promise.$$state.value.data).toEqual( [ {id: 1, name: 'Test project 001', user_id: '58acac9054c6c20004592ae7'},
                                                      {id: 2, name: 'Test project 002', user_id: '58acac9054c6c20004592ae7'},
                                                      {id: 3, name: 'New project 001', user_id: '58acac9054c6c20004592ae7'}] );

    });

    it('should update (rename) project #1 (PUT: `/api/..._id.../projects/1`)', function() {
        var Promise = Projects.update({id: 1, name: 'Renamed project 001', user_id: '58acac9054c6c20004592ae7'});

        $httpBackend.flush();

        expect(Promise).toBeDefined();
        expect(Promise.$$state.value.status).toEqual(200);
        expect(Promise.$$state.value.data).toEqual( [ {id: 1, name: 'Renamed project 001', user_id: '58acac9054c6c20004592ae7'},
                                                      {id: 2, name: 'Test project 002', user_id: '58acac9054c6c20004592ae7'},
                                                      {id: 3, name: 'New project 001', user_id: '58acac9054c6c20004592ae7'}] );

    });

    it('should delete project #2 (DELETE: `/api/..._id.../projects/2`)', function() {
        var Promise = Projects.delete(2);

        $httpBackend.flush();

        expect(Promise).toBeDefined();
        expect(Promise.$$state.value.status).toEqual(200);
        expect(Promise.$$state.value.data).toEqual( [ {id: 1, name: 'Renamed project 001', user_id: '58acac9054c6c20004592ae7'},
                                                      {id: 3, name: 'New project 001', user_id: '58acac9054c6c20004592ae7'}] );

    });

});