//serviço para controlar o login (cookie ou não)
angular.module('weatherIPCA')
    .factory('LoginService', function() {
        return {
            apiURL: 'https://weatheripca.herokuapp.com/api/v1',
            isLogged: false,
            userId: '',
            username: '',
            role: '',
            defaultRole: 'general',
            cookieName: 'db0f4826',
            cookieSchema: {
                userId: '',
                username: '',
                role:''
            },
            logout: function() {
                apiURL = 'https://weatheripca.herokuapp.com/api/v1',
                isLogged = false,
                userId = '',
                username = '',
                role = '',
                defaultRole = 'general',
                cookieName = 'db0f4826',
                cookieSchema = {
                    username: '',
                    role:''
                }
            }
        }
    });

angular.module('weatherIPCA')
    .factory('Permissions', function($rootScope) {
        var permissionList = [];
        return {
            //função que permite injectar a lista de permissões 
            setPermission: function (list) {
                permissionList = list;
                $rootScope.$broadcast('permissionsChanged');
            },
            hasPermission: function (permission) {
                //verificar se a permissão enviada faz parte da lista de permissões aceites
                return permissionList.some(function(item) {
                    return item === permission;
                });
            }
        }
    });
