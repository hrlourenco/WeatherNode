var app = angular.module('weatherIPCA', ['ngRoute', 'ngAnimate']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
    .when("/login", {
        templateUrl : 'views/login/index.html',
        controller: 'loginController'
    })
    .when("/home", {
        templateUrl : 'views/home/index.html',
        controller: 'homeController'
    })
}]);
