'use strict';

/**
 * @ngdoc function
 * @name rheticus.service:SpatialService
 * @description
 * # SpatialService
 * Spatial Service for rheticus project
 */
angular.module('rheticus')
  .service('LoginInterceptor', function(SessionService){
    var service = this;
    service.request = function(config){
      var access_token= SessionService.getData("token");
      if (access_token) {
          config.headers.authorization = "Bearer "+ access_token;
      }

      return config;
    }
  });
