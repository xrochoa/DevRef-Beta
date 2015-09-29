angular.module("myApp", ['ngRoute', 'ngAnimate', 'ngSanitize'])
    .controller('myCtrl', ['$scope', '$routeParams', '$rootScope', '$location', '$window', '$http', '$sce', function ($scope, $routeParams, $rootScope, $location, $window, $http, $sce) {

        $scope.params = $routeParams;
        $scope.data = {};

        $scope.geRefJSON = function (file) {
            $http.get('refs/' + file + '.json')
                .then(function (res) {
                    $scope.data[file] = [];
                    var key;
                    var i = 0;
                    for (key in res.data) {
                        $scope.data[file][i] = res.data[key];
                        i++;
                    }
                    console.log($scope.data); //check data loaded

                });
        };

        $scope.sources = ['HTMLSyntax', 'HTMLElements', 'Sass', 'SassCLI'];

        for (i = 0; i < $scope.sources.length; i++) {
            $scope.geRefJSON($scope.sources[i]);
        }



        $scope.globalAttrs = function (items, isit) {
            var global = {};
            var other = {};
            angular.forEach(items, function (value, key) {
                if (value.tag === 'HTML elements') {
                    global[key] = value;
                } else {
                    other[key] = value;
                }
            });
            if (isit === 'yes') {
                return global;
            } else {
                return other;
            }
        };

        $scope.trust = function (html) {
            return $sce.trustAsHtml(html);
        };


            }])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/main', {
                templateUrl: 'content/main.html'
            })
            .when('/about', {
                templateUrl: 'content/about.html',
            })
            .when('/html', {
                templateUrl: 'content/html.html'
            })
            .when('/html/elements', {
                templateUrl: 'content/html/elements.html'
            })
            .when('/html/tag/:HTMLElementId', {
                templateUrl: 'content/html/element.html'
            })
            .when('/sass', {
                templateUrl: 'content/sass.html'
            })

        .otherwise({
            redirectTo: '/main'
        });
    }])
    .filter('trust', ['$sce', function ($sce) {
        return function (code) {
            return $sce.trustAsHtml(code);
        };
}]);
