//IMPORTANT: this file is GENERATED from grunt-replace task merging the following file:
// - cmems-gui/config/environments/common.json
// - cmems-gui/config/environments/mapServices.json

'use strict';

angular
	.module('services.config',[])
	.constant('configuration', {
		//common environment configuration
		rheticusHeaderImage : "./images/RheticusLogo.png",
		map : {"center":{"lon":20.77,"lat":39.78,"zoom":6,"bounds":[],"projection":"EPSG:4326"},"view":{"projection":"EPSG:3857","maxZoom":19,"minZoom":3},"query":{"zoom":7},"crs":"EPSG:3857"},
		dataProviders : [{"name":" Sentinel","checked":true},{"name":" Cosmo","checked":true},{"name":" TerraSAR-X","checked":true}],
		geocoder : {"url":"http://nominatim.openstreetmap.org/search?q=","params":"&limit=5&format=json&accept-language=en&polygon_geojson=1","paramsReverse":"&limit=1&format=json&zoom=18&accept-language=en","urlReverse":"http://nominatim.openstreetmap.org/reverse?"},
		//custom environment configuration
		marineService : {"catalog":"./geonetwork","help":"./pdf/userguide_Marine.pdf"},
		CHL : {"dailySlider":"CHL","tenDaysSlider":"CHL10","monthSlider":"CHL30","month90Slider":"CHL30P"},
		SST : {"dailySlider":"SST","tenDaysSlider":"SST10","monthSlider":"SST30","month90Slider":"SST30P"},
		WT : {"dailySlider":"WT","tenDaysSlider":"WT10","monthSlider":"WT30","month90Slider":"WT30P"},
		TUR : {"dailySlider":"TUR","tenDaysSlider":"TUR10","monthSlider":"TUR30","month90Slider":"TUR30P"},
		layers : {"baselayers":[{"name":"OpenStreetMap","group":"base","source":{"type":"OSM","crossOrigin":"null"},"active":false,"visible":true,"opacity":1,"layerOptions":{"attribution":"© OpenStreetMap contributors","url":"http://www.openstreetmap.org/copyright"}},{"name":"Mapbox","group":"base","source":{"type":"MapBox","mapId":"mapbox.satellite","accessToken":"pk.eyJ1IjoicGsyMDE0IiwiYSI6IkRCTHI5Q28ifQ.oA7Qj3tLfqal-RZCRBISPA","crossOrigin":"null"},"active":true,"visible":true,"opacity":1,"layerOptions":{"attribution":"Mapbox ©","url":"https://www.mapbox.com/about/maps"}},{"name":"Ortofoto RealVista 1.0","group":"base","source":{"type":"XYZ","crossOrigin":"null","url":"http://earth.realvista.it/realvista2d/query?request=ImageryMaps&channel=1004&version=17&x={x}&y={y}&z={z}","params":{"LAYERS":"rv1","TILED":true,"FORMAT":"image/jpeg"}},"active":false,"visible":true,"opacity":1,"layerOptions":{"attribution":"Imagery © Realvista contributors","url":"http://www.realvista.it/"}}],"overlays":{"olLayers":[{"id":"sst","name":"SST","group":"Overlays","unit":"°C","source":{"type":"TileWMS","crossOrigin":"null","legend":"images/SST_Legend.jpg","urls":["http://locationHost/geoserver/pkz029_CMEMS/wms"],"params":{"LAYERS":"SST","TIME":"2012-04-01","TILED":true}},"active":true,"visible":false,"opacity":0.8,"layerOptions":{"attribution":"","url":""}},{"id":"wt","name":"WT","group":"Overlays","unit":"m","source":{"type":"TileWMS","crossOrigin":"null","legend":"images/WT_Legend.jpg","urls":["http://locationHost/geoserver/pkz029_CMEMS/wms"],"params":{"LAYERS":"WT","TIME":"2012-04-01","TILED":true}},"active":true,"visible":false,"opacity":0.8,"layerOptions":{"attribution":"","url":""}},{"id":"chl","name":"CHL","group":"Overlays","unit":"mg/m3","source":{"type":"TileWMS","crossOrigin":"null","legend":"images/Chl_Legend.jpg","urls":["http://locationHost/geoserver/pkz029_CMEMS/wms"],"params":{"LAYERS":"CHL","TIME":"2012-04-01","TILED":true},"serverType":"geoserver"},"active":true,"visible":true,"opacity":0.8,"layerOptions":{"attribution":"","url":""}},{"id":"tur","name":"TUR","group":"Overlays","unit":"FNU","source":{"type":"TileWMS","crossOrigin":"null","legend":"images/TUR_Legend.jpg","urls":["http://locationHost/geoserver/pkz029_CMEMS/wms"],"params":{"LAYERS":"TUR","TIME":"2012-04-01","TILED":true},"serverType":"geoserver"},"active":true,"visible":false,"opacity":0.8,"layerOptions":{"attribution":"","url":""}}],"metadata":[]}},
		rheticusAPI : {"host":"http://locationHost/rheticusapi/api/v1.0.0","authentication":"/oauth/token","userDetails":"/login","getAllUsers":"/users","addUsers":"/users","addProcessing":"/processings","getRoles":"/roles","dataset":{"path":"/datasets/#datasetid","datasetid":"#datasetid"},"measure":{"path":"/datasets/#datasetid/pss/#psid/measures?type=DL&periods=#periods","datasetid":"#datasetid","psid":"#psid","periods":"#periods","properties":{"datasetid":"datasetid","psid":"psid","date":"data","measure":"measure"}}}
	});
