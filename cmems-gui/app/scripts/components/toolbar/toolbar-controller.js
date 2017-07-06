'use strict';
angular.module('rheticus')
.controller('ToolbarCtrl',function($scope,$rootScope,$translate,$mdSidenav,$mdDialog,Flash) {

  $scope.global = $rootScope;

  $scope.changeLanguage = function (langKey) {
    if(langKey==="it"){
      Flash.create("success", "Lingua cambiata con successo.");
    }else if(langKey==="gr"){
      Flash.create("success", "Γλώσσα άλλαξε με επιτυχία.");
    }else if(langKey==="sq"){
      Flash.create("success", "Gjuha ndryshua me sukses.");
    }else{
      Flash.create("success", "Language changed successfully.");
    }
    $translate.use(langKey);

  };

  $scope.openSettingMenu = function() {
    $mdSidenav('settingMenu').toggle();
  };
  $scope.openFilterMenu = function() {
    $mdSidenav('filterMenu').toggle();
  };
  $scope.openAreaMenu = function() {
    $mdSidenav('areaMenu').toggle();
  };
  $scope.closeDialog = function() {
    $mdDialog.hide();
  };
  $scope.showLoading=false;
  /*if (($rootScope.login.details!==null) && $rootScope.login.details.info){
    document.getElementById('userNameView').innerHTML=($rootScope.login.details.info.username) ? $rootScope.login.details.info.username : "";
  }*/

  var alert;
  var processingAlert;
  $scope.showDialog = function ($event) {
    var parentEl = angular.element(document.querySelector('md-content'));
    alert = $mdDialog.alert({
      parent: parentEl,
      targetEvent: $event,
      clickOutsideToClose:true,
      templateUrl:"scripts/components/login/login-popup-template.html"
    });

    $mdDialog
      .show( alert )
      .finally(function() {
        alert = undefined;
      });
  };

  $scope.showProcessingDialog = function ($event) {
    var parentEl = angular.element(document.querySelector('md-content'));
    processingAlert = $mdDialog.alert({
      parent: parentEl,
      targetEvent: $event,
      clickOutsideToClose:true,
      templateUrl:"scripts/components/processing/processing-popup-template.html"
    });

    $mdDialog
      .show( processingAlert )
      .finally(function() {
        alert = undefined;
      });
  };

});

angular.module('rheticus').config(function($mdThemingProvider) {
  $mdThemingProvider.definePalette('amazingPaletteName', {
   '50': '003a57',
   '100': 'fbfbfb',
   '200': '003a57',
   '300': '003a57',
   '400': '003a57',
   '500': '003a57',
   '600': '003a57',
   '700': '003a57',
   '800': '003a57',
   '900': '003a57',
   'A100': '003a57',
   'A200': '003a57',
   'A400': '003a57',
   'A700': '003a57',
   'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                       // on this palette should be dark or light
   'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
    '200', '300', '400', 'A100'],
   'contrastLightColors': undefined    // could also specify this if default was 'dark'
 });
  $mdThemingProvider.theme('default')
    .primaryPalette('amazingPaletteName', {
      'default': '500',
      'hue-1': '50',
      'hue-2' : '500',
    });
});
