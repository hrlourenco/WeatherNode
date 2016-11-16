angular.module('weatherIPCA')
    .controller('homeController', ['$scope', '$location', '$rootScope', '$http', '$window', 'LoginService',
    function($scope, $location, $rootScope, $http, $window, Login) {
        //topbar na ngView
        $rootScope.hideTopBar = false;

        //variavel onde é guardado o valor a apresentar na textbox principal
        $scope.actualLocation = "Praia ";

        //método chamada quando é feito o load deste controller
        $scope.$on('$routeChangeSuccess', function () {
            $scope.actualLocationFunction();
        });

        //só após a primeira pesquisa, tem acesso às INTEGRAÇÕES
        $scope.firstRequest = false;
        
        //modelo utilizado na view
        $scope.user = {'nome':'', 'lat':'', 'lng':'', 'temperatura':'-', 'rating':'-', 'imagem':'', 'mensagemTempo':'', 'tempo':'', 'praiaId':'', 'favorita':'false'};
        $scope.dateToday = new Date();

        //função que retorna a localização actual
        $scope.actualLocationFunction = function() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    //pegar dados do google e preencher o modelo que está na view
                    $http({
                        method: 'GET',
                        url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + position.coords.latitude + ',' + position.coords.longitude + '&key=AIzaSyAiJO35RmsBztphqjN2q6KidJskplx6fCw'
                    }).then(function successCallback(response) {
                        $scope.actualLocation = response.data.results[0].formatted_address;
                        $scope.user.nome = response.data.results[0].address_components[0].short_name;
                        $scope.user.lat = position.coords.latitude;
                        $scope.user.lng = position.coords.longitude;

                        var dataPost = {
                            "praia": $scope.user.nome,
                            "coordenadas": {
                                "lat":$scope.user.lat,
                                "long":$scope.user.lng
                            }
                        }
                        //extrair da API os dados da praia
                        $scope.getPraiaFromAPI(dataPost);

                    }, function errorCallback(response) {
                        $scope.actualLocation = "Praia "
                    });
                });
            }
        };

        //função invocada pelo javascript com os dados do autocomplete
        $scope.getPraia = function(place) {
            if(place.address_components[0].short_name.length<3) {
                $scope.actualLocation = place.address_components[1].short_name;
            } else {
                $scope.actualLocation = place.address_components[0].short_name;
            }
            $scope.actualLocation = place.formatted_address;
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

            if(map!=null) {
                $scope.firstRequest = true;
            }

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
                $scope.user.temperatura = response.praia.tempo[0].tempMin;
                $scope.user.imagem = response.praia.imagem;
                $scope.user.mensagemTempo = response.praia.tempo[0].mensagem;
                $scope.user.tempo = response.praia.tempo;
                $scope.user.praiaId = response.praia._id;
                if(response.praia.rating!=null) {
                    $scope.user.rating = response.praia.rating;
                }
            }).error(function (error, status) {
                console.log(error);
            });
        }

        $scope.updateImage = function() {
            document.getElementById('fotoPraia').src = $scope.user.imagem;
        }

        /**INTEGRAÇÕES */
        $scope.airbnb = function() {
            $window.open('https://www.airbnb.pt/s/' + $scope.user.nome, '_blank');
        }
        
        $scope.updateFavorite = function() {
            var fav = false;
            if($scope.user.favorita=='false') {
                fav = 'true';
            }
            var dataPost = {
                "userId":Login.userId,
                "praiaUserId": $scope.user.nome,
                "favorita":fav
            };
            $http({
                method: 'POST',
                url: Login.apiURL + '/praias/fav/',
                data: dataPost
            }).success(function (response) {
                $scope.user.favorita = fav;
/*                
                document.getElementById('fotoPraia').src = $scope.user.favoritaImg;
                if($scope.user.favorita=='false') {
                    $scope.user.favoritaImg = 'images/general/off.png';
                }
                else {
                    $scope.user.favoritaImg = 'images/general/on.png';
                }
                document.getElementById('fotoPraia').src = $scope.user.favoritaImg;
                */
                console.log(response);
            }).error(function (error, status) {
                console.log(error);
            });        
        }
    }]);

