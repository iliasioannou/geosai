'use strict';

/**
 * @ngdoc function
 * @name rheticus.controller:TimeSliderCtrl
 * @description
 * # TimeSliderCtrl
 * Time Slider Controller for rheticus project
 */
angular.module('rheticus')
	.controller('TimeSliderCtrl', ['$rootScope', '$timeout', '$scope', 'configuration', '$translate', 'Flash', '$http', 'olData', function ($rootScope, $timeout, $scope, configuration, $translate, Flash, $http, olData) {
		var self = this; //this controller
		$scope.myDateMax = new Date();
		$scope.myDateMin = new Date();
		$scope.limitDate = "";
		$scope.limitDate1 = "";
		$scope.limitDate10 = "";
		$scope.limitDate30 = "";
		$scope.limitDate30P = "";
		$scope.currentDate = 0;
		$scope.layerFound = [];

		$scope.init = function () {
			$scope.statusSlider = false;
			//document.getElementById('playButton').src="images/icons/play.png";
			//document.getElementById('playButtonMin').src="images/icons/play.png";
			$scope.currentDate = 0;
			$scope.minDate = new Date("2001-01-01");
			$scope.maxDate = new Date("2019-01-01");
			$scope.getDateFromCapabilities("TEM");
			$scope.countMin = false;
			$scope.countMax = false;
		}

		//WATCH ALL OVERLAYS
		$scope.overlayForWatch = $scope.getOverlays();

		angular.extend(self, {
			//INSERT HERE YOUR FILTERS
			"overlays": $scope.getOverlays(),
			"tem": $scope.getOverlayParams("tem"),
			"dox": $scope.getOverlayParams("dox"),
			"sal": $scope.getOverlayParams("sal"),
			"swh": $scope.getOverlayParams("swh"),
			"cur": $scope.getOverlayParams("cur"),

			"maxSlider": 0,
			"minSlider": 0,
			"nameTimeSlider": "",
			"timeSlider": "dailySlider",
			"currentDateFormat": "",
			"currentTimeSlider": "",
			"currentTimeSliderBox": "",
			"currentType": "tem",
			"currentTypeName": "",
			"showCalendar": false,
			"showCalendarView": function () {
				self.showCalendar = !self.showCalendar;
			}
		});

		//UPDATE CURRENTVIEW TRANSLATIONS WHEN CLICK NEW LANGUAGE
		$rootScope.$on('$translateChangeSuccess', function () {
			$rootScope.$broadcast("setOverlaysClosure");
			$translate(self.timeSlider).then(function (translation) {
				self.nameTimeSlider = translation;
			});
			$translate(self.currentType).then(function (translation) {
				self.currentTypeName = translation;
			});
			if (self.timeSlider.indexOf("month") > -1) {
				$translate(d3.time.format("%B")($scope.arrayDataTimeCurrent[$scope.currentDate])).then(function (translation) {
					self.currentTimeSliderBox = translation + d3.time.format("-%Y")($scope.arrayDataTimeCurrent[$scope.currentDate]);
				});
			}

		});

		//INITIALIZE CURRENTVIEW
		$translate('dailySlider').then(function (translation) {
			self.nameTimeSlider = translation;
		});
		$translate('tem').then(function (translation) {
			self.currentTypeName = translation;
		});


		//TODO: da testare
		//update values on login change status
		$rootScope.$watch("login.logged", function (oldValue, newValue) {
			if(oldValue != newValue){

				var visibleOverlay = $scope.overlayForWatch.filter(function(overlay){
					return overlay.visible;
				})[0];
				
				$scope.getDateFromCapabilities(visibleOverlay.name);
			}
		});

		//WATCH DOX
		$scope.$watch("overlayForWatch[0].visible", function (value) {
			if (value && $scope.layerFound.length > 0) {
				//SET MENU PERIOD
				var i = 0;
				var trovato = false;
				while (i < $scope.layerFound.length && !trovato) {
					if ($scope.layerFound[i].Name.indexOf("DOX") !== -1) {
						trovato = true;
						$scope.limitDate = d3.time.format("%d/%m/%Y")(getForecastDay($scope.layerFound[i].Dimension[$scope.layerFound[i].Dimension.length - 1]));
					}
					i++;
				}
				self.currentType = 'dox',
					$translate('dox').then(function (translation) {
						self.currentTypeName = translation;
					});
				//UPDATE ALL LAST DATE MENU
				$scope.updateMenuDate("DOX");
				//RESTART WITH CURRENT TYPE
				$scope.restart(self.timeSlider);
			}

		});
		//WATCH SAL
		$scope.$watch("overlayForWatch[1].visible", function (value) {
			if (value && $scope.layerFound.length > 0) {
				//SET MENU PERIOD
				var i = 0;
				var trovato = false;
				while (i < $scope.layerFound.length && !trovato) {
					if ($scope.layerFound[i].Name.indexOf("SAL") !== -1) {
						trovato = true;
						$scope.limitDate = d3.time.format("%d/%m/%Y")(getForecastDay($scope.layerFound[i].Dimension[$scope.layerFound[i].Dimension.length - 1]));
					}
					i++;
				}
				self.currentType = 'sal',
					$translate('sal').then(function (translation) {
						self.currentTypeName = translation;
					});
				//UPDATE ALL LAST DATE MENU
				$scope.updateMenuDate("SAL");
				//RESTART WITH CURRENT TYPE
				$scope.restart(self.timeSlider);
			}

		});
		//WATCH TEM
		$scope.$watch("overlayForWatch[2].visible", function (value) {
			if (value && $scope.layerFound.length > 0) {
				//SET MENU PERIOD
				var i = 0;
				var trovato = false;
				while (i < $scope.layerFound.length && !trovato) {
					if ($scope.layerFound[i].Name.indexOf("TEM") !== -1) {
						trovato = true;
						$scope.limitDate = d3.time.format("%d/%m/%Y")(getForecastDay($scope.layerFound[i].Dimension[$scope.layerFound[i].Dimension.length - 1]));
					}
					i++;
				}
				self.currentType = 'tem',
					$translate('tem').then(function (translation) {
						self.currentTypeName = translation;
					});
				//UPDATE ALL LAST DATE MENU
				$scope.updateMenuDate("TEM");
				//RESTART WITH CURRENT TYPE
				$scope.restart(self.timeSlider);
			}

		});
		//WATCH SWH
		$scope.$watch("overlayForWatch[3].visible", function (value) {
			if (value && $scope.layerFound.length > 0) {
				//SET MENU PERIOD
				var i = 0;
				var trovato = false;
				while (i < $scope.layerFound.length && !trovato) {
					if ($scope.layerFound[i].Name.indexOf("SWH") !== -1) {
						trovato = true;
						$scope.limitDate = d3.time.format("%d/%m/%Y")(getForecastDay($scope.layerFound[i].Dimension[$scope.layerFound[i].Dimension.length - 1]));
					}
					i++;
				}
				self.currentType = 'swh',
					$translate('swh').then(function (translation) {
						self.currentTypeName = translation;
					});
				//UPDATE ALL LAST DATE MENU
				$scope.updateMenuDate("SWH");
				//RESTART WITH CURRENT TYPE
				$scope.restart(self.timeSlider);
			}

		});
		//WATCH CUR
		$scope.$watch("overlayForWatch[4].visible", function (value) {
			if (value && $scope.layerFound.length > 0) {
				//SET MENU PERIOD
				var i = 0;
				var trovato = false;
				while (i < $scope.layerFound.length && !trovato) {
					if ($scope.layerFound[i].Name.indexOf("CUR") !== -1) {
						trovato = true;
						$scope.limitDate = d3.time.format("%d/%m/%Y")(getForecastDay($scope.layerFound[i].Dimension[$scope.layerFound[i].Dimension.length - 1]));
					}
					i++;
				}
				self.currentType = 'cur',
					$translate('cur').then(function (translation) {
						self.currentTypeName = translation;
					});
				//UPDATE ALL LAST DATE MENU
				$scope.updateMenuDate("CUR");
				//RESTART WITH CURRENT TYPE
				$scope.restart(self.timeSlider);
			}

		});


		//WATCH CURRENTDATE (MODEL SLIDER) AND UPDATE INTERFACE
		$scope.$watch("currentDate", function (nameLayer) {
			if ($scope.arrayDataTimeCurrent) {
				$scope.setSlider();
			}

		});
		//UPDATE MENU DATE WHEN CHANGING LAYER
		$scope.updateMenuDate = function (nameLayer) {
			var find = false;
			var i = 0;
			while (i < $scope.layerFound.length && !find) {
				var time = d3.time.format("%d/%m/%Y")($scope.layerFound[i].Dimension[$scope.layerFound[i].Dimension.length - 1]);
				if ($scope.layerFound[i].Name === nameLayer) {
					$scope.limitDate1 = time;
				} else if ($scope.layerFound[i].Name.indexOf(nameLayer + "10") > -1) {
					$scope.limitDate10 = time;
				}
				else if ($scope.layerFound[i].Name.indexOf(nameLayer + "30") > -1 && $scope.layerFound[i].Name.indexOf("P") === -1) {
					$scope.limitDate30 = time;
				}
				else if ($scope.layerFound[i].Name.indexOf(nameLayer + "30P") > -1) {
					$scope.limitDate30P = time;
					find = true;
				}
				i++;
			}
		}


		//CALL GET CAPABILITIES AND WITH JQUERY EXTRACT AN ARRAY WITH ALL LAYER NAME AND DIMENSIONS
		$scope.getDateFromCapabilities = function (nameLayer) {
			console.log($rootScope.login.logged);
			var value;
			for (var i = 0; i < self.overlays.length; i++) {
				if (self.overlays[i].visible) {
					value = i;
				}
			}
			if (value !== undefined) {
				$http.get(self.overlays[value].source.urls[0] + "?service=wms&request=GetCapabilities")
					.then(function (result) {
						var xmlDoc = $.parseXML(result.data);
						var xml = $(xmlDoc);
						var arrayLayers = xml.find("Layer");
						$scope.layerFound = [];
						for (var i = 0; i < arrayLayers.length; i++) {
							var completeLayer = [];
							for (var j = 0; j < arrayLayers[i].childNodes.length; j++) {
								if (arrayLayers[i].childNodes[j].nodeName === "Name") {
									completeLayer.push(arrayLayers[i].childNodes[j].textContent);
								}
								if (arrayLayers[i].childNodes[j].nodeName === "Dimension") {
									completeLayer.push(arrayLayers[i].childNodes[j].childNodes[0].data);
								}
							}
							if (completeLayer.length === 2) {
								var values = completeLayer[1].split(',');
								var arrayDate = [];
								for (var k = 0; k < values.length; k++) {
									arrayDate.push(new Date(values[k]));
								}

								//remove dates after N days before today if the user is not logged 
								if(!$rootScope.login.logged){
									var maxDayBeforeTodayHistory = $rootScope.configurationCurrentHost.generalSettings.maxDayBeforeTodayHistory;
									var maxReferenceDate = moment().startOf('day').subtract(5, 'days');
									arrayDate = arrayDate.filter(function(d){
										return moment(d).startOf('day').isSameOrBefore(maxReferenceDate);
									});
								}

								$scope.layerFound.push({
									"Name": completeLayer[0],
									"Dimension": arrayDate,
								});
							}
						}
						//console.log($scope.layerFound);
						var find = false;
						i = 0;
						while (i < $scope.layerFound.length && !find) {
							var time = d3.time.format("%d/%m/%Y")($scope.layerFound[i].Dimension[$scope.layerFound[i].Dimension.length - 1]);
							if ($scope.layerFound[i].Name === nameLayer) {
								//console.log("Found"+$scope.layerFound[i].Name);
								//RESET ALL
								$scope.limitDate = d3.time.format("%d/%m/%Y")(getForecastDay($scope.layerFound[i].Dimension[$scope.layerFound[i].Dimension.length - 1]));
								//console.log($scope.limitDate);
								//$scope.currentDate = 0;
								document.getElementById('playButton').src = "images/icons/play.png";
								document.getElementById('playButtonMin').src = "images/icons/play.png";
								$scope.arrayDataTime = $scope.layerFound[i].Dimension;
								$scope.filterWMSDate();
								$scope.arrayDataTimeCurrent = $scope.arrayDataTime;
								$scope.datepickerOptions.minDate = $scope.arrayDataTimeCurrent[0];
								$scope.datepickerOptions.maxDate = $scope.arrayDataTimeCurrent[$scope.arrayDataTimeCurrent.length - 1];
								$scope.setSlider();
								$scope.limitDate1 = time;

							} else if ($scope.layerFound[i].Name.indexOf(nameLayer + "10") > -1) {
								$scope.limitDate10 = time;
							}
							else if ($scope.layerFound[i].Name.indexOf(nameLayer + "30") > -1 && $scope.layerFound[i].Name.indexOf("P") === -1) {
								$scope.limitDate30 = time;
							}
							else if ($scope.layerFound[i].Name.indexOf(nameLayer + "30P") > -1) {
								$scope.limitDate30P = time;
								find = true;
							}
							i++;
						}

						console.log('currentDate: ' + $scope.currentDate);
						$scope.setCurrentDate();
						console.log('currentDate: ' + $scope.currentDate);

					}, function (error) {
						console.log("Error in getting CAPABILITIES");
					});
			}

		};

		$scope.setCurrentDate = function(){
			var dates = $scope.arrayDataTime;
			var today = moment().startOf('day').format();
			var newCurrentDate = 0;

			for(var i = 0; i < dates.length; i++){
				var date = moment(dates[i]).startOf('day').format();

				if(date <= today){
					newCurrentDate = i;
					
				} else {
					break;
				}
			}

			//TIMEOUT NEEDED BECAUSE SYNC CHANGE OF currentDate AND MAXSLIDER GENERATE ERROR
			$timeout(function () {
				$scope.currentDate = newCurrentDate;
			}, 0);

		};

		// gets last updated forecast day given the last date available in forecasts
		var getForecastDay = function(lastForecastDate){
			return moment(lastForecastDate).startOf('day').subtract(3, 'days').toDate(); //TODO: parameterize numer of days ??
		};

		//FILTER LAYER DIMENSION BY USER CONTRACT
		$scope.filterWMSDate = function () {
			var correctDate = [];
			for (var i = 0; i < $scope.arrayDataTime.length; i++) {
				if ($scope.arrayDataTime[i] < ($scope.maxDate) && $scope.arrayDataTime[i] > ($scope.minDate)) {
					correctDate.push($scope.arrayDataTime[i]);
				}
			}
			$scope.arrayDataTime = correctDate;
			if (correctDate.length !== 0) {
				self.maxSlider = $scope.arrayDataTime.length - 1;
				self.currentTimeSlider = d3.time.format("%d/%m/%Y")($scope.arrayDataTime[0]);
			} else {
				self.maxSlider = 0;
				self.currentTimeSlider = "";
			}
		};


		// CALL ITSELF EVERY 3 SEC AND CHANGE WMS TIME++
		$scope.statusSlider = false;
		$scope.loopSlider = function () {
			if ($scope.statusSlider) {
				//console.log("startLoop");
				if ($scope.currentDate < $scope.arrayDataTimeCurrent.length - 1) {
					$scope.currentDate++;
					$scope.setSlider();
					$timeout($scope.loopSlider, 3000);
				}
			}
		}


		//START SLIDER PLAY AND CHANGE INTERFACE
		$scope.playSlider = function () {
			if (document.getElementById('playButton').src.indexOf("play.png") > -1 && document.getElementById('playButtonMin').src.indexOf("play.png") > -1) {
				document.getElementById('playButton').src = "images/icons/pause.png";
				document.getElementById('playButtonMin').src = "images/icons/pause.png";
				$scope.statusSlider = true;
				$timeout($scope.loopSlider, 500);
			} else if (document.getElementById('playButton').src.indexOf("pause.png") > -1 && document.getElementById('playButtonMin').src.indexOf("pause.png") > -1) {
				$scope.statusSlider = false;
				$timeout($scope.loopSlider, 500);
				document.getElementById('playButton').src = "images/icons/play.png";
				document.getElementById('playButtonMin').src = "images/icons/play.png";
			} else {
				$scope.currentDate = 0;
				if ($scope.arrayDataTimeCurrent[$scope.currentDate] !== undefined) {
					self.currentTimeSlider = d3.time.format("%d/%m/%Y")($scope.arrayDataTimeCurrent[$scope.currentDate]);
					if (self.timeSlider === "tenDaysSlider") {
						var previousDate = new Date($scope.arrayDataTimeCurrent[$scope.currentDate].getTime());
						previousDate.setDate(previousDate.getDate() - 10);
						var fromDate = d3.time.format("%d/%m/%Y")(previousDate);
						self.currentTimeSliderBox = fromDate + "-" + self.currentTimeSlider;
					} else if (self.timeSlider.indexOf("month") > -1) {
						$translate(d3.time.format("%B")($scope.arrayDataTimeCurrent[$scope.currentDate])).then(function (translation) {
							self.currentTimeSliderBox = translation + d3.time.format("-%Y")($scope.arrayDataTimeCurrent[$scope.currentDate]);
						});
					} else {
						self.currentTimeSliderBox = self.currentTimeSlider;
					}
				} else {
					self.currentTimeSlider = "";
				}
				$scope.statusSlider = false;
				$timeout($scope.loopSlider, 500);
				if ($scope.arrayDataTimeCurrent.length > 1) {
					document.getElementById('playButton').src = "images/icons/play.png";
					document.getElementById('playButtonMin').src = "images/icons/play.png";
				}

			}
		};


		//CHANGE WMS TIME --
		$scope.rewindSlider = function () {
			if ($scope.currentDate > 0) {
				$scope.currentDate--;
			}
			$scope.setSlider();
		};


		//CHANGE WMS TIME ++
		$scope.forwardSlider = function () {
			if ($scope.currentDate < $scope.arrayDataTime.length - 1) {
				$scope.currentDate++;
			}
			$scope.setSlider();
		};


		//UPDATE INTERFACE WITH THE CURRENT DATE AND UPDATE TIME PARAMS IN ALL OVERLAYS
		$scope.setSlider = function () {
			if ($scope.arrayDataTimeCurrent[$scope.currentDate] instanceof Date) {
				$rootScope.$broadcast("setOverlaysClosure");

				self.tem.source.params.TIME = d3.time.format("%Y-%m-%d")($scope.arrayDataTimeCurrent[$scope.currentDate]);
				self.dox.source.params.TIME = d3.time.format("%Y-%m-%d")($scope.arrayDataTimeCurrent[$scope.currentDate]);
				self.sal.source.params.TIME = d3.time.format("%Y-%m-%d")($scope.arrayDataTimeCurrent[$scope.currentDate]);
				self.swh.source.params.TIME = d3.time.format("%Y-%m-%d")($scope.arrayDataTimeCurrent[$scope.currentDate]);
				self.cur.source.params.TIME = d3.time.format("%Y-%m-%d")($scope.arrayDataTimeCurrent[$scope.currentDate]);

				if ($scope.arrayDataTimeCurrent[$scope.currentDate] !== undefined) {

					self.currentTimeSlider = d3.time.format("%d/%m/%Y")($scope.arrayDataTimeCurrent[$scope.currentDate]);

					if (self.timeSlider === "tenDaysSlider") {
						var previousDate = new Date($scope.arrayDataTimeCurrent[$scope.currentDate].getTime());
						previousDate.setDate(previousDate.getDate() - 10);
						var fromDate = d3.time.format("%d/%m/%Y")(previousDate);
						self.currentTimeSliderBox = fromDate + "-" + self.currentTimeSlider;
					} else if (self.timeSlider.indexOf("month") > -1) {
						$translate(d3.time.format("%B")($scope.arrayDataTimeCurrent[$scope.currentDate])).then(function (translation) {
							self.currentTimeSliderBox = translation + d3.time.format("-%Y")($scope.arrayDataTimeCurrent[$scope.currentDate]);
						});

					} else {
						self.currentTimeSliderBox = self.currentTimeSlider;
					}
					if (document.getElementById('playButton').src.indexOf("images/icons/stop.png") > -1 && document.getElementById('playButtonMin').src.indexOf("images/icons/stop.png") > -1) {
						document.getElementById('playButton').src = "images/icons/play.png";
						document.getElementById('playButtonMin').src = "images/icons/play.png";
					}
					if ($scope.currentDate === $scope.arrayDataTimeCurrent.length - 1) {
						document.getElementById('playButton').src = "images/icons/stop.png";
						document.getElementById('playButtonMin').src = "images/icons/stop.png";
					}
				} else {
					self.currentTimeSlider = "";
				}
			}

		};

		//THIS FUNCTIONS ARE CALLED BY TIME TYPE CHANGE.
		$scope.dailySlider = function () {
			$scope.datepickerOptions.minMode = "day";
			self.timeSlider = "dailySlider";
			$translate('dailySlider').then(function (translation) {
				self.nameTimeSlider = translation;
			});

			$scope.restart("dailySlider");
			document.getElementById('listTypeButton').src = "images/icons/1.png"
			document.getElementById('listTypeButtonMin').src = "images/icons/1.png"
		};

		$scope.tenDaysSlider = function () {
			$scope.datepickerOptions.minMode = "day";
			self.timeSlider = "tenDaysSlider";
			$translate('tenDaysSlider').then(function (translation) {
				self.nameTimeSlider = translation;
			});
			$scope.restart("tenDaysSlider");
			document.getElementById('listTypeButton').src = "images/icons/10.png"
			document.getElementById('listTypeButtonMin').src = "images/icons/10.png"
		};

		$scope.monthSlider = function () {
			$scope.datepickerOptions.minMode = "month";
			self.timeSlider = "monthSlider";
			$translate('monthSlider').then(function (translation) {
				self.nameTimeSlider = translation;
			});
			$scope.restart("monthSlider");
			document.getElementById('listTypeButton').src = "images/icons/30.png"
			document.getElementById('listTypeButtonMin').src = "images/icons/30.png"
		};

		$scope.month90Slider = function () {
			$scope.datepickerOptions.minMode = "month";
			self.timeSlider = "month90Slider";
			$translate('month90Slider').then(function (translation) {
				self.nameTimeSlider = translation;
			});
			$scope.restart("month90Slider");
			document.getElementById('listTypeButton').src = "images/icons/30p.png"
			document.getElementById('listTypeButtonMin').src = "images/icons/30p.png"
		};

		//CREATE ARRAY WITH NAME LAYERS AND CORRISPECTIVE TIME DIMENSION
		$scope.getDimensionAfterCapabilities = function () {
			var currentOverlay = $scope.getCurrentCategory();
			//console.log(currentOverlay);
			var i = 0;
			var trovato = false;
			while (i < $scope.layerFound.length && !trovato) {
				if ($scope.layerFound[i].Name.indexOf(currentOverlay.source.params.LAYERS) != -1) {
					trovato = true;
				}
				i++;
			}

			if (trovato) {
				//console.log($scope.layerFound[i-1].Dimension);
				return $scope.layerFound[i - 1].Dimension;
			} else {
				return [];
			}
		};

		//GET THE VISIBLE OVERLAY
		$scope.getCurrentCategory = function () {
			var overlays = $scope.getOverlays();
			var i = 0;
			var trovato = false;
			while (i < overlays.length && !trovato) {
				if (overlays[i].visible) {
					trovato = true;
				}
				i++;
			}
			if (trovato) {
				return overlays[i - 1];
			} else {
				return null;
			}
		};

		//RESTART THE CURRENT LAYER WITH NEW TIME TYPE.
		$scope.restart = function (type) {
			//console.log("restart");
			//console.log($scope.datepickerOptions);
			//RESET ALL
			//$scope.setOverlaysToType(type);
			//CALCULATE NEW LAYER DIMENSION AND SET MAXSLIDER
			var dimension = $scope.getDimensionAfterCapabilities();
			if (dimension) {

				//SET MAX SLIDER LENGTH
				self.maxSlider = dimension.length - 1;
				//SET SLIDER INDEX NEAR THE CURRENT DATE
				var i = 0;
				var found = false;
				while (i < dimension.length && !found) {
					if (dimension[i] >= $scope.arrayDataTimeCurrent[$scope.currentDate]) {
						found = true;
					}
					i++;
				}
				//FILTER DATE BY USER CONTRACT AND RESET INTERFACE
				document.getElementById('playButton').src = "images/icons/play.png";
				document.getElementById('playButtonMin').src = "images/icons/play.png";
				$scope.arrayDataTime = dimension;
				$scope.filterWMSDate();
				$scope.arrayDataTimeCurrent = $scope.arrayDataTime;
				//UPDATE DATEPICKER MIN MAX DATE
				$scope.datepickerOptions.minDate = $scope.arrayDataTimeCurrent[0];
				$scope.datepickerOptions.maxDate = $scope.arrayDataTimeCurrent[$scope.arrayDataTimeCurrent.length - 1];
				//TIMEOUT NEEDED BECAUSE SYNC CHANGE OF currentDate AND MAXSLIDER GENERATE ERROR
				$timeout(function () {
					$scope.currentDate = parseInt(i - 1);
					$scope.setSlider();
				}, 0);
			} else {
				console.log("Layer not found");
			}

		};


		//SET ALL LAYERS TO THE INPUT TYPE USING MAPPING IN COMMON.JS
		$scope.setOverlaysToType = function (type) {
			//console.log("setOverlaysToType with type:"+type);
			var overlays = $scope.getOverlays();
			for (var i = 0; i < overlays.length; i++) {
				eval("overlays[i].source.params.LAYERS=configuration." + overlays[i].name + "." + type); // jshint ignore:line
			}
		};


		$scope.changeWithNoRefreshMap = function () {
			olData.getMap().then(function (map) {
				var layers = map.getLayers();
				layers.forEach(function (layer) {
					if (layer.get('name') === 'Overlays') {
						//console.log((layer.getLayers().getArray())[2].get('name'));
						for (var i = 0; i < (layer.getLayers().getArray()).length; i++) {
							if ((layer.getLayers().getArray())[i].get('name') === 'TEM' || (layer.getLayers().getArray())[i].get('name') === 'DOX' || (layer.getLayers().getArray())[i].get('name') === 'SAL' || (layer.getLayers().getArray())[i].get('name') === 'SWH' || (layer.getLayers().getArray())[i].get('name') === 'CUR') {
								var source = (layer.getLayers().getArray())[i].getSource();
								var params = source.getParams();
								console.log(source.getParams());
								params.TIME = d3.time.format("%Y-%m-%d")($scope.arrayDataTimeCurrent[$scope.currentDate]);
								source.updateParams(params);
								console.log(source.getParams());
							}
						}
					}
				});
			});
		};

		//DATEPICKER SETTINGS
		$scope.datePicker = null;
		$scope.datepickerOptions = {
			"customClass": getDayClass,
			"dateDisabled": disableDayClass,
			"showWeeks": false,
			"minMode": "day",
			"minDate": new Date(),
			"maxDate": new Date()
		};


		var getDayClassIndex = 0;
		function getDayClass(data) {
			var date = data.date;
			var mode = data.mode;
			var tempTimeConverted;
			var firstDecadic;
			var secondDecadic;
			var thirdDecadic;
			var fourthDecadic;
			var fifthDecadic;

			var classe = "";

			var dayToCheck = d3.time.format("%Y-%m-%d")(date);


			if (mode === "day" && self.timeSlider === "dailySlider") {

				if ($scope.arrayDataTimeCurrent) {
					var found = false;
					var i = 0;
					/*console.log("********************************************************************************");
					console.log("dayToCheck: "+dayToCheck);*/
					while (i < $scope.arrayDataTimeCurrent.length && !found) {
						tempTimeConverted = d3.time.format("%Y-%m-%d")($scope.arrayDataTimeCurrent[i]);
						//console.log("tempTimeConverted: "+tempTimeConverted);
						if (dayToCheck === tempTimeConverted) {
							found = true;
						}
						i++;
					}
					if (found) {
						classe = "foundedProductPickerFound";
					}
				}
			} else if (mode === "day" && self.timeSlider === "tenDaysSlider") {
				if ($scope.arrayDataTimeCurrent) {
					var found = false;
					var i = 0;
					while (i < $scope.arrayDataTimeCurrent.length && !found) {
						tempTimeConverted = d3.time.format("%Y-%m-%d")($scope.arrayDataTimeCurrent[i]);
						if (dayToCheck === tempTimeConverted) {
							found = true;
						}
						i++;
					}
					$scope.arrayDataTimeCurrent[i];
					if (found) {
						classe = "foundedProductPickerFound";
					} else {
						var firstDecadicDate = new Date(date); //VALUE ARE 20 PREVIOUS MONTH
						firstDecadicDate.setDate(20);
						firstDecadic = d3.time.format("%Y-%m-%d")(firstDecadicDate);

						var secondDecadicDate = new Date(date); //VALUE ARE 31-30-29-28 (MONTH DAY END) PREVIOUS MONTH AND AFTER BECOME 1
						if (secondDecadicDate.getDate() > 20) {
							secondDecadicDate.setMonth(secondDecadicDate.getMonth() + 1)
							secondDecadicDate.setDate(1);
							secondDecadicDate.setDate(secondDecadicDate.getDate() - 1);
						} else {
							secondDecadicDate.setDate(1);
							secondDecadicDate.setHours(2, 0, 0, 0);
						}
						secondDecadic = d3.time.format("%Y-%m-%d")(secondDecadicDate);
						var thirdDecadicDate = new Date(date); //VALUE ARE 10 CURRENT MONTH
						thirdDecadicDate.setDate(10);
						thirdDecadic = d3.time.format("%Y-%m-%d")(thirdDecadicDate);
						var fourthDecadicDate = new Date(date);
						fourthDecadicDate.setDate(20);			//VALUE ARE 20 CURRENT MONTH
						fourthDecadic = d3.time.format("%Y-%m-%d")(fourthDecadicDate);
						var fifthDecadicDate = new Date(date);
						fifthDecadicDate.setMonth(fifthDecadicDate.getMonth() + 1) //VALUE ARE 31-30-29-28 (MONTH DAY END) CURRENT MONTH
						fifthDecadicDate.setDate(1);
						fifthDecadicDate.setDate(fifthDecadicDate.getDate() - 1);
						fifthDecadic = d3.time.format("%Y-%m-%d")(fifthDecadicDate);

						//console.log("dayToCheck: ",dayToCheck);
						//console.log(secondDecadic);
						//console.log(thirdDecadic);

						if (Date.parse(dayToCheck) > Date.parse(firstDecadic) && Date.parse(dayToCheck) < Date.parse(secondDecadic)) {
							//console.log("firstDecadic");
							//console.log(firstDecadic);
							//console.log(secondDecadic);
							var found = false;
							var k = 0;
							while (k < $scope.arrayDataTimeCurrent.length && !found) {
								tempTimeConverted = d3.time.format("%Y-%m-%d")($scope.arrayDataTimeCurrent[k]);
								if (secondDecadic === tempTimeConverted) {
									found = true;
								}
								k++;
							}
							if (found)
								classe = "TenProductPickerNotFound1";
						} else if (Date.parse(dayToCheck) >= Date.parse(secondDecadic) && Date.parse(dayToCheck) < Date.parse(thirdDecadic)) {
							//console.log("secondDecadic");
							//console.log(secondDecadic);
							//console.log(thirdDecadic);
							var found = false;
							var k = 0;
							while (k < $scope.arrayDataTimeCurrent.length && !found) {
								tempTimeConverted = d3.time.format("%Y-%m-%d")($scope.arrayDataTimeCurrent[k]);
								if (thirdDecadic === tempTimeConverted) {
									found = true;
								}
								k++;
							}
							if (found)
								classe = "TenProductPickerNotFound2";
						} else if (Date.parse(dayToCheck) > Date.parse(thirdDecadic) && Date.parse(dayToCheck) < Date.parse(fourthDecadic)) {
							var found = false;
							var k = 0;
							while (k < $scope.arrayDataTimeCurrent.length && !found) {
								tempTimeConverted = d3.time.format("%Y-%m-%d")($scope.arrayDataTimeCurrent[k]);
								if (fourthDecadic === tempTimeConverted) {
									found = true;
								}
								k++;
							}
							if (found)
								classe = "TenProductPickerNotFound3";
						} else if (Date.parse(dayToCheck) > Date.parse(fourthDecadic) && Date.parse(dayToCheck) < Date.parse(fifthDecadic)) {
							var found = false;
							var k = 0;
							while (k < $scope.arrayDataTimeCurrent.length && !found) {
								tempTimeConverted = d3.time.format("%Y-%m-%d")($scope.arrayDataTimeCurrent[k]);
								if (fifthDecadic === tempTimeConverted) {
									found = true;
								}
								k++;
							}
							if (found)
								classe = "TenProductPickerNotFound1";
						}

					}
				}
			}

			return classe;
		}

		function disableDayClass(data) {
			var date = data.date;
			var mode = data.mode;
			var tempTimeConverted;
			var dayToCheck = d3.time.format("%Y-%m-%d")(date);

			var disabled = true;
			if (mode === "day") {
				if ($scope.arrayDataTimeCurrent) {
					var i = 0;
					while (i < $scope.arrayDataTimeCurrent.length && disabled) {
						tempTimeConverted = d3.time.format("%Y-%m-%d")($scope.arrayDataTimeCurrent[i]);
						if (dayToCheck === tempTimeConverted) {
							disabled = false;
						}
						i++;
					}
				}
			} else {
				disabled = false;
			}

			return disabled;
		}

		$scope.$watch("datePicker", function (value) {
			if (value) {
				var i = 0;
				var found = false;
				while (i < $scope.arrayDataTimeCurrent.length && !found) {
					if (value <= $scope.arrayDataTimeCurrent[i]) {
						found = true;
						$scope.currentDate = i;
					}
					i++;
				}
				if (!found) {
					$translate("noData").then(function (translation) {
						Flash.create("warning", translation);
					});
				}
			}


		});


		//$scope.init();


	}]);
