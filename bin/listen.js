
/**
 * ====================================================================
 * Hachiware_Server
 * 
 * Web server application with Node.js
 * 
 * Author : Nakatsuji Masato 
 * ====================================================================
 */

const path0 = require("path");
const tool = require("hachiware_tool");
const fs = require("hachiware_fs");

const http = require(".//http.js");
const https = require("./https.js");
//const loadModule = require("./module.js");

module.exports = function(rootPath, exitResolve){

	this.loadFookModule = function(fookName, data){

		var colums = Object.keys(this.modules);
		for(var n = 0; n < colums.length ; n++){
			var moduleName = colums[n];
			var mc = this.modules[moduleName];

			if(!mc){
				continue;
			}

			var _fookName = "fook" + tool.ucFirst(fookName);

			if(!mc[_fookName]){
				continue;
			}

			if(data){
				mc[_fookName](...data);
			}
			else{
				mc[_fookName]();
			}
		}

	};

	var context = this;

	try{

		this.color.blue("**************************************************************************").br();
		this.outn("Hachieare Server Listen [" + tool.getDateFormat("{DATETIME}") + "] Listen Start!").br();
	
		var confPath = rootPath + "/conf";
	
		if(!fs.existsSync(confPath)){
			throw("No configuration directory. \n Prepare a \"conf\" directory and install one or more configuration files.");
		}
	
		if(!fs.statSync(confPath).isDirectory()){
			throw("No configuration directory. \n Prepare a \"conf\" directory and install one or more configuration files.");
		}
	
		var confList = fs.deepReadDir(confPath);
	
		if(!confList.file.length){
			throw("There are no configuration files in the \"conf\" directory.");
		}

		var confListOnPort = {};
		var confListOnPortAndSSL = {};
	
		var loadConf = [];
		var loadModules = [];

		this.outn("**** Connect URL ******************").br();
	
		for(var n = 0 ; n < confList.file.length ; n++){
			var path = confList.file[n];
	
			var conf = require(path);
	
			if(!Object.keys(conf).length){
				continue;
			}
	
			conf.rootPath = rootPath;
			conf._file = path;
	
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
			
			var connectStr = " - " + path0.basename(conf._file).padEnd(30) + " ";
			if(conf.ssl){
				connectStr += "https://";
				connectStr += conf.host;
				if(conf.port !== 443){
					connectStr += ":" + conf.port;
				}
			}
			else{
				connectStr += "http://";
				connectStr += conf.host;
				if(conf.port !== 80){
					connectStr += ":" + conf.port;
				}
			}
	
			this.outn(connectStr);
	
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
	
		this.br().color.green("....Listen Start.").br(2);

		this.modules = {};

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

					var mods = null;
					
					try{
						var mods = require(module);

						mods = new mods(conf, context.modules);

						modulesRe.push(module);
						loadModules.push(module);

						this.modules[module] = mods;

					}catch(error){
						this.color.red("[Error] ").outn(error.toString());
					}
					

/*
					if(module.indexOf("node_modules|") > -1){
						var mPath = module.replace("node_modules|","");
						try{
							var mods = require(mPath);
						}catch(error){
							this.color.orange(" [WARM] ").outn(conf.host + ":" + conf.port + " | \"" + module + "\" is not found module.");
							continue;
						}
					}
					else{
						*/

						// require cache
					//}

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

		var connectLockStr = JSON.stringify(loadConf);
		fs.writeFileSync(rootPath + "/connection.lock", connectLockStr);

		process.on("exit",function(){
			console.log("[" + tool.getDateFormat("{DATETIME}") + "] Server Exit.");
	
			var colums = Object.keys(confListOnPort);
			for(var n = 0 ; n < colums.length ; n++){
				var port = colums[n];
				var confs = confListOnPort[port];
	
				for(var n2 = 0 ; n2 < confs.length ; n2++){
					var c_ = confs[n2];

					context.loadFookModule("end");
				}
			}
	
			var colums = Object.keys(confListOnPortAndSSL);
			for(var n = 0 ; n < colums.length ; n++){
				var port = colums[n];
				var confs = confListOnPortAndSSL[port];
	
				for(var n2 = 0 ; n2 < confs.length ; n2++){
					var c_ = confs[n2];

					context.loadFookModule("end");
				}
			}
	
		});
		process.on("SIGINT", function () {
			try{
				fs.unlinkSync(rootPath + "/connection.lock");
			}catch(err){}
			process.exit(0);
		});
	
	}catch(error){
		this.br().color.red("[ERROR] ").outn(error);
		exitResolve();
	}

};