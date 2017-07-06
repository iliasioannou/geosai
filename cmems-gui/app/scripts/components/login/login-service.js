'use strict';

/**
 * @ngdoc function
 * @name rheticus.service:AuthenticationService
 * @description
 * # AuthenticationService
 * Authentication Service for rheticus project
 */
angular.module('rheticus')
	.factory('AuthenticationService',['Base64','$http','$cookies','$rootScope','ArrayService','SessionService',
		function(Base64,$http,$cookies,$rootScope,ArrayService,SessionService){
			var service = {};


			service.Login = function (username, password, callback) {

				//Use this for real authentication in POST
				/* $http.post(configuration.authentication.url,
					{username : username, password : password})
					.success(function (response) {
						callback(response);
					}
				);*/

				// var timeStamp=new Date(); // big workaround for explorer cache problem with same link
				// var authurl = $rootScope.configurationCurrentHost.rheticusAPI.host+$rootScope.configurationCurrentHost.rheticusAPI.authentication+"?"+timeStamp.getTime();
				// var authdata = Base64.encode(username + ":" + password);
	      // //TODO: uncomment for HTTPS
	      // $http.defaults.headers.common.Authorization = "Basic " + authdata;
				// $http.get(authurl)
        //   .success(function (response) {
        //     if (response.username){
        //       callback(response);
        //     } else {
        //       callback({message:"Counldn't retrieve the username!"});
        //     }
  			// 	})
        //   .error(function (response) { // jshint ignore:line
				// 		console.log("error");
				// 		//HTTP STATUS != 200
				// 		var message = (response.code && (response.code!=="")) ? response.code : "";
				// 		message += (response.message && (response.message!=="")) ? ((message!=="") ? " : " : "") + response.message : "";
        //     callback({"message":message});
				// 	});




			 var clientId = "cmemsClient";
			 var clientSecret = "INsb0skEFM";
			 var authurl = $rootScope.configurationCurrentHost.rheticusAPI.host+$rootScope.configurationCurrentHost.rheticusAPI.authentication+"?"+new Date().getTime();
			 var postObj={
				 "clientId":clientId,
				 "clientSecret":clientSecret,
				 "username" : username,
				 "password" : password,
				 "grant_type" : "password"
			 };

			 var authdata = Base64.encode(clientId + ":" + clientSecret);
			 $http.defaults.headers.common.Authorization = "Basic " + authdata;

			 SessionService.deleteKey("token");
			 $http.post(authurl, postObj)
				 .success(function (data, status, headers, config) {
				 	delete $http.defaults.headers.common.Authorization ;
					 console.log("success");
					 SessionService.setData("token",data.access_token);

					  var timeStamp=new Date(); // big workaround for explorer cache problem with same link
						var authurl = $rootScope.configurationCurrentHost.rheticusAPI.host+$rootScope.configurationCurrentHost.rheticusAPI.userDetails+"?"+timeStamp.getTime();

						$http.get(authurl)
		          .success(function (response) {
		            if (response.username){
		              callback(response);
		            } else {
		              callback({message:"Counldn't retrieve the username!"});
		            }
								if (response.username==='anonymous') {
									$rootScope.login.logged = false;
								}else {
									$rootScope.login.logged = true;
								}

					 			 $rootScope.login.details = {
					 				 "authdata" : authdata,
					 				 "info" : response
					 			 };
					 			 $rootScope.checkUserPermissionView();
								 //  $cookies.putObject('rheticus.login.details', $rootScope.login.details);
					 			 if($rootScope.login.details.info.username!=='anonymous'){
					 				 $rootScope.userName=$rootScope.login.details.info.username;
					 			 }
		  				})
		          .error(function (response) { // jshint ignore:line
								console.log("error");
							});




				 })
			 .error(function (response, status, header, config) {

				 console.log("error");
				 //HTTP STATUS != 200
				 var message = (response.code && (response.code!=="")) ? response.code : "";
				 message += (response.message && (response.message!=="")) ? ((message!=="") ? " : " : "") + response.message : "";
				 callback({"message":message});
			 });


			};
			service.SetCredentials = function (username, password, response) {
				var authdata = Base64.encode(username + ":" + password);
        //TODO: uncomment for HTTPS
        //$http.defaults.headers.common.Authorization = "Basic " + authdata; // jshint ignore:line
        $rootScope.login.logged = true;
        $rootScope.login.details = {
          "authdata" : authdata,
          "info" : response
        };
				$rootScope.checkUserPermissionView();
        $cookies.putObject('rheticus.login.details', $rootScope.login.details);
				if($rootScope.login.details.info.username!=='anonymous'){
					$rootScope.userName=$rootScope.login.details.info.username;
				}

			};
			service.ClearCredentials = function () {
        //TODO: uncomment for HTTPS
        //$http.defaults.headers.common.Authorization = "Basic ";
				$rootScope.userName="";
        $rootScope.login.logged = false;
        $rootScope.login.details = ArrayService.cloneObj($rootScope.anonymousDetails); //null;
        $cookies.remove('rheticus.login.details');
				var permission=$rootScope.checkUserPermissionView();
				if (!permission) {
					window.open("#/",'_self',false);
				}

			};
			return service;
		}])

	.factory('Base64', function () {
		/* jshint ignore:start */
		var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
		return {
			encode: function (input) {
				var output = "";
				var chr1, chr2, chr3 = "";
				var enc1, enc2, enc3, enc4 = "";
				var i = 0;
				do {
					chr1 = input.charCodeAt(i++);
					chr2 = input.charCodeAt(i++);
					chr3 = input.charCodeAt(i++);
					enc1 = chr1 >> 2;
					enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
					enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
					enc4 = chr3 & 63;
					if (isNaN(chr2)) {
						enc3 = enc4 = 64;
					} else if (isNaN(chr3)) {
						enc4 = 64;
					}
					output = output +
						keyStr.charAt(enc1) +
						keyStr.charAt(enc2) +
						keyStr.charAt(enc3) +
						keyStr.charAt(enc4);
					chr1 = chr2 = chr3 = "";
					enc1 = enc2 = enc3 = enc4 = "";
				} while (i < input.length);
				return output;
			},
			decode: function (input) {
				var output = "";
				var chr1, chr2, chr3 = "";
				var enc1, enc2, enc3, enc4 = "";
				var i = 0;
				// remove all characters that are not A-Z, a-z, 0-9, +, /, or =
				var base64test = /[^A-Za-z0-9\+\/\=]/g;
				if (base64test.exec(input)) {
					window.alert("There were invalid base64 characters in the input text.\n" +
						"Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
						"Expect errors in decoding.");
				}
				input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
				do {
					enc1 = keyStr.indexOf(input.charAt(i++));
					enc2 = keyStr.indexOf(input.charAt(i++));
					enc3 = keyStr.indexOf(input.charAt(i++));
					enc4 = keyStr.indexOf(input.charAt(i++));
					chr1 = (enc1 << 2) | (enc2 >> 4);
					chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
					chr3 = ((enc3 & 3) << 6) | enc4;
					output = output + String.fromCharCode(chr1);
					if (enc3 != 64) {
						output = output + String.fromCharCode(chr2);
					}
					if (enc4 != 64) {
						output = output + String.fromCharCode(chr3);
					}
					chr1 = chr2 = chr3 = "";
					enc1 = enc2 = enc3 = enc4 = "";
				} while (i < input.length);
				return output;
			}
		};
		/* jshint ignore:end */
	});
