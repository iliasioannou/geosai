'use strict';

/**
 * @ngdoc function
 * @name rheticus.controller:ProcessingPopoupCtrl
 * @description
 * # ProcessingPopoupCtrl
 * Processing Popup Controller for rheticus project
 */
angular.module('rheticus')
 	.controller('ProcessingPopupCtrl',['$rootScope','$scope','$mdDialog','$http', 'ProcessingService',
    function($rootScope,$scope,$mdDialog,$http, ProcessingService){

      var self = this; //this controller
      self.showLoading = false;

      self.processingParams = {
        aoi: null,
        product: null,
        startDate: null,
        monthInterval: null
      }

      var calculateDates = function(){
        var startDate = moment(self.processingParams.startDate).format('YYYY-MM-DD');
        var endDate = moment(self.processingParams.startDate).add(+self.processingParams.monthInterval, 'month').format('YYYY-MM-DD');
        return [startDate, endDate];
      }

      var addProcessing = function(){
        self.showLoading = true;

        var dates = calculateDates();

        var params = {
          dates: dates,
          aoi: self.processingParams.aoi,
          products: self.processingParams.product
        }

        ProcessingService.addProcessing(params)
          .success(function (data, status, headers, config) {
            //SE TUTTO VA BENE
            self.showLoading = false;
            $mdDialog.hide();
            var alert = $mdDialog.alert()
              .title('Conferma Richiesta')
              .textContent('La richiesta di processamento è stata inviata')
              .ok('Close');

            $mdDialog.show(alert)
              .finally(function(){
                alert = undefined;
              });
          })
          .error(function (data, status, header, config) {
            self.showLoading = false;
            $mdDialog.hide();
            var alert = $mdDialog.alert()
              .title('Errore')
              .textContent(data.message)
              .ok('Close');

            $mdDialog.show(alert)
              .finally(function(){
                alert = undefined;
              });
          });

      }

      angular.extend(self,{
        "showCalendar":false,
        "showCalendarView":function () {
					self.showCalendar=!self.showCalendar;
				},
        "datepickerOptions": {
          minMode: "month",
        },
        "addProcessing": addProcessing,
  		});
		}]
	);
