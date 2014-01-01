var launchpadApp = angular.module('launchpadApp', ['$strap.directives']).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/play', {templateUrl: 'play.html'}).
      when('/about', {templateUrl: 'about.html'}).
      otherwise({redirectTo: '/play'});
}]);

launchpadApp.directive('slider', function() {
	return {
		require:"ngModel",
		restrict: 'A',
		link:  function(scope, element, attrs, ngModel) {

			scope.$watch(function(){
                    return ngModel.$modelValue;
                }, function(modelValue) {
                	if (modelValue == undefined) {
                		return;
                	}

					 (<any>$(element)).slider('setValue', modelValue);                   
                });

			(<any>$(element)).slider().on('slide', function(ev) {
    			scope.$apply(function() {    				
    				ngModel.$setViewValue((<any>$(element)).slider('getValue'));  
    				scope.$eval(attrs.ngChange);     				
    			});    			
  			});
		}

	};
});