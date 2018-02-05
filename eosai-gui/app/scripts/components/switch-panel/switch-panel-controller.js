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

    var gr_extent = [21.28,38.32];
    $scope.setMapViewExtent(
      "Polygon",
      gr_extent,
      8
    );

		/**
		 * EXPORT AS PUBLIC CONTROLLER
		 */
		angular.extend(self,{
			"overlays" : $scope.getOverlays(),
			"tem": $scope.getOverlayParams("tem"),
			"dox": $scope.getOverlayParams("dox"),
			"sal": $scope.getOverlayParams("sal"),
			"swh": $scope.getOverlayParams("swh"),
			"cur": $scope.getOverlayParams("cur"),
			"userDeals" : $scope.getUserDeals(),
		});
		angular.extend(self,{
			"switchOverlay" : switchOverlay,
			"showSettings":showSettings,
			//tem
			"view_overlay_tem" : self.tem.visible, // overlay visibility
			"settingstem":false,
			//dox
			"view_overlay_dox" : self.dox.visible, // overlay visibility
			"settingsdox":false,
			//sal
			"view_overlay_sal" : self.sal.visible,   // overlay visibility
			"settingssal":false,
			//swh
			"view_overlay_swh" : self.swh.visible,   // overlay visibility
			"settingsswh":false,
			//swh
			"view_overlay_cur" : self.cur.visible,   // overlay visibility
			"settingscur":false
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
			self.view_overlay_tem = false;
			self.view_overlay_dox = false;
			self.view_overlay_sal = false;
			self.view_overlay_swh = false;
			self.view_overlay_cur = false;
			self.tem.visible = false;
			self.dox.visible = false;
			self.sal.visible = false;
			self.swh.visible = false;
			self.cur.visible = false;
			eval("self.view_overlay_"+overlay+" = !self.view_overlay_"+overlay+";"); // jshint ignore:line
			eval("self."+overlay+".visible = self.view_overlay_"+overlay+";"); // jshint ignore:line
			document.getElementById('imageLegend').src=eval("self."+overlay+".source.legend;"); // jshint ignore:line
		};
		var viewPanel = function(panel){
			self.show_panel_tem = false;
			self.show_panel_dox = false;
			self.show_panel_sal = false;
			self.show_panel_swh = false;
			self.show_panel_cur = false;
			eval("self.show_panel_"+panel+" = true;"); // jshint ignore:line
		};
	}]);
