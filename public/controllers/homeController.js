angular.module('weatherIPCA')
    .controller('homeController', ['$scope', '$location', '$rootScope', '$http', '$window', 'LoginService',
    function($scope, $location, $rootScope, $http, $window, Login) {
        //topbar na ngView
        $rootScope.hideTopBar = false;

        //variavel onde é guardado o valor a apresentar na textbox principal
        $scope.actualLocation = "Praia";

        //método chamada quando é feito o load deste controller
        $scope.$on('$routeChangeSuccess', function () {
            $scope.actualLocationFunction();
        });
        
        //modelo utilizado na view
        $scope.user = {'nome':'', 'lat':'', 'lng':''};

        //função que retorna a localização actual
        $scope.actualLocationFunction = function() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    //pegar dados do google e preencher o modelo que está na view
                    $http({
                        method: 'GET',
                        url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + position.coords.latitude + ',' + position.coords.longitude + '&key=AIzaSyAiJO35RmsBztphqjN2q6KidJskplx6fCw'
                    }).then(function successCallback(response) {
                        $scope.user.nome = response.data.results[0].address_components[0].short_name;
                        $scope.user.lat = position.coords.latitude;
                        $scope.user.lng = position.coords.longitude;
                    }, function errorCallback(response) {
                        $scope.actualLocation = "Praia"
                    });
                });
            }
        };

        //função invocada pelo javascript com os dados do autocomplete
        $scope.getPraia = function(place) {
            $scope.actualLocation = place.address_components[0].short_name;
            $scope.user.nome = place.address_components[0].short_name;
            $scope.user.lat = place.geometry.location.lat();
            $scope.user.lng = place.geometry.location.lng();
            $scope.$apply(); //serve para aplicar n caso de termos modelos ligados
            var dataPost;
            //dados do body se o utilizador estiver logado ou deslogado
            if(Login.isLogged) {
                dataPost = {
                    "praia": $scope.user.nome,
                    "coordenadas": {
                        "lat":$scope.user.lat,
                        "long":$scope.user.lng
                    },
                    "userId":Login.userId
                }
            }
            else {
                dataPost = {
                    "praia": $scope.user.nome,
                    "coordenadas": {
                        "lat":$scope.user.lat,
                        "long":$scope.user.lng
                    }
                }
            }

            //extrair da API os dados da praia
            $scope.getPraiaFromAPI(dataPost);
            
            /**funções integração googlemaps */
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

        //obter dados da praia através da API
        $scope.getPraiaFromAPI = function(dataPost) {
            $http({
                method: 'POST',
                url: Login.apiURL + '/praias/',
                data: dataPost
            }).success(function (response) {
                console.log(response);
            }).error(function (error, status) {
                console.log(error);
                console.log(status);
            })
        }

        /**INTEGRAÇÕES */
        $scope.airbnb = function() {
            $window.open('https://www.airbnb.pt/s/' + $scope.user.nome, '_blank');
        }
        
    }]);

