const tool = require("hachiware_tool");
const fs = require("hachiware_fs");

const log = require("./log.js");
const http = require(".//http.js");
const https = require("./https.js");

module.exports = function(rootPath){

	console.log("****************************************");
	console.log("*** Hachiware Server *****");
	console.log("");
	console.log("[" + tool.getDateFormat("{DATETIME}") + "] Listen Start");

	var confPath = rootPath + "/conf";

	if(!fs.existsSync(confPath)){
		throw Error("No configuration directory.");
	}

	if(!fs.statSync(confPath).isDirectory()){
		throw Error("No configuration directory.");
	}

	var confList = fs.deepReadDir(confPath);

	var confListOnPort = {};
	var confListOnPortAndSSL = {};

	var loadConf = [];
	var loadModules = [];
	for(var n = 0 ; n < confList.file.length ; n++){
		var path = confList.file[n];

		var conf = require(path);

		if(!Object.keys(conf).length){
			continue;
		}

		conf.rootPath = rootPath;

		if(!conf.host){
			conf.host = "localhost";
		}

		if(!conf.port){
			if(conf.ssl){
				conf.port = 443;
			}
			else{
				conf.port = 80;
			}
		}

		console.log(" Connect-URL :" + conf.host + ":" + conf.port);

		conf._host = conf.host;
		if(conf.ssl){
			if(conf.port != 443){
				conf._host += ":" + conf.port;
			}
		}
		else{
			if(conf.port != 80){
				conf._host += ":" + conf.port;
			}
		}

		loadConf.push(conf);
	}

	for(var n = 0 ; n < loadConf.length ; n++){
		var conf = loadConf[n];

		if(conf.modules){
			var modulesRe = [];
			for(var n2 = 0 ; n2 < conf.modules.length ; n2++){
				var module = conf.modules[n2];

				if(loadModules.indexOf(module) !== -1){
					modulesRe.push(module);
					continue;
				}

				var mPath = "modules/" + module + ".js";

				if(!fs.existsSync(__dirname + "/" + mPath)){
					console.log(" [WARM] " + conf.host + ":" + conf.port + " | \"" + module + "\" is not found module.");
					continue;
				}

				// require cache
				require("./" + mPath);
				
				modulesRe.push(module);
				loadModules.push(module);
			}

			conf.modules = modulesRe;
		}
	}

	for(var n = 0 ; n < loadConf.length ; n++){
		var conf = loadConf[n];

		if(conf.ssl){
			if(!conf.port){
				conf.port = 443;
			}

			if(!confListOnPortAndSSL[conf.port]){
				confListOnPortAndSSL[conf.port] = [];
			}

			confListOnPortAndSSL[conf.port].push(conf);
		}
		else{
			if(!conf.port){
					conf.port = 80;
			}
					
			if(!confListOnPort[conf.port]){
					confListOnPort[conf.port] = [];
			}

			confListOnPort[conf.port].push(conf);
		}
	}

	var colums = Object.keys(confListOnPort);
	for(var n = 0 ; n < colums.length ; n++){
		var port = colums[n];
		var confs = confListOnPort[port];

		http.bind(this)(port, confs);
	}

	var colums = Object.keys(confListOnPortAndSSL);
	for(var n = 0 ; n < colums.length ; n++){
		var port = colums[n];
		var confs = confListOnPortAndSSL[port];

		https.bind(this)(port, confs);
	}

	process.on("exit",function(){
		console.log("[" + tool.getDateFormat("{DATETIME}") + "] Server Exit.");
		// log.writeStartUp(false);
	});
	process.on("SIGINT", function () {
		process.exit(0);
	});

};