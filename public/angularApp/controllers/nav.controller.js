(function(){


    angular
        .module('todolistApp')
        .controller('NavCtrl', function($scope, $state, auth){
            $scope.isLoggedIn = auth.isLoggedIn;
            $scope.currentUser = auth.currentUser;
            $scope.logOut = function(){
                auth.logOut();
                $state.go('login');
            }
        })
})();