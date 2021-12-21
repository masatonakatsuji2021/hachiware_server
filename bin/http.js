const http = require("http");
const log = require("./log.js");
const server = require("./server.js");
const tool = require("hachiware_tool");

module.exports = function(params, combined){

	if(!params.port){
		params.port = 80;
	}

	if(combined){
		params.port = 80;
	}

	var h = http.createServer(function(req,res){
		server.bind(this)(params,req,res);
	});
	
	if(params.httpAllowHalfOpen){
		h.httpAllowHalfOpen = true;
	}
	
	if(params.host){
		if(params.port == 80){
			var hostUrl = " http://:" + params.host + "/";
		}
		else{
			var hostUrl = " http://:" + params.host + params.port + "/";
		}
	}

	console.log("[" + tool.getDateFormat("{DATETIME}") + "] Listen Start");
	console.log("  " + params.server_name + hostUrl);
	console.log("");

	if(params.host){
		h.listen(params.port, params.host);
	}
	else{
		h.listen(params.port);
	}

	log.writeStartUp(true, params);

};