'use strict';

/**
 * @ngdoc overview
 * @name rheticus
 * @description
 * # rheticus
 *
 * Main module for rheticus project
 */

angular
	//modules addition
	.module('rheticus',[
		'ngAnimate',
		'ngMaterial',
		'ngMessages',
		'ngCookies',
		'ngResource',
		'ngRoute',
		'ngSanitize',
		'openlayers-directive',
		'openlayers-layerswitcher',
		'ui.bootstrap',
		'angularAwesomeSlider',
		'nvd3',
		'smart-table',
    'services.config',
		'flash',
		'pascalprecht.translate'
	])

	//routing configuration
	.config(['$routeProvider','configuration',function($routeProvider,configuration) {
		$routeProvider
		.when('/',{
			"templateUrl" : "scripts/components/main/main-view.html",
			"controller" : "MainCtrl",
			"controllerAs" : "main"
		})
		.when('/about', {
			"templateUrl": "scripts/components/about/about-view.html",
			"controller": "AboutCtrl",
			"controllerAs": "about"
		})
		.when('/3d', {
			"redirectTo": function() {
					window.location = configuration.cesiumViewer.url;
				}
		})
		.otherwise({
			"redirectTo": "/"
		});
	}])
	//login service configuration
	.run(['$rootScope','$cookies','configuration',
		function($rootScope,$cookies,configuration) {

			var configurationText = JSON.stringify(configuration).replace(/locationHost/g,document.location.host);
			var configurationCurrentHost = JSON.parse(configurationText);

			angular.extend($rootScope,{
				"configurationCurrentHost" : configurationCurrentHost,
				"markerVisibility" : false,
				"login" : {
					"logged" : false,
					"details" : null
				},
				"anonymousDetails" : null
			});
		}
	]
);
