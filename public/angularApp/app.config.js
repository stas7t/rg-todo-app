(function(){
    'use strict';

    angular
        .module('todolistApp')
        .config(function($stateProvider, $urlRouterProvider) {

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
        })

}());