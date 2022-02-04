/**
 * ====================================================================
 * Hachiware_Server
 * 
 * Web server application with Node.js
 * 
 * License : MIT License. 
 * Since   : 2021.12.25
 * Author  : Nakatsuji Masato 
 * Email   : nakatsuji@teastalk.jp
 * HP URL  : https://hachiware-js.com/
 * GitHub  : https://github.com/masatonakatsuji2021/hachiware_server
 * npm     : https://www.npmjs.com/package/hachiware_server
 * ====================================================================
 */

const tool = require("hachiware_tool");
const fs = require("hachiware_fs");
const http = require("./http.js");
const https = require("./https.js");
const loaderCheck = require("./command/listen/loaderCheck.js");
const sysLog = require("./sysLog.js");

module.exports = function(rootPath, exitResolve){

	/**
	 * loadFookModule
	 * @param {*} conf
	 * @param {*} fookName 
	 * @param {*} data 
	 */
	this.loadFookModule = function(conf, fookName, data){

		if(!this.modules[conf._file]){
			return;
		}

		var colums = Object.keys(this.modules[conf._file]);
		for(var n = 0; n < colums.length ; n++){
			var moduleName = colums[n];
			var mc = this.modules[conf._file][moduleName];

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

	try{

		var confListOnPort = {};
		var confListOnPortAndSSL = {};
	
		var loadConf = loaderCheck.bind(this)(rootPath, true);

		this.modules = {};

		for(var n = 0 ; n < loadConf.length ; n++){
			var conf = loadConf[n];

			if(conf.modules){
				for(var n2 = 0 ; n2 < conf.modules.length ; n2++){
					var module = conf.modules[n2];

					var mods = require(module);

					mods = new mods(conf, this);

					if(!this.modules[conf._file]){
						this.modules[conf._file] = {};
					}

					this.modules[conf._file][module] = mods;
				}
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

	}catch(error){
		console.log(error);
		exitResolve();
	}

	process.on("uncaughtException",function(error){
		sysLog(rootPath, error);
	});

	/**
	process.on("exit",function(){

		console.log("[" + tool.getDateFormat("{DATETIME}") + "] Server Exit.");

		var colums = Object.keys(confListOnPort);
		for(var n = 0 ; n < colums.length ; n++){
			var port = colums[n];
			var confs = confListOnPort[port];

			for(var n2 = 0 ; n2 < confs.length ; n2++){
				var c_ = confs[n2];

				context.loadFookModule(c_, "end");
			}
		}

		var colums = Object.keys(confListOnPortAndSSL);
		for(var n = 0 ; n < colums.length ; n++){
			var port = colums[n];
			var confs = confListOnPortAndSSL[port];

			for(var n2 = 0 ; n2 < confs.length ; n2++){
				var c_ = confs[n2];

				context.loadFookModule(c_, "end");
			}
		}

	});

	process.on("SIGINT", function (){ 
		process.exit(0);
	});
	**/
};