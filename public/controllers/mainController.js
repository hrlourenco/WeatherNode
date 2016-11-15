angular.module('weatherIPCA')
    .controller('mainController', ['$scope', '$location', '$cookies', 'LoginService', 'Permissions', '$window',
    function($scope, $location, $cookies, Login, Permissions, $window) {
        $scope.$on('$routeChangeStart', function(scope, next, current) {
            //auto login
            var val = $cookies.getObject(Login.cookieName);
            if(val != null) {
                Login.userId = val.userId;
                Login.isLogged = true;
                Login.username = val.username;
                Login.role = val.role;
                $scope.isLogged = true;
            } else {
                if(Login.isLogged) {
                    $scope.isLogged = true;
                }
            }

            var routeRole = next.$$route.permission; //vai ao controlador buscar o atributo 'permission'
            if(routeRole!=null) {
                if(!Permissions.hasPermission(routeRole) || Login.role!=routeRole || !Login.isLogged) { //verificar se existe na lista de roles
                    $location.path('/');
                }
            }
        });
        //verificar alterações no scope. Esta função serve para actualizar uma varia se o utilizador está ou não logado
        //e com isto, caso exista login, escode o botão de login
        $scope.$watch(function() {
            return Login.isLogged;
        },
            function(newValueLoggedIn) {
                $scope.isLogged = newValueLoggedIn;
            }
        );
        
        //método responsável pelo redirecionamento
        $scope.goView = function(view) {
            $location.path(view);
        }

        $scope.logout = function() {
            $scope.isLogged = false;
            Login.logout();
            $cookies.remove(Login.cookieName);
            $location.path('/');
            $window.location.reload();
        }
    }]);