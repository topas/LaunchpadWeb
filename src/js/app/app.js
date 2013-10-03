var launchpadApp = angular.module('launchpadApp', ['$strap.directives']).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/play', {templateUrl: 'play.html'}).
      when('/about', {templateUrl: 'about.html'}).
      otherwise({redirectTo: '/play'});
}]);