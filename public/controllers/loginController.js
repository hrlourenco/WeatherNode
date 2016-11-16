angular.module('weatherIPCA')
    .controller('loginController', ['$scope', '$location', '$rootScope', '$http', '$crypto', '$cookies', 'LoginService',
        function($scope, $location, $rootScope, $http, $crypto, $cookies, User) {
            $rootScope.hideTopBar = true;
            
            //modelos
            $scope.errorMessage = { error: false, success: false, message: ''};
            $scope.credentials = { userId: '', username: User.username, password: '', repeatpassword: ''};
            
            //função para o botao submit, vai à API tirar os dados do utilizador
            $scope.loginSubmit = function() {
                //var hash = $crypto.encrypt($scope.credentials.username + $scope.credentials.password, 'PalavraReservadaDeEncriptacaoFromServer');
                var hash = $scope.credentials.password;
                //console.log(hash);
                $http({
                    method: 'GET',
                    url: User.apiURL + '/users/' + hash,
                }).success(function (response) {
                    //dados do serviço LoginService
                    User.userId = response._id;
                    User.username = $scope.credentials.username;
                    User.isLogged = true;
                    User.role = User.defaultRole;
                    User.cookieSchema.userId = response._id;
                    User.cookieSchema.role = User.defaultRole;
                    User.cookieSchema.username = $scope.credentials.username;
                    //dados do modelo da scope
                    $scope.errorMessage.success = true;
                    $scope.errorMessage.error = false;
                    $scope.errorMessage.message = 'Deseja gravar os seus dados?';
                }).error(function (error, status) {
                    //dados do serviço LoginService
                    User.userId = '';
                    User.username = '';
                    User.isLogged = false;
                    User.role = User.defaultRole;
                    User.cookieSchema.userId ='';
                    User.cookieSchema.username = '';
                    User.cookieSchema.role = User.defaultRole;
                    //remover cookie
                    $cookies.remove(User.cookieName);
                    //dados do modelo da scope
                    $scope.errorMessage.success = false;
                    $scope.errorMessage.error = true;
                    $scope.errorMessage.message = 'Credenciais inválidas!';
                    // console.log(response);
                });
            };

            //função para criação de cookie
            $scope.createCookie = function(req) {
                if(req) {
                    $cookies.putObject(User.cookieName, User.cookieSchema);
                }
                $location.path('/home');
            }

            $scope.createNewUser = function() {
                if($scope.credentials.password == $scope.credentials.repeatpassword) {
                    var dataPost = {
                        "username": $scope.credentials.username,
                        "passwordHash": $scope.credentials.password
                    };
                    $http({
                        method: 'POST',
                        url: User.apiURL + '/users/',
                        data: dataPost
                    }).success(function (response) {
                        //dados do serviço LoginService
                        User.userId = response._id;
                        User.username = $scope.credentials.username;
                        User.isLogged = true;
                        User.role = User.defaultRole;
                        User.cookieSchema.userId = response._id;
                        User.cookieSchema.role = User.defaultRole;
                        User.cookieSchema.username = $scope.credentials.username;
                        //dados do modelo da scope
                        $scope.errorMessage.success = true;
                        $scope.errorMessage.error = false;
                        $scope.errorMessage.message = 'Deseja gravar os seus dados?';
                    }).error(function (error, status) {
                        //dados do serviço LoginService
                        User.userId = '';
                        User.username = '';
                        User.isLogged = false;
                        User.role = User.defaultRole;
                        User.cookieSchema.userId ='';
                        User.cookieSchema.username = '';
                        User.cookieSchema.role = User.defaultRole;
                        //remover cookie
                        $cookies.remove(User.cookieName);
                        //dados do modelo da scope
                        $scope.errorMessage.success = false;
                        $scope.errorMessage.error = true;
                        $scope.errorMessage.message = 'Erro ao criar utilizador!';
                        
                        console.log(error);
                    });       
                }
                else {
                    $scope.errorMessage.success = false;
                    $scope.errorMessage.error = true;
                    $scope.errorMessage.message = 'Password não idênticas!';
                } 
            }

            $scope.validatePassword = function() {
                if($scope.credentials.password != $scope.credentials.repeatpassword) {
                    $scope.errorMessage.success = false;
                    $scope.errorMessage.error = true;
                    $scope.errorMessage.message = 'Password não idênticas!';
                } else {
                    $scope.errorMessage.success = false;
                    $scope.errorMessage.error = false;
                    $scope.errorMessage.message = '';
                }
            }
        }
    ]);
