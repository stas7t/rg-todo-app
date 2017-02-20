(function(){
    'use strict';

    angular
        .module('todolistApp')
        .controller('MainCtrl', function($scope, $interval, Projects, Tasks, auth){

            // Store data from forms
            $scope.formDataProject = {};
            $scope.formDataTask = [];

            $scope.isLoggedIn = auth.isLoggedIn;

            $scope.isPriorityChanged = false;

            // Deadline: set, del, check
            $scope.checkDeadline = function() {

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
                    } 
                }
            
            };

            $scope.setDeadline = function(newDL) {
                if (angular.isDate(newDL)) {
                    $scope.edited_task.deadline = $scope.edited_task.deadlineDateTime;
                }
            }; 

            $scope.deleteDeadline = function() {
                $scope.edited_task.deadline = null;
                $scope.edited_task.deadlineDateTime = null;
            }; 

            // check deadline 
            $scope.checkDeadline();
            // check deadline every 1 minute
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

                if (task.deadline) {
                    var date =  new Date( Date.parse(task.deadline) );
                    $scope.edited_task.deadlineDateTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes());
                    $scope.edited_task.enableDeadlineInput = true;
                } else {
                    var date =  new Date();
                    $scope.edited_task.deadlineDateTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes());
                    $scope.edited_task.enableDeadlineInput = false;
                }
                
                $scope.editTaskModal = true;
            };

            $scope.close_modal = function(modal) {
                modal = false;        
                $scope.checkDeadline();
            };


            // increase/decrease task priority (min priority=0, max priority=10)
            var maxPriority = 10;

            $scope.up = function(task) {
                if (task.priority >= 0 && task.priority < maxPriority) {
                    task.priority += 1;
                } else if (task.priority >= maxPriority) {
                    task.priority = maxPriority;
                } else if (task.priority < 0) {
                    task.priority = 0;
                }
                $scope.isPriorityChanged = true
            };

            $scope.down = function(task) {
                if (task.priority > 0 && task.priority <= maxPriority) {
                    task.priority -= 1;
                } else if (task.priority > maxPriority) {
                    task.priority = maxPriority;
                } else if (task.priority < 0) {
                    task.priority = 0;
                }
                $scope.isPriorityChanged = true
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
                })
                .error(function(error) {
                    console.log('Error: ' + error);
                });
                
            Tasks.get()
                .success(function(data) {
                    $scope.tasks = data;
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
        })
})();