angular.module('weatherIPCA')
    .controller('mainController', function($scope, $location, LoginService) {
        $scope.$on('$routeChangeStart', function(scope, next, current) {
            console.log(next.$$route.isLogged);
        })
    })