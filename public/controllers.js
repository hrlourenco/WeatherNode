angular.module('weatherIPCA')
    .controller('loginController', function($scope, $location) {
        $scope.nome = 'Hugo';
        $scope.goView = function(view) {
            $location.path(view);
        }
    });

angular.module('weatherIPCA')
    .controller('homeController', function($scope, $location) {
        $scope.goView = function(view) {
            $location.path(view);
        }
    });
