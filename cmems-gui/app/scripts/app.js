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
		'pascalprecht.translate',
		'ngStorage'
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
	.constant("ANONYMOUS_USER", {
		"username": "anonymous",
		"password": "anonymous"
	})
	//login service configuration
	.config(['$httpProvider',function($httpProvider) { // provider-injector
	  // This is an example of config block.
	  // You can have as many of these as you want.
	  // You can only inject Providers (not instances)
	  // into config blocks.
		// alternatively, register the interceptor via an anonymous factory
		$httpProvider.interceptors.push('LoginInterceptor');
	}])

	.run(['$rootScope','$cookies','ANONYMOUS_USER','ArrayService', 'AuthenticationService', 'configuration','$location','$http',
		function($rootScope,$cookies,ANONYMOUS_USER,ArrayService,AuthenticationService,configuration,$location,$http) {

			$rootScope.isReload=null;
			var configurationText = JSON.stringify(configuration).replace(/locationHost/g,document.location.host);
			var configurationCurrentHost = JSON.parse(configurationText);

			$rootScope.map=0;
			$rootScope.loadingProgress=false;
			$rootScope.menuList = [];
			$rootScope.fullList = [
				{
					link : '#/infoecontacts',
					name: 'Info e contatti',
					icon: 'info_outline',
					description :'Il Sistema Informativo Centralizzato (SIC) ha come obiettivo la raccolta, la gestione e la condivisione a livello comunitario dei dati provenienti dai Programmi di Monitoraggio nell’ambito della Direttiva Quadro sulla Strategia Marina (2008/56/CE) recepita nella normativa nazionale mediante il D.lgs. 190/2010',
					users:'su,arpa,amp,cnr,ispra,mattm,administrator',
					viewName:''
				},
				{
					link : '#/gis',
					name: 'Dati geografici',
					icon: 'public',
					description :'Accesso mediante web-GIS alle informazioni geografiche derivanti dai Programmi di Monitoraggio nell’ambito della Direttiva Quadro sulla Strategia Marina (2008/56/CE)',
					users:'su,arpa,amp,cnr,ispra,mattm,administrator'
				},
				{
					link : '#/management',
					name: 'Gestione utenti',
					icon: 'supervisor_account',
					description :'Gestione e profilazione degli utenti',
					users:'administrator'
				}
			];


			//var configurationText = JSON.stringify(configuration).replace(/locationHost/g,document.location.host);
//			var configurationText = JSON.stringify(configuration).replace(/locationHost/g,"marine-cmems.rheticus.eu");
//			var configurationCurrentHost = JSON.parse(configurationText);


$rootScope.$watch("login.details", function (details) {
		if(details){
			$rootScope.menuList=[];
			for (var i = 0; i < $rootScope.fullList.length; i++) {
				if($rootScope.fullList[i].users.indexOf(details.info.role.code.toLowerCase())!==-1){
					$rootScope.menuList.push($rootScope.fullList[i]);
				}
			}
			popolateRoles();
		}

});


$rootScope.checkUserPermissionView =function(){
	var path=$location.path();
	$rootScope.state=path.replace("/","");
	if($rootScope.login.details && path!=="/" && path!=="/privacy" && path!=="/responsability" && path!=="/accessibility" && path!=="/infoecontacts" && path!=="/configuration" ){
		var trovato=false;
		var i = 0;

		while ( i < $rootScope.fullList.length && !trovato) {
			if($rootScope.fullList[i].link.indexOf(path)>-1){ //*****QUI DEVE ANDARE IL PROFILO********
				trovato=true
			}
			i++;
		}
		i--;
		if(trovato){
			if($rootScope.fullList[i].users.indexOf($rootScope.login.details.info.role.code.toLowerCase())===-1){
				window.open("#/not_authorized",'_self',false);
				return false;
			}else{
				return true;
			} //*****QUI DEVE ANDARE IL PROFILO********
		}else{
			window.open("#/not_authorized",'_self',false);
			return false;
		}
	}else if(path==="/"){
		return true;
	}else{
		return false;
	}
}

var getResultCallback=function(url,name){
	$http.get(url)
		.success(function (response) {
			for (var k = 0; k < response.length; k++) {
				var template={};
				var nameTempId= "id"+name.substring(0,1)+name.substring(1).toLowerCase();
				eval("template.id=response[k]."+nameTempId+";");
				template.name=name;
				template.details=response[k].name;
				$rootScope.detailsCompanies.push(template);
			}
		})
		.error(function (response) { // jshint ignore:line
		});
}

var popolateRoles= function () {
	$rootScope.roles=[];
	var url = $rootScope.configurationCurrentHost.rheticusAPI.host+$rootScope.configurationCurrentHost.rheticusAPI.getRoles;
	$http.get(url)
		.success(function (response) {

			for (var i = 0; i < response.length; i++) {
				var template={};
				template.idRole=response[i].idRole;
				template.code=response[i].code;
				template.name=response[i].name;
				$rootScope.roles.push(template);
			}
		})
		.error(function (response) { // jshint ignore:line
		});
};


			angular.extend($rootScope,{
				"configurationCurrentHost" : configurationCurrentHost,
				"markerVisibility" : false,
				"login" : {
					"logged" : false,
					"details" : null
				},
				"anonymousDetails" : null
			});


			//retrieve details for anonymous user (login simulation)
			AuthenticationService.Login(ANONYMOUS_USER.username,ANONYMOUS_USER.password,
				function(response) {
					if(response.username && (response.username===ANONYMOUS_USER.username)) {
						$rootScope.anonymousDetails = {
							"authdata" : "",
							"info" : response
						};
						if (($rootScope.login.details===null) && ($rootScope.anonymousDetails!==null)){
							$rootScope.login.details = ArrayService.cloneObj($rootScope.anonymousDetails);
							if($rootScope.login.details){
				        $rootScope.menuList=[];
				        for (var i = 0; i < $rootScope.fullList.length; i++) {
				          if($rootScope.fullList[i].users.indexOf($rootScope.login.details.info.name)!==-1){
				            $rootScope.menuList.push($rootScope.fullList[i]);
				          }
				        }
				      }
						}
					} else {
						// do nothing
					}
				}
			);




		}
	]
);
