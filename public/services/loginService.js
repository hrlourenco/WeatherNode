angular.module('weatherIPCA')
    .factory('LoginService', function() {
        return {
            isLogged: false,
            username: ''
        }
    });