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

        $scope.formDataProject = {};
        $scope.formDataTask = [];

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