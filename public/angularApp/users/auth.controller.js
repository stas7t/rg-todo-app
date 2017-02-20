(function(){


    angular
        .module('todolistApp')
        .controller('AuthCtrl', function($scope, $state, auth){
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
        })
})();