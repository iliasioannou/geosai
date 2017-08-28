//IMPORTANT: this file is GENERATED from grunt-replace task merging the following file:
// - cmems-gui/config/environments/common.json
// - cmems-gui/config/environments/mapServices.json

'use strict';

angular
	.module('services.config',[])
	.constant('configuration', {
		//common environment configuration
		rheticusHeaderImage : "@@rheticusHeaderImage",
		map : @@map,
		dataProviders : @@dataProviders,
		geocoder : @@geocoder,
		//custom environment configuration
		marineService : @@marineService,
		CHL : @@CHL,
		SST : @@SST,
		WT : @@WT,
		TUR : @@TUR,
		layers : @@layers,
		rheticusAPI : @@rheticusAPI
	});
