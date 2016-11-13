var app = angular.module('weatherIPCA', ['ngRoute', 'ngAnimate','mdo-angular-cryptography','ngCookies']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : 'views/home',
        controller: 'homeController'
    })
    .when("/login", {
        templateUrl : 'views/login',
        controller: 'loginController',
        roleAccess: 'all'  //controlar as roles, neste caso admitimos apenas 2 casos, acessível ou não, com prespectiva de criar várias roles
    })
    .when("/register", {
        templateUrl : 'views/login/register.html',
        controller: 'loginController'
    })
    .when("/home", {
        templateUrl : 'views/home',
        controller: 'homeController'
    })
    .otherwise({
        redirect: 'views/home'
    })
}]);
