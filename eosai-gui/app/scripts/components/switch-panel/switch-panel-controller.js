'use strict';

/**
 * @ngdoc function
 * @name rheticus.controller:SwitchPanelCtrl
 * @description
 * # SwitchPanelCtrl
 * Switch Panel Controller for rheticus project
 */
angular.module('rheticus')
	.controller('SwitchPanelCtrl',['$scope','$rootScope','$mdSidenav',function ($scope,$rootScope,$mdSidenav){

		var self = this; //this controller

		/**
		 * PUBLIC VARIABLES AND METHODS
		 */
		var showSettings = function(overlay){
			eval("self.settings"+overlay+" = !self.settings"+overlay+";"); // jshint ignore:line
		};
		var switchOverlay = function(overlay){
			toggleOverlay(overlay);
		};

    var gr_extent = [18,37];
    $scope.setMapViewExtent(
      "Polygon",
      gr_extent,
      7
    );

		/**
		 * EXPORT AS PUBLIC CONTROLLER
		 */
		angular.extend(self,{
			"overlays" : $scope.getOverlays(),
			"chl" : $scope.getOverlayParams("chl"),
			"sst" : $scope.getOverlayParams("sst"),
			"wt" : $scope.getOverlayParams("wt"),
			"tur" : $scope.getOverlayParams("tur"),
			"userDeals" : $scope.getUserDeals(),
		});
		angular.extend(self,{
			"switchOverlay" : switchOverlay,
			"showSettings":showSettings,
			//chl
			"view_overlay_chl" : self.chl.visible, // overlay visibility
			"settingschl":false,
			//sst
			"view_overlay_sst" : self.sst.visible, // overlay visibility
			"settingssst":false,
			//wt
			"view_overlay_wt" : self.wt.visible,   // overlay visibility
			"settingswt":false,
			//tur
			"view_overlay_tur" : self.tur.visible,   // overlay visibility
			"settingstur":false
		});

		//update values on login change status
		$rootScope.$watch("login.details", function () {
			//console.log("updateSwitchPanel");
			self.userDeals=$scope.getUserDeals();
		});

		/**
		 * PRIVATE VARIABLES AND METHODS
		 */
		var toggleOverlay = function(overlay){
			//disable other overlays and set control to the current
			self.view_overlay_chl = false;
			self.view_overlay_sst = false;
			self.view_overlay_wt = false;
			self.view_overlay_tur = false;
			self.chl.visible = false;
			self.sst.visible = false;
			self.wt.visible = false;
			self.tur.visible = false;
			eval("self.view_overlay_"+overlay+" = !self.view_overlay_"+overlay+";"); // jshint ignore:line
			eval("self."+overlay+".visible = self.view_overlay_"+overlay+";"); // jshint ignore:line
			document.getElementById('imageLegend').src=eval("self."+overlay+".source.legend;"); // jshint ignore:line
		};
		var viewPanel = function(panel){
			self.show_panel_sst = false;
			self.show_panel_wt = false;
			self.show_panel_chl = false;
			self.show_panel_tur = false;
			eval("self.show_panel_"+panel+" = true;"); // jshint ignore:line
		};
	}]);
