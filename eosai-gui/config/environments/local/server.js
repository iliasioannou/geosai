/*
 * APP DISTRIBUTION ON NODE JS SERVER
 */
var express = require('express');
var server = express();
server.set('port', 8080);
server.use(express.static(__dirname + '/'));
server.get('/',function(req, res) {
    res.sendfile('./eosai/index.html');
});

/*
 * PROXY CONFIGURATION
 */
var HASH_MAP_EXTERNAL_SERVICES = {
  "RHETICUS_API" : "http://marine-eosai.rheticus.eu/rheticusapi",
  "GEOSERVER" : "http://marine-eosai.rheticus.eu",
  "GEONETWORK" : "http://marine-eosai.rheticus.eu",
  "ACTIVITI": "http://marine-eosai.rheticus.eu",
  "DOWNLOAD": "http://marine-eosai.rheticus.eu"
};

var httpProxy = require('http-proxy');
httpProxy.prototype.onError = function (err) {
	console.log(err);
};

var proxyOptions = {
  changeOrigin: true
};
var apiProxy = httpProxy.createProxyServer(proxyOptions);

// To modify the proxy connection before data is sent, you can listen
// for the 'proxyReq' event. When the event is fired, you will receive
// the following arguments:
// (http.ClientRequest proxyReq, http.IncomingMessage req,
//  http.ServerResponse res, Object options). This mechanism is useful when
// you need to modify the proxy request before the proxy connection
// is made to the target.

// Grab proxyReq
apiProxy.on('proxyReq', function(proxyReq, req, res, options) {
  if (req.headers["authorization"]){
    delete req.headers["authorization"];
  }
});

// Grab proxyRes and add CORS
apiProxy.on('proxyRes', function (proxyRes, req, res) {
  //console.log(req.headers);
  proxyRes.headers["Access-Control-Allow-Origin"] = "*";
  //console.log('RAW Response from the target', JSON.stringify(proxyRes.headers, true, 2));
});

//Grab error messages
apiProxy.on('error', function (err, req, res) {
  res.end('Something went wrong. And we are reporting a custom error message.');
});



// Grab all requests to the server with "/rheticusapi".
server.all("/rheticusapi*", function(req, res) {
	req.url = req.url.replace('/rheticusapi/','');
	console.log("Forwarding RHETICUS API requests to: "+req.url);
	apiProxy.web(req, res, {target: HASH_MAP_EXTERNAL_SERVICES.RHETICUS_API});
});

// Grab all requests to the server with "/geoserver".
server.all("/geoserver*", function(req, res) {
  console.log("Forwarding Geoserver API requests to: "+req.url);
  //console.log("-->");
  //console.log(req.headers);
  if (req.headers["authorization"]){
    delete req.headers["authorization"];
  }
  if (req.headers["upgrade-insecure-requests"]){
    delete req.headers["upgrade-insecure-requests"];
  }
  //console.log(req.headers);
  //res.removeHeader("WWW-Authenticate");
	apiProxy.web(req, res, {target: HASH_MAP_EXTERNAL_SERVICES.GEOSERVER});
});

// Grab all requests to the server with "/geonetwork".
server.all("/geonetwork*", function(req, res) {
  console.log("Forwarding Geonetwork API requests to: "+req.url);
  //console.log(req.headers);
  if (req.headers["authorization"]){
    delete req.headers["authorization"];
  }
  if (req.headers["upgrade-insecure-requests"]){
    delete req.headers["upgrade-insecure-requests"];
  }
  //console.log(req.headers);
  //res.removeHeader("WWW-Authenticate");
	apiProxy.web(req, res, {target: HASH_MAP_EXTERNAL_SERVICES.GEONETWORK});
});

server.all("/download*", function(req, res){
  console.log("Forwarding Nginx API requests to: "+req.url);
  //console.log(req.headers);
  if (req.headers["authorization"]){
    delete req.headers["authorization"];
  }
  if (req.headers["upgrade-insecure-requests"]){
    delete req.headers["upgrade-insecure-requests"];
  }
  apiProxy.web(req, res, {target: HASH_MAP_EXTERNAL_SERVICES.DOWNLOAD});
});

server.all("/activiti-explorer*", function(req, res){
  console.log("Forwarding Activiti rest explorer API requests to: "+req.url);
  //console.log(req.headers);
  if (req.headers["authorization"]){
    delete req.headers["authorization"];
  }
  if (req.headers["upgrade-insecure-requests"]){
    delete req.headers["upgrade-insecure-requests"];
  }
  apiProxy.web(req, res, {target: HASH_MAP_EXTERNAL_SERVICES.ACTIVITI});
});

/*
 * Start Server.
 */
server.listen(server.get('port'), function() {
  console.log('Express server listening on port ' + server.get('port'));
});
