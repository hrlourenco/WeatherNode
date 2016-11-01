angular.module('weatherIPCA')
    .controller('loginController', function($scope, $location, $rootScope) {
        $rootScope.hideTopBar = true;
        $scope.goView = function(view) {
            $location.path(view);
        }
    });

angular.module('weatherIPCA')
    .controller('homeController', function($scope, $location, $rootScope) {
        $rootScope.hideTopBar = false;
        $scope.goView = function(view) {
            $location.path(view);
        }
    });

