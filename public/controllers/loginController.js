angular.module('weatherIPCA')
    .controller('loginController', function($scope, $location, $rootScope, $http, $crypto) {
        $rootScope.hideTopBar = true;
        $scope.goView = function(view) {
            $location.path(view);
        };

        $scope.dataLogin = { username: '', password: ''};

        $scope.loginSubmit = function() {
            var hash = $crypto.encrypt($scope.dataLogin.username + $scope.dataLogin.password, 'ChaveProvenienteDoServidorEmRealTime');
            $http({
                method: 'POST',
                url:'https://weatheripca.herokuapp.com/api/v1/users/U2FsdGVkX18mhjClIf1qolhinhwdN4ED0O0J47ict+EGVAiFjApJRWMAizQMOdFY',
            }).then(function successCallback(response) {
                console.log('oi' + response);
            }), function errorCallback(response) {
                console.log('UPS' + response);
            }
        };
    });

//https://github.com/middleout/angular-cryptography