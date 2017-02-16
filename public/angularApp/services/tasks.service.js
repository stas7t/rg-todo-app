(function(){
    'use strict';

    angular
        .module('todolistApp')
        .factory('Tasks', function($http, auth) {
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
        })
})();