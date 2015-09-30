angular.module("myApp", ['ngRoute', 'ngAnimate', 'ngSanitize'])
    .controller('myCtrl', ['$scope', '$routeParams', '$rootScope', '$location', '$window', '$http', '$sce', function ($scope, $routeParams, $rootScope, $location, $window, $http, $sce) {

        $scope.params = $routeParams;
        $scope.data = {};
        
        //for easier manipulation and depending on input Json this ends up instantiated as a javascript array
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

        //for easier manipulation and depending on input Json this ends up instantiated as a javascript object
        $scope.geRefJSONAsObject = function (file) {
            $http.get('refs/' + file + '.json')
                .then(function (res) {
                    $scope.data[file] = res.data;
                    console.log($scope.data); //check data loaded
                });
        };

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

        $scope.checkAndLoad = function (object, isit) {
            if ($scope.data[object] === undefined) {
                if (isit !== 'no') {
                    $scope.geRefJSON(object);
                } else {
                    $scope.geRefJSONAsObject(object);
                }
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
                controller: 'HTMLSyntaxCtrl',
                templateUrl: 'content/html.html'
            })
            .when('/html/elements', {
                controller: 'HTMLElementsCtrl',
                templateUrl: 'content/html/elements.html'
            })
            .when('/html/tag/:HTMLElementId', {
                controller: 'HTMLElementsCtrl',
                templateUrl: 'content/html/element.html'
            })
            .when('/sass', {
                controller: 'SassCtrl',
                templateUrl: 'content/sass.html'
            })

        .otherwise({
            redirectTo: '/main'
        });
    }])
    .controller('SassCtrl', ['$scope', function ($scope) {
        $scope.checkAndLoad('SassCLI');
        $scope.checkAndLoad('Sass');
            }])
    .controller('HTMLSyntaxCtrl', ['$scope', function ($scope) {
        $scope.checkAndLoad('HTMLSyntax');
            }])
    .controller('HTMLElementsCtrl', ['$scope', function ($scope) {
        $scope.checkAndLoad('HTMLGroups', 'no');
        $scope.checkAndLoad('HTMLElements');

    }])
    .filter('trust', ['$sce', function ($sce) {
        return function (code) {
            return $sce.trustAsHtml(code);
        };
}]);
