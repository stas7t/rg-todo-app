(function(){

    angular
        .module('todolistApp')
        .config(function($stateProvider, $urlRouterProvider) {

            $stateProvider
            .state('todolist', {
                url: '/todolist',
                templateUrl: '/angularApp/templates/todolist.html',
                controller: 'MainCtrl',
                onEnter: ['$state', 'auth', function($state, auth){
                if(!auth.isLoggedIn()){
                    $state.go('login');
                }
                }]
            })
            .state('login', {
                url: '/login',
                templateUrl: '/angularApp/templates/login.html',
                controller: 'AuthCtrl',
                onEnter: ['$state', 'auth', function($state, auth){
                if(auth.isLoggedIn()){
                    $state.go('todolist');
                }
                }]
            })
            .state('register', {
                url: '/register',
                templateUrl: '/angularApp/templates/register.html',
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