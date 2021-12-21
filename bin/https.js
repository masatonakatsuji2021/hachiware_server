const https = require("https");
const log = require("./log.js");
const server = require("./server.js");
const tool = require("hachiware_tool");
const fs = require('fs');

module.exports = function(params){
	
	if(!params.port){
		params.port = 443;
	}
				
	var options = {
		key: fs.readFileSync(params.certificate.key),
		cert: fs.readFileSync(params.certificate.cert),
	};

	if(params.certificate.ca){
		options.ca = fs.readFileSync(params.certificate.ca);
	}
				
	var h = https.createServer(options, function(req,res){
		server.bind(this)(params,req,res);
	});

	if(params.httpAllowHalfOpen){
		h.httpAllowHalfOpen = true;
	}

	if(params.host){
		if(params.port == 443){
			var hostUrl = " https://:" + params.host + "/";
		}
		else{
			var hostUrl = " https://:" + params.host + params.port + "/";
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

	if(params.combined){
		const http = require("./bin/http.js");
		http(params);
	}

	log.writeStartUp(true, params);
};