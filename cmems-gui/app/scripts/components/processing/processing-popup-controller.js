'use strict';

/**
 * @ngdoc function
 * @name rheticus.controller:ProcessingPopoupCtrl
 * @description
 * # ProcessingPopoupCtrl
 * Processing Popup Controller for rheticus project
 */
angular.module('rheticus')
 	.controller('ProcessingPopupCtrl',['$rootScope','$scope','$mdDialog','$http', '$filter', 'ProcessingService',
    function($rootScope,$scope,$mdDialog,$http,$filter,ProcessingService){

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

      var calculateProducts = function(){
        return 2**(self.processingParams.product);
      }

      var addProcessing = function(){
        self.showLoading = true;

        var dates = calculateDates();
        var products = calculateProducts();

        var params = {
          dates: dates,
          aoi: self.processingParams.aoi,
          products: products
        }

        ProcessingService.addProcessing(params)
          .success(function (data, status, headers, config) {
            //SE TUTTO VA BENE
            self.showLoading = false;
            $mdDialog.hide();
            var alert = $mdDialog.alert()
              .title($filter('translate')('ReqConfirm'))
              .textContent($filter('translate')('ProcOk'))
              .ok('Close');

            $mdDialog.show(alert)
              .finally(function(){
                alert = undefined;
              });
          })
          .error(function (data, status, header, config) {

            var message = '';
            switch(status){
              case 400:
                message = 'ChkParams';
                break;
              case 409:
                message = 'ProcInExec'
                break;
              default:
                message = 'UnexpectedError';
                break;
            }
            self.showLoading = false;
            $mdDialog.hide();
            var alert = $mdDialog.alert()
              .title($filter('translate')('Error'))
              .textContent($filter('translate')(message))
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
