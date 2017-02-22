(function(){


    angular
        .module('todolistApp')
        .controller('AuthCtrl', function($scope, $state, auth){
            $scope.user = {};

            $scope.register = function(){
                auth.register($scope.user)
                    .success(function(){
                        $state.go('todolist');
                    })
                    .error(function(error){
                        $scope.error = error;
                        console.log(error);
                    });
            };

            $scope.logIn = function(){
                auth.logIn($scope.user)
                    .error(function(error){
                        $scope.error = error;
                        console.log(error);
                    })
                    .success(function(){
                        $state.go('todolist');
                    });
            };
        })
})();