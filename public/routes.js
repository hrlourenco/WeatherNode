var app = angular.module('weatherIPCA', ['ngRoute', 'ngAnimate','mdo-angular-cryptography','ngCookies']);

//se não for inicializada a propriedade permission, deixa aceder sem login
app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : 'views/home',
        controller: 'homeController',
        permission: 'general' //controlar as roles, neste caso admitimos apenas 2 casos, acessível ou não, com prespectiva de criar várias roles
    })
    .when("/login", {
        templateUrl : 'views/login',
        controller: 'loginController'
    })
    .when("/register", {
        templateUrl : 'views/login/register.html',
        controller: 'loginController'
    })
    .when("/home", {
        templateUrl : 'views/home',
        controller: 'homeController',
        permission: 'general'
    })
    .otherwise({
        redirect: 'views/home',
        permission: 'general'
    })
    .when("/details", {
        templateUrl : 'views/details',
        controller: 'homeController',
        permission: 'general'
    })
}]);

//#TODO# lista de permissoes, deve ser obtida do servidor
app.run(function(Permissions) {
    var list = [];
    list.push("general");
    list.push("admin");
    Permissions.setPermission(list);
});
