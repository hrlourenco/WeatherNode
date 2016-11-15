/* esta directiva serve para controlar a visibilidade de um dado elemento numa view, de acordo com as permissões */
angular.module('weatherIPCA')
    .directive('validatePermission', ['Permissions', 'LoginService',
         function(Permissions, Login) {
             return {
                link: function(scope, elem, attrs) {
                    var auxLogin;
                    //criar uma watch às alterações em realtime que acontecem no serviço
                    scope.$watch(function() {
                        auxLogin = {
                            role: Login.role,
                            isLogged: Login.isLogged
                        }
                        return Login.isLogged;
                    },
                    function(newIsLogged) {
                        if(typeof newIsLogged !== 'undefined') {
                            if(typeof attrs.hasPermission === 'string') //verificar se o valor do atributo hasPermission é uma string que estamos aqui a criar
                            {
                                throw 'o atributo hasPermission tem de ser do tipo String';
                            }
                            var valor = attrs.validatePermission.trim().split(',');

                            //definir uma função para comandar a visibilidade do elemento
                            function toggleVisibilityPermission() {
                                var access = false;
                                valor.forEach(function(val) {
                                    if(Permissions.hasPermission(val.trim()) && auxLogin.isLogged && auxLogin.role==val.trim()) {
                                        access = true;
                                    }
                                });

                                if(access) {
                                    elem.show();    
                                }
                                else {
                                    elem.hide();
                                }
                            }
                            toggleVisibilityPermission();
                            scope.$on('permissionsChanged', toggleVisibilityPermission);
                        }
                    });
                }
            }
         }]);