describe('Tasks service', function() {
    var $httpBackend;
    var auth;
    var Tasks;

    // Hardcoded data for testing
    var authToken = {token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1OGFjYWM5MDU0YzZjMjAwMDQ1OTJhZTciLCJ1c2VybmFtZSI6ImpvaG4gZG91IiwiZXhwIjoxNDkwMzAzMzc2LCJpYXQiOjE0ODc3MTEzNzZ9.g5iX088-aXMIE1-BhppaLOcCI19PJY6lybkE0QhzkOE'};
    var user = {  _id: '58acac9054c6c20004592ae7',
                  username:'john dou',
                  password:'123qwe' };

    var tasks = [
            {   id: 1,
                name: "Test task 001",
                status: "uncompleted",
                priority: 0,
                deadline: null,
                project_id: 1,
                user_id: '58acac9054c6c20004592ae7'},
            {   id: 2,
                name: "Test task 002",
                status: "uncompleted",
                priority: 0,
                deadline: null,
                project_id: 1,
                user_id: '58acac9054c6c20004592ae7'}
    ];

    var newTasks = [
            {   id: 1,
                name: "Test task 001",
                status: "uncompleted",
                priority: 0,
                deadline: null,
                project_id: 1,
                user_id: '58acac9054c6c20004592ae7'},
            {   id: 2,
                name: "Test task 002",
                status: "uncompleted",
                priority: 0,
                deadline: null,
                project_id: 1,
                user_id: '58acac9054c6c20004592ae7'},
            {   id: 3,
                name: "New task 001",
                status: "uncompleted",
                priority: 0,
                deadline: null,
                project_id: 1,
                user_id: '58acac9054c6c20004592ae7'}
    ];

    var updatedTasks = [
            {   id: 1,
                name: "Renamed task 001",
                status: "completed",
                priority: 5,
                deadline: "2017-03-01T10:00:00.000Z",
                project_id: 1,
                user_id: '58acac9054c6c20004592ae7'},
            {   id: 2,
                name: "Test task 002",
                status: "uncompleted",
                priority: 0,
                deadline: null,
                project_id: 1,
                user_id: '58acac9054c6c20004592ae7'},
            {   id: 3,
                name: "New task 001",
                status: "uncompleted",
                priority: 0,
                deadline: null,
                project_id: 1,
                user_id: '58acac9054c6c20004592ae7'}
    ];

    var tasksAfterDel = [
            {   id: 1,
                name: "Renamed task 001",
                status: "completed",
                priority: 5,
                deadline: "2017-03-01T10:00:00.000Z",
                project_id: 1,
                user_id: '58acac9054c6c20004592ae7'},
            {   id: 3,
                name: "New task 001",
                status: "uncompleted",
                priority: 0,
                deadline: null,
                project_id: 1,
                user_id: '58acac9054c6c20004592ae7'}
    ];

    // Load the module that contains the `Tasks` service before each test
    beforeEach(module('todolistApp'));

    // Instantiate the service and "train" `$httpBackend` before each test
    beforeEach(inject(function(_$httpBackend_, _$window_, _auth_, _Tasks_) {
        $window = _$window_;
        auth = _auth_;
        
        $httpBackend = _$httpBackend_;
        $httpBackend.whenPOST('/user/register').respond(authToken);
        $httpBackend.whenPOST('/user/login').respond(authToken);
        $httpBackend.whenGET('/angularApp/templates/todolist.html').respond({});
        $httpBackend.whenGET('/angularApp/templates/login.html').respond({});

        $httpBackend.whenGET('/api/' + auth.currentUser()._id + '/tasks').respond(tasks);
        $httpBackend.whenPOST('/api/' + auth.currentUser()._id + '/tasks').respond(newTasks);
        $httpBackend.whenPUT('/api/' + auth.currentUser()._id + '/tasks/' +  1).respond(updatedTasks);
        $httpBackend.whenDELETE('/api/' + auth.currentUser()._id + '/tasks/' + 2).respond(tasksAfterDel);
        
        Tasks = _Tasks_;

        auth.saveToken(authToken.token);
    }));

    // Verify that there are no outstanding expectations or requests after each test
    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should load list of tasks (GET: `/api/..._id.../tasks`)', function() {
        var Promise = Tasks.get();

        $httpBackend.flush();

        expect(Promise).toBeDefined();
        expect(Promise.$$state.value.status).toEqual(200);
        expect(Promise.$$state.value.data).toEqual( [ {id: 1, name: "Test task 001", status: "uncompleted", priority: 0, deadline: null, project_id: 1, user_id: '58acac9054c6c20004592ae7'},
                                                      {id: 2, name: "Test task 002", status: "uncompleted", priority: 0, deadline: null, project_id: 1, user_id: '58acac9054c6c20004592ae7'}] );
    });
  
    it('should create new task (POST: `/api/..._id.../tasks`)', function() {
        var Promise = Tasks.create({id: 3, name: 'New project 001', user_id: '58acac9054c6c20004592ae7'});

        $httpBackend.flush();

        expect(Promise).toBeDefined();
        expect(Promise.$$state.value.status).toEqual(200);
        expect(Promise.$$state.value.data).toEqual( [ {id: 1, name: "Test task 001", status: "uncompleted", priority: 0, deadline: null, project_id: 1, user_id: '58acac9054c6c20004592ae7'},
                                                      {id: 2, name: "Test task 002", status: "uncompleted", priority: 0, deadline: null, project_id: 1, user_id: '58acac9054c6c20004592ae7'},
                                                      {id: 3, name: "New task 001",  status: "uncompleted", priority: 0, deadline: null, project_id: 1, user_id: '58acac9054c6c20004592ae7'}] );

    });

    it('should update task #1 (PUT: `/api/..._id.../tasks/1`)', function() {
        var Promise = Tasks.update({id: 1, name: "Renamed task 001", status: "completed", priority: 5, deadline: "2017-03-01T10:00:00.000Z", project_id: 1, user_id: '58acac9054c6c20004592ae7'});

        $httpBackend.flush();

        expect(Promise).toBeDefined();
        expect(Promise.$$state.value.status).toEqual(200);
        expect(Promise.$$state.value.data).toEqual( [ {id: 1, name: "Renamed task 001", status: "completed", priority: 5, deadline: "2017-03-01T10:00:00.000Z", project_id: 1, user_id: '58acac9054c6c20004592ae7'},
                                                      {id: 2, name: "Test task 002",  status: "uncompleted", priority: 0, deadline: null, project_id: 1, user_id: '58acac9054c6c20004592ae7'},
                                                      {id: 3, name: "New task 001",   status: "uncompleted", priority: 0, deadline: null, project_id: 1, user_id: '58acac9054c6c20004592ae7'}] );

    });

    it('should delete task #2 (DELETE: `/api/..._id.../tasks/2`)', function() {
        var Promise = Tasks.delete(2);

        $httpBackend.flush();

        expect(Promise).toBeDefined();
        expect(Promise.$$state.value.status).toEqual(200);
        expect(Promise.$$state.value.data).toEqual( [ {id: 1, name: "Renamed task 001", status: "completed", priority: 5, deadline: "2017-03-01T10:00:00.000Z", project_id: 1, user_id: '58acac9054c6c20004592ae7'},
                                                      {id: 3, name: "New task 001",   status: "uncompleted", priority: 0, deadline: null, project_id: 1, user_id: '58acac9054c6c20004592ae7'}] );

    });

});