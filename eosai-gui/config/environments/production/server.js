/*
 * APP DISTRIBUTION ON NODE JS SERVER
 */
var express = require('express');
var server = express();

/*** Basic Auth for Production ***/

var basicAuth = require('basic-auth');
var usr = "demo";
var pwd = "displacement";
var auth = function(req, res, next){
  var user = basicAuth(req);
  if(user && user.name && (user.name==usr) && user.pass && (user.pass==pwd)) {
    return next();
  } else {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.sendStatus(401);
  }
}

server.use(auth);

server.set('port', 80);
server.use(express.static(__dirname + '/'));
server.get('/',function(req, res) {
  res.sendfile('./index.html');
});

/*
 * PROXY CONFIGURATION
 */
var HASH_MAP_EXTERNAL_SERVICES = {
	"RHETICUS_API" : "http://localhost:3000",
  "GEOSERVER" : "http://geoserver:9090",
  "GEONETWORK" : "http://geonetwork:8080",
  "ACTIVITI": "http://activiti:9085",
  "DOWNLOAD": "http://nginx"
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
	//console.log("Forwarding RHETICUS API requests to: "+req.url);
	apiProxy.web(req, res, {target: HASH_MAP_EXTERNAL_SERVICES.RHETICUS_API});
});

// Grab all requests to the server with "/geoserver".
server.all("/geoserver*", function(req, res) {
   console("passa da qui");
   console("req.headers");
  //console.log("Forwarding Geoserver API requests to: "+req.url);
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
  console.log("Forwarding Activiti explorer API requests to: "+req.url);
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
