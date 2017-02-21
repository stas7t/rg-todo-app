/*
describe('MainCtrl', function() {
  beforeEach(module('todolistApp'));

  var $controller;

  beforeEach(inject(function(_$controller_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
  }));

  describe('$scope.grade', function() {

    var $scope, controller;

    beforeEach(function() {
        $scope = {};



        $scope.projects = [
            {
                "id": 44,
                "name": "Test project 1",
                "user_id": "5897ac559d925b00047096b4"
            },
            {
                "id": 45,
                "name": "Test project 2",
                "user_id": "5897ac559d925b00047096b4"
            }
            ];

        $scope.tasks = [
            {
                "id": 198,
                "name": "Task 2-1",
                "status": "uncompleted",
                "project_id": 45,
                "priority": 2,
                "deadline": null,
                "user_id": "5897ac559d925b00047096b4"
            },
            {
                "id": 224,
                "name": "Task 1-4",
                "status": "uncompleted",
                "project_id": 44,
                "priority": 0,
                "deadline": null,
                "user_id": "5897ac559d925b00047096b4"
            },
            {
                "id": 225,
                "name": "Task 1-5",
                "status": "completed",
                "project_id": 44,
                "priority": 0,
                "deadline": null,
                "user_id": "5897ac559d925b00047096b4"
            },
            {
                "id": 221,
                "name": "Task 1-1",
                "status": "uncompleted",
                "project_id": 44,
                "priority": 7,
                "deadline": null,
                "user_id": "5897ac559d925b00047096b4"
            },
            {
                "id": 222,
                "name": "Task 1-2",
                "status": "uncompleted",
                "project_id": 44,
                "priority": 5,
                "deadline": "2017-02-01T10:00:00.000Z",
                "user_id": "5897ac559d925b00047096b4"
            },
            {
                "id": 223,
                "name": "Task 1-3",
                "status": "uncompleted",
                "project_id": 44,
                "priority": 0,
                "deadline": "2025-10-20T17:20:00.000Z",
                "user_id": "5897ac559d925b00047096b4"
            },
            {
                "id": 217,
                "name": "Task 2-2",
                "status": "completed",
                "project_id": 45,
                "priority": 0,
                "deadline": "2018-02-18T12:20:00.000Z",
                "user_id": "5897ac559d925b00047096b4"
            },
            {
                "id": 219,
                "name": "Task 2-4",
                "status": "completed",
                "project_id": 45,
                "priority": 0,
                "deadline": null,
                "user_id": "5897ac559d925b00047096b4"
            },
            {
                "id": 218,
                "name": "Task 2-3",
                "status": "uncompleted",
                "project_id": 45,
                "priority": 0,
                "deadline": "2018-02-17T12:30:00.000Z",
                "user_id": "5897ac559d925b00047096b4"
            }
        ];

        
        $scope.formDataProject = {name: "New test project"};
        $scope.formDataTask = [{name: "New test project"}, {name: "New test project"}];

        $scope.isLoggedIn = auth.isLoggedIn;

        $scope.isPriorityChanged = false;

        controller = $controller('MainCtrl', { $scope: $scope });
    });

    it('sets the strength to "strong" if the password length is >8 chars', function() {
      $scope.password = 'longerthaneightchars';
      $scope.grade();
      expect($scope.strength).toEqual('strong');
    });

    it('sets the strength to "weak" if the password length <3 chars', function() {
      $scope.password = 'a';
      $scope.grade();
      expect($scope.strength).toEqual('weak');
    });

  });
});
*/