angular.module('weatherIPCA')
    .directive('checkUserRoute', ['$rootScope','$location','LoginService',
         function($rootScope, $location, User) {
             return {
                // compile: function(element, attr, linker){
                //     return function(scope, $element, attr) {
                //         $rootScope.$on('$locationChangeSuccess', update);
                //             update();

                //             // update view
                //             function update(evt, newUrl, oldUrl){
                //                 console.log(oldUrl);
                //                 console.log(newUrl);
                //             }
                //     }
                // }
                link: function(scope, elem, attrs, ctrl) {
                    console.log('ng-included elements work execute this!');
                    $root.$on('$routeChangeStart', function(e, curr, prev) {
                        console.log('-------!');
                        if(prev.access.isFree) {
                            alert('coool');
                        }
                    })
                }
            }
         }
    ]);