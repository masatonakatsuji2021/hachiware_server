const http = require("http");
const https = require("https");
const fs = require('fs');
const tool = require("hachiware_tool");
const server = require("./bin/server.js");
const log = require("./bin/log.js");

module.exports = {
	
	listen: function(params){

		console.log("****************************************");
		console.log("*** Hachiware Server *****");
		console.log("");

		if(!params){
			params = {};
		}

		if(!params.host){
			params.host = "localhost";
		}

		if(params.https){

			if(!params.sslServerKey){
				params.sslServerKey = "server_key.pem";
			}

			if(!params.sslServerCrt){
				params.sslServerCrt = "server_crt.pem";
			}
			if(!params.port){
				params.port = 443;
			}
				
			var options = {
				key: fs.readFileSync(params.sslServerKey),
				cert: fs.readFileSync(params.sslServerCrt),
			};
				
			var h = https.createServer(options, function(req,res){
				server.bind(this)(params,req,res);
			});

			if(params.httpAllowHalfOpen){
				h.httpAllowHalfOpen = true;
			}

			h.listen(params.port);
		}
		else{

			if(!params.port){
				params.port = 80;
			}

			var h = http.createServer(function(req,res){
				server.bind(this)(params,req,res);
			});
			
			if(params.httpAllowHalfOpen){
				h.httpAllowHalfOpen = true;
			}
			
			console.log("[" + tool.getDateFormat("{DATETIME}") + "] Listen Start");
			console.log("  " + params.server_name + " http://locahost:"+ params.port);
			console.log("");

			h.listen(params.port);

			log.writeStartUp(true, params);
		}

		process.on("exit",function(){
			console.log("[" + tool.getDateFormat("{DATETIME}") + "] Server Exit.");
			log.writeStartUp(false, params);
		});
		process.on("SIGINT", function () {
			process.exit(0);
		});
		
	},

};