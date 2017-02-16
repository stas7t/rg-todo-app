(function(){
    'use strict';

    angular
        .module('todolistApp')
        .factory('Projects', function($http, auth) {
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
        })
})();