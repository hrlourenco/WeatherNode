angular.module('weatherIPCA')
    .controller('loginController', function($scope, $location, $rootScope, $http) {
        $rootScope.hideTopBar = true;
        $scope.goView = function(view) {
            $location.path(view);
        }
    });

angular.module('weatherIPCA')
    .controller('homeController', function($scope, $location, $rootScope, $http, $window) {
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
                        $scope.user.nome = response.data.results[1].formatted_address;
                        $scope.user.lat = position.coords.latitude;
                        $scope.user.lng = position.coords.longitude;
                    }, function errorCallback(response) {
                        $scope.actualLocation = "Praia"
                    });
                });
            }
        };

        $scope.user = {'nome':'', 'lat':'', 'lng':''};

        $scope.getPraia = function(place) {
            $scope.user.nome = place.name;
            $scope.user.lat = place.geometry.location.lat();
            $scope.user.lng = place.geometry.location.lng();
            $scope.$apply(); //serve para aplicar n caso de termos modelos ligados
                        
            var map = new google.maps.Map(document.getElementById('map'), {
                center: {lat: $scope.user.lat, lng: $scope.user.lng},
                zoom: 12
            });

            var center = new google.maps.LatLng($scope.user.lat,$scope.user.lng);

            var marker = new google.maps.Marker({
                map: map,
                position: center
            });
        }

        $scope.airbnb = function() {
            $window.open('https://www.airbnb.pt/s/' + $scope.user.nome, '_blank');
        }
        
    });

