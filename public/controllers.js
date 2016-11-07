angular.module('weatherIPCA')
    .controller('loginController', function($scope, $location, $rootScope) {
        $rootScope.hideTopBar = true;
        $scope.goView = function(view) {
            $location.path(view);
        }
    });

angular.module('weatherIPCA')
    .controller('homeController', function($scope, $location, $rootScope, $http) {
        //topbar na ngView
        $rootScope.hideTopBar = false;

        //método responsável pelo redirecionamento
        $scope.goView = function(view) {
            $location.path(view);
        }

        //variavel onde é guardado o valor a apresentar na textbox principal
        $scope.actualLocation = "Praia";

        //método chamada quando é feito o load deste controller
        $scope.$on('$routeChangeSuccess', function () {
            $scope.actualLocationFunction();
        });
        
        //função que retorna a localização actual
        $scope.actualLocationFunction = function() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    $http({
                        method: 'GET',
                        url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + position.coords.latitude + ',' + position.coords.longitude + '&key=AIzaSyAiJO35RmsBztphqjN2q6KidJskplx6fCw'
                    }).then(function successCallback(response) {
                        $scope.actualLocation = response.data.results[1];
                    }, function errorCallback(response) {
                        $scope.actualLocation = "Praia"
                    });
                });
            }
        };
    });

