var app = angular.module('weatherIPCA', ['ngRoute', 'ngAnimate','mdo-angular-cryptography']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : 'views/home/index.html',
        controller: 'homeController'
    })
    .when("/login", {
        templateUrl : 'views/login/index.html',
        controller: 'loginController'
    })
    .when("/register", {
        templateUrl : 'views/login/register.html',
        controller: 'loginController'
    })
    .when("/home", {
        templateUrl : 'views/home/index.html',
        controller: 'homeController'
    })
    .otherwise({
        redirect: '/views/home/index.html'
    })
}]);
