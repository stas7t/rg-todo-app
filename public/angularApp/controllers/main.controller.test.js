describe('Main controller', function() {
    var $httpBackend;
    var $window;
    var $rootScope;
    var $interval;
    var auth;
    var Projects;
    var Tasks;
    var $controller;

    // Hardcoded data for testing
    var authToken = {token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1OGFjYWM5MDU0YzZjMjAwMDQ1OTJhZTciLCJ1c2VybmFtZSI6ImpvaG4gZG91IiwiZXhwIjoxNDkwMzAzMzc2LCJpYXQiOjE0ODc3MTEzNzZ9.g5iX088-aXMIE1-BhppaLOcCI19PJY6lybkE0QhzkOE'};
    var user = { username:'john dou',
                 password:'123qwe' };

    var projects = [
        {id: 1, name: 'Test project 001', user_id: '58acac9054c6c20004592ae7'},
        {id: 2, name: 'Test project 002', user_id: '58acac9054c6c20004592ae7'}
    ];

    var projectsAfterAddNewOne = [
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

    var tasks1 = [
            {   id: 11,
                name: "Test task 011",
                status: "uncompleted",
                priority: 0,
                deadline: null,
                project_id: 1,
                user_id: '58acac9054c6c20004592ae7'},
            {   id: 12,
                name: "Test task 012",
                status: "uncompleted expired",
                priority: 0,
                deadline: null,
                project_id: 1,
                user_id: '58acac9054c6c20004592ae7'}
    ];

    var tasksAfterAddNewOne = [
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

    var tasksAfterRename = [
            {   id: 1,
                name: "Renamed task 001",
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

    var tasksAfterComplete = [
            {   id: 1,
                name: "Renamed task 001",
                status: "uncompleted",
                priority: 0,
                deadline: null,
                project_id: 1,
                user_id: '58acac9054c6c20004592ae7'},
            {   id: 2,
                name: "Test task 002",
                status: "completed",
                priority: 0,
                deadline: null,
                project_id: 1,
                user_id: '58acac9054c6c20004592ae7'}
    ];

    var tasksAfterSetPriority = [
            {   id: 1,
                name: "Renamed task 001",
                status: "uncompleted",
                priority: 0,
                deadline: null,
                project_id: 1,
                user_id: '58acac9054c6c20004592ae7'},
            {   id: 2,
                name: "Test task 002",
                status: "completed",
                priority: 0,
                deadline: null,
                project_id: 1,
                user_id: '58acac9054c6c20004592ae7'},
            {   id: 3,
                name: "New task 001",
                status: "uncompleted",
                priority: 7,
                deadline: null,
                project_id: 1,
                user_id: '58acac9054c6c20004592ae7'}
    ];

    var tasksAfterSetDeadline = [
            {   id: 1,
                name: "Renamed task 001",
                status: "uncompleted",
                priority: 0,
                deadline: null,
                project_id: 1,
                user_id: '58acac9054c6c20004592ae7'},
            {   id: 2,
                name: "Test task 002",
                status: "completed",
                priority: 0,
                deadline: null,
                project_id: 1,
                user_id: '58acac9054c6c20004592ae7'},
            {   id: 3,
                name: "New task 001",
                status: "uncompleted",
                priority: 7,
                deadline: null,
                project_id: 1,
                user_id: '58acac9054c6c20004592ae7'},
            {   id: 4,
                name: "New task 002",
                status: "uncompleted",
                priority: 0,
                deadline: "2017-03-01T10:00:00.000Z",
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


    // Load the module that contains the `auth` service before each test
    beforeEach(module('todolistApp'));

    // Instantiate the service and "train" `$httpBackend` before each test
    beforeEach(inject(function(_$httpBackend_, _$window_, _$rootScope_, _$interval_, _auth_, _Projects_, _Tasks_, _$controller_) {
        $window = _$window_;
        $rootScope = _$rootScope_;
        $interval = _$interval_;
        auth = _auth_;
        Projects = _Projects_;
        Tasks = _Tasks_;
        $controller = _$controller_;

        $httpBackend = _$httpBackend_;
        $httpBackend.whenPOST('/user/register').respond(authToken);
        $httpBackend.whenPOST('/user/login').respond(authToken);
        $httpBackend.whenGET('/angularApp/templates/todolist.html').respond({});

        $httpBackend.whenGET('/api/' + auth.currentUser()._id + '/projects').respond(projects);
        $httpBackend.whenPOST('/api/' + auth.currentUser()._id + '/projects').respond(projectsAfterAddNewOne);
        $httpBackend.whenPUT('/api/' + auth.currentUser()._id + '/projects/' +  1).respond(updatedProjects);
        $httpBackend.whenDELETE('/api/' + auth.currentUser()._id + '/projects/' + 2).respond(projectsAfterDel);

        $httpBackend.whenGET('/api/' + auth.currentUser()._id + '/tasks').respond(tasks);
        $httpBackend.whenPOST('/api/' + auth.currentUser()._id + '/tasks').respond(tasksAfterAddNewOne);         //create new task
        $httpBackend.whenPUT('/api/' + auth.currentUser()._id + '/tasks/' +  1).respond(tasksAfterRename);       //rename task #1
        $httpBackend.whenPUT('/api/' + auth.currentUser()._id + '/tasks/' +  2).respond(tasksAfterComplete);     //complete task #2
        $httpBackend.whenPUT('/api/' + auth.currentUser()._id + '/tasks/' +  3).respond(tasksAfterSetPriority);  //set priority to task #3
        $httpBackend.whenPUT('/api/' + auth.currentUser()._id + '/tasks/' +  4).respond(tasksAfterSetDeadline);  //set deadline to task #4
        $httpBackend.whenPUT('/api/' + auth.currentUser()._id + '/tasks/' +  12).respond(tasks1); //for check deadline function
        $httpBackend.whenDELETE('/api/' + auth.currentUser()._id + '/tasks/' + 2).respond(tasksAfterDel);        //delete task #2

    }));

    // Verify that there are no outstanding expectations or requests after each test
    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should get projects from server', function() {
        var $scope = $rootScope.$new();

        var controller = $controller('MainCtrl', { $scope: $scope });

        $httpBackend.flush();

        expect($scope.projects).toEqual(projects);
    });

    it('should get tasks from server', function() {
        var $scope = $rootScope.$new();

        var controller = $controller('MainCtrl', { $scope: $scope });

        $httpBackend.flush();

        expect($scope.tasks).toEqual(tasks);
    });

    it('should create new project', function() {
        var $scope = $rootScope.$new();

        var controller = $controller('MainCtrl', { $scope: $scope });

        $scope.formDataProject = {id: 3, name: 'New project 001', user_id: '58acac9054c6c20004592ae7'};
        $scope.createProject();

        $httpBackend.flush();

        expect($scope.projects).toEqual(projectsAfterAddNewOne);
    });

    it('should NOT create new project if form is empty', function() {
        var $scope = $rootScope.$new();

        var controller = $controller('MainCtrl', { $scope: $scope });

        $scope.formDataProject = {};
        $scope.createProject();

        $httpBackend.flush();

        expect($scope.projects).toEqual(projects);
    });

    it('should update (rename) project #1', function() {
        var $scope = $rootScope.$new();

        var controller = $controller('MainCtrl', { $scope: $scope });

        $scope.editedProject = {id: 1, name: 'Renamed project 001', user_id: '58acac9054c6c20004592ae7'};
        $scope.updateProject($scope.editedProject);

        $httpBackend.flush();

        expect($scope.projects).toEqual(updatedProjects);
    });

    it('should NOT update (rename) project #1 if name not specified', function() {
        var $scope = $rootScope.$new();

        var controller = $controller('MainCtrl', { $scope: $scope });

        $scope.editedProject = {id: 1, name: '', user_id: '58acac9054c6c20004592ae7'};
        $scope.updateProject($scope.editedProject);

        $httpBackend.flush();

        expect($scope.projects).toEqual(projects);
    });

    it('should delete project #2', function() {
        var $scope = $rootScope.$new();

        var controller = $controller('MainCtrl', { $scope: $scope });

        $scope.deleteProject(2);

        $httpBackend.flush();

        expect($scope.projects).toEqual(projectsAfterDel);
    });

    it('should create new task in project #1', function() {
        var $scope = $rootScope.$new();

        var controller = $controller('MainCtrl', { $scope: $scope });

        $scope.formDataTask = [ {},
                                {id: 3,
                                name: "New task 001",
                                status: "uncompleted",
                                priority: 0,
                                deadline: null,
                                project_id: 1,
                                user_id: '58acac9054c6c20004592ae7'}];
        $scope.createTask(1);

        $httpBackend.flush();

        expect($scope.tasks).toEqual(tasksAfterAddNewOne);
    });

    it('should NOT create new task in project #1 if form is empty', function() {
        var $scope = $rootScope.$new();

        var controller = $controller('MainCtrl', { $scope: $scope });

        $scope.formDataTask = [];
        $scope.createTask(1);

        $httpBackend.flush();

        expect($scope.tasks).toEqual(tasks);
    });

    it('should update (rename) task #1 in project #1', function() {
        var $scope = $rootScope.$new();

        var controller = $controller('MainCtrl', { $scope: $scope });

        $scope.editedTask = {id: 1,
                             name: "Renamed task 001",
                             status: "uncompleted",
                             priority: 0,
                             deadline: null,
                             project_id: 1,
                             user_id: '58acac9054c6c20004592ae7'};

        $scope.updateTask($scope.editedTask);

        $httpBackend.flush();

        expect($scope.tasks).toEqual(tasksAfterRename);
    });

    it('should NOT update (rename) task #1 in project #1 if name not specified', function() {
        var $scope = $rootScope.$new();

        var controller = $controller('MainCtrl', { $scope: $scope });

        $scope.editedTask = {id: 1,
                             name: "",
                             status: "uncompleted",
                             priority: 0,
                             deadline: null,
                             project_id: 1,
                             user_id: '58acac9054c6c20004592ae7'};

        $scope.updateTask($scope.editedTask);

        $httpBackend.flush();

        expect($scope.tasks).toEqual(tasks);
    });

    it('should update (complete) task #2 in project #1', function() {
        var $scope = $rootScope.$new();

        var controller = $controller('MainCtrl', { $scope: $scope });

        $scope.editedTask = {id: 2,
                             name: "Test task 002",
                             status: "completed",
                             priority: 0,
                             deadline: null,
                             project_id: 1,
                             user_id: '58acac9054c6c20004592ae7'};

        $scope.updateTask($scope.editedTask);

        $httpBackend.flush();

        expect($scope.tasks).toEqual(tasksAfterComplete);
    });

    it('should update (set priority) task #3 in project #1', function() {
        var $scope = $rootScope.$new();

        var controller = $controller('MainCtrl', { $scope: $scope });

        $scope.editedTask = {id: 3,
                             name: "New task 001",
                             status: "completed",
                             priority: 7,
                             deadline: null,
                             project_id: 1,
                             user_id: '58acac9054c6c20004592ae7'};

        $scope.updateTask($scope.editedTask);

        $httpBackend.flush();

        expect($scope.tasks).toEqual(tasksAfterSetPriority);
    });

    it('should update (set deadline) task #4 in project #1', function() {
        var $scope = $rootScope.$new();

        var controller = $controller('MainCtrl', { $scope: $scope });

        $scope.editedTask = {id: 4,
                             name: "New task 002",
                             status: "uncompleted",
                             priority: 0,
                             deadline: "2017-03-01T10:00:00.000Z",
                             project_id: 1,
                             user_id: '58acac9054c6c20004592ae7'};

        $scope.updateTask($scope.editedTask);

        $httpBackend.flush();

        expect($scope.tasks).toEqual(tasksAfterSetDeadline);
    });

    it('should delete task #2 in project #1', function() {
        var $scope = $rootScope.$new();

        var controller = $controller('MainCtrl', { $scope: $scope });

        $scope.deleteTask(2);

        $httpBackend.flush();

        expect($scope.tasks).toEqual(tasksAfterDel);
    });

    it('should update priority of task #3 in project #1 if priority changed', function() {
        var $scope = $rootScope.$new();

        var controller = $controller('MainCtrl', { $scope: $scope });

        $scope.isPriorityChanged = true;

        $scope.editedTask = {id: 3,
                             name: "New task 001",
                             status: "completed",
                             priority: 7,
                             deadline: null,
                             project_id: 1,
                             user_id: '58acac9054c6c20004592ae7'};

        $scope.updatePriority($scope.editedTask);

        $httpBackend.flush();

        expect($scope.tasks).toEqual(tasksAfterSetPriority);
    });

    it('should NOT update priority of task #3 in project #1 if priority NOT changed', function() {
        var $scope = $rootScope.$new();

        var controller = $controller('MainCtrl', { $scope: $scope });

        $scope.isPriorityChanged = false;

        $scope.editedTask = {id: 3,
                             name: "New task 001",
                             status: "completed",
                             priority: 7,
                             deadline: null,
                             project_id: 1,
                             user_id: '58acac9054c6c20004592ae7'};

        $scope.updatePriority($scope.editedTask);

        $httpBackend.flush();

        expect($scope.tasks).toEqual(tasks);
    });

    it('should increase priority from 7 to 8', function() {
        var $scope = $rootScope.$new();

        var controller = $controller('MainCtrl', { $scope: $scope });

        $scope.isPriorityChanged = true;

        $scope.editedTask = {id: 3,
                             name: "New task 001",
                             status: "completed",
                             priority: 7,
                             deadline: null,
                             project_id: 1,
                             user_id: '58acac9054c6c20004592ae7'};

        $scope.up($scope.editedTask);

        $httpBackend.flush();

        expect($scope.editedTask.priority).toEqual(8);
    });

    it('should not increase priority to higher then 10 (max Priority)', function() {
        var $scope = $rootScope.$new();

        var controller = $controller('MainCtrl', { $scope: $scope });

        $scope.isPriorityChanged = true;

        $scope.editedTask = {id: 3,
                             name: "New task 001",
                             status: "completed",
                             priority: 7,
                             deadline: null,
                             project_id: 1,
                             user_id: '58acac9054c6c20004592ae7'};

        $scope.up($scope.editedTask); //7+1=8
        $scope.up($scope.editedTask); //8+1=9
        $scope.up($scope.editedTask); //9+1=10
        $scope.up($scope.editedTask); //10+1=11, but maxPriority = 10

        $httpBackend.flush();

        expect($scope.editedTask.priority).toEqual(10);
    });

    it('should down priority from 3 to 2', function() {
        var $scope = $rootScope.$new();

        var controller = $controller('MainCtrl', { $scope: $scope });

        $scope.isPriorityChanged = true;

        $scope.editedTask = {id: 3,
                             name: "New task 001",
                             status: "completed",
                             priority: 3,
                             deadline: null,
                             project_id: 1,
                             user_id: '58acac9054c6c20004592ae7'};

        $scope.down($scope.editedTask); //3-1=2

        $httpBackend.flush();

        expect($scope.editedTask.priority).toEqual(2);
    });

    it('should not down priority to lower then 0 (min Priority)', function() {
        var $scope = $rootScope.$new();

        var controller = $controller('MainCtrl', { $scope: $scope });

        $scope.isPriorityChanged = true;

        $scope.editedTask = {id: 3,
                             name: "New task 001",
                             status: "completed",
                             priority: 3,
                             deadline: null,
                             project_id: 1,
                             user_id: '58acac9054c6c20004592ae7'};

        $scope.down($scope.editedTask); //3-1=2
        $scope.down($scope.editedTask); //2-1=1
        $scope.down($scope.editedTask); //1-1=0
        $scope.down($scope.editedTask); //0-1=-1, but min Priority = 0

        $httpBackend.flush();

        expect($scope.editedTask.priority).toEqual(0);
    });

    it('should show modal window `Add Project`', function() {
        var $scope = $rootScope.$new();

        var controller = $controller('MainCtrl', { $scope: $scope });

        $scope.addProject();

        $httpBackend.flush();

        expect($scope.addProjectModal).toEqual(true);
    });

    it('should show modal window `Edit Project`', function() {
        var $scope = $rootScope.$new();

        var controller = $controller('MainCtrl', { $scope: $scope });

        $scope.editProject(projects[0]);

        $httpBackend.flush();

        expect($scope.editProjectModal).toEqual(true);
        expect($scope.editedProject).toEqual(projects[0]);
    });

    it('should show modal window `Edit Task`', function() {
        var $scope = $rootScope.$new();

        var controller = $controller('MainCtrl', { $scope: $scope });

        $scope.editTask(tasks[0]);

        $httpBackend.flush();

        expect($scope.editTaskModal).toEqual(true);
        expect($scope.editedTask).toEqual(tasks[0]);
    });

    it('should set deadline for task #1', function() {
        var $scope = $rootScope.$new();

        var controller = $controller('MainCtrl', { $scope: $scope });

        $scope.tasks = tasks;

        $scope.editedTask = {id: 1,
                             name: "Task 001",
                             status: "uncompleted",
                             priority: 7,
                             deadline: null,
                             project_id: 1,
                             user_id: '58acac9054c6c20004592ae7'};

        $scope.editedTask.deadlineDateTime = new Date(1488362400000);

        $scope.setDeadline($scope.editedTask.deadlineDateTime);

        $httpBackend.flush();

        expect($scope.editedTask.deadline.toISOString()).toEqual('2017-03-01T10:00:00.000Z');
    });

    it('should delete deadline for task #1', function() {
        var $scope = $rootScope.$new();

        var controller = $controller('MainCtrl', { $scope: $scope });

        $scope.tasks = tasks;

        $scope.editedTask = {id: 1,
                             name: "Task 001",
                             status: "uncompleted",
                             priority: 7,
                             deadline: '2017-03-01T10:00:00.000Z',
                             project_id: 1,
                             user_id: '58acac9054c6c20004592ae7'};

        //$scope.editedTask.deadlineDateTime = new Date(1488362400000);

        $scope.deleteDeadline();

        $httpBackend.flush();

        expect($scope.editedTask.deadline).toEqual(null);
        expect($scope.editedTask.deadlineDateTime).toEqual(null);
    });

    it('should check deadline for all tasks', function() {
        var $scope = $rootScope.$new();

        var controller = $controller('MainCtrl', { $scope: $scope });

        $scope.tasks = tasks1;

        $scope.tasks[0].status = 'uncompleted';
        $scope.tasks[1].status = 'uncompleted';

        $scope.tasks[0].deadline = '2019-03-01T10:00:00.000Z'; // future
        $scope.tasks[1].deadline = '2015-03-01T10:00:00.000Z'; // expired

        $scope.checkDeadline();

        $httpBackend.flush();

        expect($scope.tasks[0].status).toEqual('uncompleted');
        expect($scope.tasks[1].status).toEqual('uncompleted expired');
    });    

});