angular.module('weatherIPCA')
    .controller('loginController', ['$scope', '$location', '$rootScope', '$http', '$crypto', '$cookies', 'LoginService',
        function($scope, $location, $rootScope, $http, $crypto, $cookies, User) {
            $rootScope.hideTopBar = true;

            $scope.errorMessage = { error: false, success: false, message: ''};
            $scope.credentials = { userId: '', username: User.username, password: ''};

            $scope.loginSubmit = function() {
                //var hash = $crypto.encrypt($scope.credentials.username + $scope.credentials.password, 'PalavraReservadaDeEncriptacaoFromServer');
                var hash = $scope.credentials.username + '-' + $scope.credentials.password;
                //console.log(hash);
                $http({
                    method: 'GET',
                    url: User.apiURL + '/users/' + hash,
                }).success(function (response) {
                    User.userId = response._id;
                    User.username = $scope.credentials.username;
                    User.isLogged = true;
                    User.role = User.defaultRole;
                    User.cookieSchema.userId = response._id;
                    User.cookieSchema.role = User.defaultRole;
                    User.cookieSchema.username = $scope.credentials.username;
                    $scope.errorMessage.success = true;
                    $scope.errorMessage.error = false;
                    $scope.errorMessage.message = 'Deseja gravar os seus dados?';
                }).error(function (error, status) {
                    User.userId = '';
                    User.username = '';
                    User.isLogged = false;
                    User.role = User.defaultRole;
                    User.cookieSchema.userId ='';
                    User.cookieSchema.username = '';
                    User.cookieSchema.role = User.defaultRole;
                    $cookies.remove(User.cookieName);
                    $scope.errorMessage.success = false;
                    $scope.errorMessage.error = true;
                    $scope.errorMessage.message = 'Credenciais inválidas!';
                    // console.log(response);
                });
            };

            $scope.createCookie = function(req) {
                if(req) {
                    $cookies.putObject(User.cookieName, User.cookieSchema);
                }
                $location.path('/home');
            }
        }
    ]);
//LOGIN: http://stackoverflow.com/questions/18805054/what-is-the-proper-way-to-log-in-users-using-angular-express
//https://github.com/middleout/angular-cryptography