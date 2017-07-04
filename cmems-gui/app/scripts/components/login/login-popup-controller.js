'use strict';

/**
 * @ngdoc function
 * @name rheticus.controller:LoginPopoupCtrl
 * @description
 * # LoginPopoupCtrl
 * Login Popup Controller for rheticus project
 */
angular.module('rheticus')
 	.controller('LoginPopoupCtrl',['$rootScope','$scope','$mdDialog','$http','AuthenticationService',
    function($rootScope,$scope,$mdDialog,$http,AuthenticationService){

      var self = this; //this controller
      var showLoading = false;
      var getLoginStatus = function () {
				return $rootScope.login.logged;
			};

      var getUserDetails = function () {
        var userDetails = {"username" : "", "name" : "", "surname" : "", "company" : "", "email" : ""};
        if (($rootScope.login.details!==null) && $rootScope.login.details.info){
          userDetails = {
            "username" : ($rootScope.login.details.info.username) ? $rootScope.login.details.info.username : "",
            "name" : ($rootScope.login.details.info.name) ? $rootScope.login.details.info.name : "",
            "surname" : ($rootScope.login.details.info.surname) ? $rootScope.login.details.info.surname : "",
            "company" : ($rootScope.login.details.info.company) ? $rootScope.login.details.info.company : "",
            "email" : ($rootScope.login.details.info.email) ? $rootScope.login.details.info.email : ""
          };
        }
        return userDetails;
      };

      var login = function () {
        self.showLoading=true;
				$scope.dataLoading = true;
        console.log("before "+self.username);
				AuthenticationService.Login(self.username,self.password,
          function(response) {
            self.user = "";
            console.log("after "+self.username);
            console.log("after "+response.username);
            if(response.username === self.username) {
  						AuthenticationService.SetCredentials(self.username,self.password,response);
              self.user = getUserDetails().name + " " + getUserDetails().surname;
              self.error = null;
              $mdDialog.hide();
  					} else {
  						self.error = response.message;
  					}
            self.dataLoading = false;
            self.showLoading=false;
  				}
        );
			};
      var logout = function () {
				AuthenticationService.ClearCredentials();
        $mdDialog.hide();

			};

      var piffero = function(){
        console.log('Piffero');
        $mdDialog.hide();
      };

      var showAdd = function() {
        $mdDialog.hide();
        $mdDialog.show({
        controller: DialogController,
        clickOutsideToClose:true,
        template: '<md-dialog aria-label="Mango (Fruit)" style="width:500px">'+
          '			<md-input-container layout="row" layout-align="center">'+
          '				<h3>Aggiungi nuovo utente</h3>'+
          '     </md-input-container>'+
          '<md-content class="md-padding">'+
          '  <form name="userForm">'+
          '    <div layout layout-sm="column">'+
          '      <md-input-container flex>'+
          '        <label>Username</label>'+
          '        <input ng-model="user.username" ng-keyup="clearError()" required>'+
          '      </md-input-container>'+
          '      <md-input-container flex>'+
          '        <label>Password</label>'+
          '        <input ng-model="user.password" type="password" ng-keyup="clearError()" minlength="8" required>'+
          '      </md-input-container>'+
          '    </div>'+
          '    <div layout layout-sm="column">'+
          '      <md-input-container flex>'+
          '        <label>Nome</label>'+
          '        <input ng-model="user.name" ng-keyup="clearError()" required>'+
          '      </md-input-container>'+
          '      <md-input-container flex>'+
          '        <label>Cognome</label>'+
          '        <input ng-model="user.surname" ng-keyup="clearError()" required>'+
          '      </md-input-container>'+
          '    </div>'+
          '     <md-input-container flex style="width: 100%">'+
          '       <label>Email</label>'+
          '       <input  ng-keyup="clearError()" required type="email" name="clientEmail" ng-model="user.email"'+
          '       minlength="10" maxlength="100" ng-pattern="/^.+@.+\..+$/" />'+
          '      </md-input-container>' +
          '    </form>'+
          '			<label ng-show="errorFields" style="color:red;display: block;text-align: center;" style="color:red;">{{ errorName }}</label>'+
          '     <md-progress-linear ng-show="loading" md-mode="indeterminate"></md-progress-linear>'+
          '  </md-content>'+
          '  <div class="md-actions" layout="row">'+
          '    <span flex></span>'+
          '    <md-button ng-click="cancel()"> Chiudi </md-button>'+
          '    <md-button ng-click="saveUser()" class="md-primary"> Salva </md-button> '+
          '  </div>'+
          '</md-dialog>'
      })
    };

    function DialogController($rootScope,$scope, $mdDialog) {

        var errorNameList=["Attenzione!! Compila tutti i campi.","Utente già registrato.","Password troppo corta"];
        $scope.errorName="";
        $scope.errorFields=false;
        $scope.loading=false;
        var getRoleId = function (roleName) {
          console.log("getRoleId");
          console.log(roleName);
          // getIdRegion
          var i=0;
          var trovato=false;
          while (i < $rootScope.roles.length && !trovato) {
            if($rootScope.roles[i].name.indexOf(roleName)>-1){
              trovato=true;
            }
            i++;
          }
          i--;
          console.log($rootScope.roles[i].idRole);
          return $rootScope.roles[i].idRole;

        };
        $scope.clearError = function () {
          if($scope.user && $scope.user.username && $scope.user.password && $scope.user.name && $scope.user.surname && $scope.user.email){
            $scope.errorFields=false;
          }
        }
        $scope.saveUser = function() {
          if($scope.user && $scope.user.username && $scope.user.password && $scope.user.name && $scope.user.surname && $scope.user.email){
            $scope.loading=true;
            console.log($scope.user);
            var url = $rootScope.configurationCurrentHost.rheticusAPI.host+$rootScope.configurationCurrentHost.rheticusAPI.addUsers;
            var postObj={
              "email": $scope.user.email,
              "name": $scope.user.name,
              "surname": $scope.user.surname,
              "username": $scope.user.username,
              "password": $scope.user.password,
              "active": "1",
              "idRole": getRoleId('user')
            };

            console.log(postObj);
            var config = {
                              headers : {
                                'Content-Type': 'application/json;'
                              }
                        };

              $http.post(url, postObj, config)
                .success(function (data, status, headers, config) {
                  //SE TUTTO VA BENE
                  $mdDialog.hide();
                  console.log(data.idUser);
                  console.log(status);
                })
              .error(function (data, status, header, config) {
                console.log("error");
                $scope.errorName=errorNameList[1];
                $scope.errorFields=true;
              });
          }else{
            $scope.loading=false;
            if ($scope.user.password===undefined) {
              $scope.errorName=errorNameList[2];
            }else{
              $scope.errorName=errorNameList[0];
            }
            $scope.errorFields=true;
          }

          console.log($scope.user);
        };
        $scope.cancel = function() {
          console.log("hide");
          $mdDialog.cancel();
        };
    };

      angular.extend(self,{
        "dataLoading" : false,
        "error" : null,
        "username" : "",
        "password" : "",
        "user" : getUserDetails().name + " " + getUserDetails().surname,
        "login" : login,
        "logout" : logout,
        "getLoginStatus" : getLoginStatus,
        "showAdd": showAdd
  		});
		}]
	);
