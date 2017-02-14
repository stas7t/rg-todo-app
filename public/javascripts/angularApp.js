let app = angular.module('todolist2', ['ui.router','angularify.semantic', 'angularjs-datetime-picker']);

app.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('todolist', {
        url: '/todolist',
        templateUrl: '/partials/todolist.html',
        controller: 'MainCtrl',
        onEnter: ['$state', 'auth', function($state, auth){
          if(!auth.isLoggedIn()){
            $state.go('login');
          }
        }]
        /*resolve: {
          postPromise: ['posts', function(posts){
            return posts.getAll();
          }]
        }*/
      })
      .state('login', {
        url: '/login',
        templateUrl: '/partials/login.html',
        controller: 'AuthCtrl',
        onEnter: ['$state', 'auth', function($state, auth){
          if(auth.isLoggedIn()){
            $state.go('todolist');
          }
        }]
      })
      .state('register', {
        url: '/register',
        templateUrl: '/partials/register.html',
        controller: 'AuthCtrl',
        onEnter: ['$state', 'auth', function($state, auth){
          if(auth.isLoggedIn()){
            $state.go('todolist');
          }
        }]
      });

    $urlRouterProvider.otherwise('todolist');
});

app.factory('auth', function($http, $window){
    var auth = {};

    auth.saveToken = function (token){
        $window.localStorage['auth-token'] = token;
    };

    auth.getToken = function (){
        return $window.localStorage['auth-token'];
    };

    auth.isLoggedIn = function(){
      var token = auth.getToken();

      if(token){
        var payload = JSON.parse($window.atob(token.split('.')[1]));

        return payload.exp > Date.now() / 1000;
      } else {
        return false;
      }
    };

    auth.currentUser = function(){
      if(auth.isLoggedIn()){
        var token = auth.getToken();
        var payload = JSON.parse($window.atob(token.split('.')[1]));

        return payload;
      }
    };

    auth.register = function(user){
      console.log(user);

      return $http.post('/user/register', user).success(function(data){
        auth.saveToken(data.token);
      });
    };

    auth.logIn = function(user){
      return $http.post('/user/login', user).success(function(data){
        auth.saveToken(data.token);
      });
    };

    auth.logOut = function(){
      $window.localStorage.removeItem('auth-token');
    };

    return auth;
})

app.factory('Projects', function($http, auth) {
    return {
        get : function() {
            return $http({
                method: 'GET',
                url: '/api/' + auth.currentUser()._id + '/projects',
                headers: {
                    'Authorization': 'Bearer ' + auth.getToken()
                  }
                });

        },
        create : function(projectData) {
            return $http({
                method: 'POST',
                url: '/api/' + auth.currentUser()._id + '/projects',
                headers: {
                    'Authorization': 'Bearer ' + auth.getToken(),
                },
                data: projectData
            });
        },
        update : function(project) {
            return $http({
                method: 'PUT',
                url: '/api/' + auth.currentUser()._id + '/projects/' + project.id,
                headers: {
                    'Authorization': 'Bearer ' + auth.getToken(),
                },
                data: project
            });
        },
        delete : function(project_id) {
            return $http({
                method: 'DELETE',
                url: '/api/' + auth.currentUser()._id + '/projects/' + project_id,
                headers: {
                    'Authorization': 'Bearer ' + auth.getToken(),
                }
            });
        }
    }
});

app.factory('Tasks', function($http, auth) {
    return {
        get : function() {
            return $http({
                method: 'GET',
                url: '/api/' + auth.currentUser()._id + '/tasks',
                headers: {
                    'Authorization': 'Bearer ' + auth.getToken()
                  }
                });

        },
        create : function(taskData) {
            return $http({
                method: 'POST',
                url: '/api/' + auth.currentUser()._id + '/tasks',
                headers: {
                    'Authorization': 'Bearer ' + auth.getToken(),
                },
                data: taskData
            });
        },
        update : function(task) {
            return $http({
                method: 'PUT',
                url: '/api/' + auth.currentUser()._id + '/tasks/' + task.id,
                headers: {
                    'Authorization': 'Bearer ' + auth.getToken(),
                },
                data: task
            });
        },
        delete : function(task_id) {
            return $http({
                method: 'DELETE',
                url: '/api/' + auth.currentUser()._id + '/tasks/' + task_id,
                headers: {
                    'Authorization': 'Bearer ' + auth.getToken(),
                }
            });
        }
    }
});

app.controller('MainCtrl', function($scope, $interval, Projects, Tasks, auth){

    // Store data from forms
    $scope.formDataProject = {};
    $scope.formDataTask = [];

    $scope.isLoggedIn = auth.isLoggedIn;

    $scope.isPriorityChanged = false;

    $scope.checkDeadline = function() {
        if (auth.isLoggedIn) {
            
        // check deadline of each task
        for (t in $scope.tasks) {

            if ($scope.tasks[t].deadline) {

                var isExpired = Date.parse( Date() ) > Date.parse( $scope.tasks[t].deadline );

                if ( isExpired && $scope.tasks[t].status == 'uncompleted' ) {
                    $scope.tasks[t].status = 'uncompleted expired';

                    Tasks.update($scope.tasks[t])
                        .success(function(data) {
                            $scope.tasks = data;
                        })
                        .error(function(error) {
                            console.log('Error: ' + error);
                        }); 
                } else if (!isExpired && $scope.tasks[t].status == 'uncompleted expired') {
                    $scope.tasks[t].status = 'uncompleted';

                    Tasks.update($scope.tasks[t])
                        .success(function(data) {
                            $scope.tasks = data;
                        })
                        .error(function(error) {
                            console.log('Error: ' + error);
                        }); 
                }

            } else if ($scope.tasks[t].status !== 'uncompleted' || $scope.tasks[t].status !== 'completed') {
                    $scope.tasks[t].status = 'uncompleted';

                    Tasks.update($scope.tasks[t])
                        .success(function(data) {
                            $scope.tasks = data;
                        })
                        .error(function(error) {
                            console.log('Error: ' + error);
                        }); 
                }
            }

        }
    };

    // check deadline every 5 minute 
    $scope.checkDeadline();
    $interval($scope.checkDeadline, 1000*60*1);

    // open/close modal windows 
    $scope.addProject = function() {
        $scope.addProjectModal = true;
    };

    $scope.editProject = function(project) {
        $scope.edited_project = project;
        $scope.editProjectModal = true;
    };

    $scope.editTask = function(task) {
        $scope.edited_task = task;
        $scope.editTaskModal = true;
    };

    $scope.close_modal = function(modal) {
        modal = false;
        $scope.checkDeadline();
    };

    // increase/decrease task priority (min priority=0, max priority=10)
    let maxPriority = 10;

    $scope.up = function(task) {
        if (task.priority >= 0 && task.priority < maxPriority) {
            task.priority += 1;
        } else if (task.priority >= maxPriority) {
            task.priority = maxPriority;
        } else if (task.priority < 0) {
            task.priority = 0;
        }
    };

    $scope.down = function(task) {
        if (task.priority > 0 && task.priority <= maxPriority) {
            task.priority -= 1;
        } else if (task.priority > maxPriority) {
            task.priority = maxPriority;
        } else if (task.priority < 0) {
            task.priority = 0;
        }
    };

    $scope.updatePriority = function(task) {
        if($scope.isPriorityChanged) {
            Tasks.update(task)
                .success(function(data) {
                    $scope.isPriorityChanged = false;
                    $scope.tasks = data;
                })
                .error(function(error) {
                    $scope.isPriorityChanged = false;
                    console.log('Error: ' + error);
                }); 
        }
    }

    // CRUD
    // GET =====================================================================

    Projects.get()
        .success(function(data) {
            $scope.projects = data;
            //console.log('$scope.projects');
            //console.log($scope.projects);
        })
        .error(function(error) {
            console.log('Error: ' + error);
        });
        
    Tasks.get()
        .success(function(data) {
            $scope.tasks = data;
            //console.log('$scope.tasks');
            //console.log($scope.tasks);
        })
        .error(function(error) {
            console.log('Error: ' + error);
        });

    // CREATE ==================================================================

    // create a project
    $scope.createProject = function() {

        // validate the formDataProject to make sure that form is not empty
        if (!$.isEmptyObject($scope.formDataProject)) {

            // call the create function from service
            Projects.create($scope.formDataProject)

                // if successful creation, call get function to get all the new projects
                .success(function(data) {
                    $scope.addProjectModal = false;
                    $scope.formDataProject = {}; // clear the form
                    $scope.projects = data; // assign new list of projects
                })
                .error(function(error) {
                    console.log('Error: ' + error);
                });
        }
    };

    // create a task
    $scope.createTask = function(project_id) {

        // validate the formDataTask to make sure that form is not empty
        if (!$.isEmptyObject($scope.formDataTask[project_id])) {

            // add project_id property
            $scope.formDataTask[project_id].project_id = project_id;

            // call the create function from service
            Tasks.create($scope.formDataTask[project_id])

                // if successful creation, call get function to get all the new tasks
                .success(function(data) {
                    $scope.formDataTask[project_id] = {}; // clear the form
                    $scope.tasks = data; // assign new list of tasks
                })
                .error(function(error) {
                    console.log('Error: ' + error);
                });
        }
    };

    // UPDATE ==================================================================

    // update a project
    $scope.updateProject = function(project) {
        // check that the project.name is not empty
        if (project.name) {
            Projects.update(project)
                // if successful update, call get function to get all the new projects
                .success(function(data) {
                    $scope.editProjectModal = false;
                    $scope.projects = data; // assign new list of projects
                })
                .error(function(error) {
                    $scope.editProjectModal = false;
                    console.log('Error: ' + error);
                });            
        }
    };
    // update a task 
    $scope.updateTask = function(task) {
        // check that the task.name is not empty
        if (task.name) {

            //Convert datetime from local time to GMT (toISOString)
            //Check that task.deadline is alrady set AND not ends with "Z" 
            if (task.deadline && !task.deadline.endsWith('Z')) {
                dd = new Date(task.deadline);
                task.deadline = dd.toISOString();
            }

            Tasks.update(task)
                // if successful update, call get function to get all the new tasks
                .success(function(data) {
                    $scope.editTaskModal = false;
                    $scope.tasks = data; // assign new list of tasks
                })
                .error(function(error) {
                    $scope.editTaskModal = false;
                    console.log('Error: ' + error);
                });                
        }
    };

    // DELETE ==================================================================

    // delete a project after checking it
    $scope.deleteProject = function(project_id) {
        Projects.delete(project_id)
            // if successful deletion, call get function to get all the new projects
            .success(function(data) {
                $scope.projects = data; // assign new list of projects
            })
            .error(function(error) {
                console.log('Error: ' + error);
            });
    };
    // delete a task after checking it
    $scope.deleteTask = function(task_id) {
        Tasks.delete(task_id)
            // if successful deletion, call get function to get all the new tasks
            .success(function(data) {
                $scope.tasks = data; // assign new list of tasks
            })
            .error(function(error) {
                console.log('Error: ' + error);
            });
    };
});

app.controller('AuthCtrl', function($scope, $state, auth){
    $scope.user = {};

    $scope.register = function(){
      auth.register($scope.user).error(function(error){
        $scope.error = error;
        console.log(error);
      }).then(function(){
        $state.go('todolist');
      });
    };

    $scope.logIn = function(){
      auth.logIn($scope.user).error(function(error){
        $scope.error = error;
        console.log(error);
      }).then(function(){
        $state.go('todolist');
      });
    };
});

app.controller('NavCtrl', function($scope, $state, auth){
    $scope.isLoggedIn = auth.isLoggedIn;
    $scope.currentUser = auth.currentUser;
    $scope.logOut = function(){
      auth.logOut();
      $state.go('login');
    }
});

