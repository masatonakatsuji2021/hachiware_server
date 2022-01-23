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

const path0 = require("path");
const tool = require("hachiware_tool");
const fs = require("hachiware_fs");
const http = require("./http.js");
const https = require("./https.js");

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

	var context = this;

	try{

		this.color.blue("**************************************************************************").br();
		this.outn("Hachieare Server Listen [" + tool.getDateFormat("{DATETIME}") + "] Listen Start!").br();
	
		var confList = fs.readdirSync(rootPath);

		if(!confList.length){
			throw("There are no configuration files in the \"conf\" directory.");
		}

		var confListOnPort = {};
		var confListOnPortAndSSL = {};
	
		var loadConf = [];

		this.outn("**** Connect URL ******************").br();
	
		for(var n = 0 ; n < confList.length ; n++){
			var ssName = confList[n];
			
			var dirPath = rootPath + "/" + confList[n];
			
			if(!fs.statSync(dirPath).isDirectory()){
				continue;
			}

			var path = rootPath + "/" + confList[n] + "/conf.js";
	
			var conf = require(path);

			if(!Object.keys(conf).length){
				continue;
			}
	
			conf.rootPath = dirPath;
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

			var fileName = ssName;
			if(conf.enable === false){
				fileName += "(disable) ";
			}
			var connectStr = " - " + fileName.padEnd(50) + " ";

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

			if(conf.enable === false){
				this.color.grayn(connectStr);
			}
			else{
				this.outn(connectStr);
			}

			if(conf.enable === false){
				continue;
			}
	
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
				for(var n2 = 0 ; n2 < conf.modules.length ; n2++){
					var module = conf.modules[n2];

					var mods = null;
					
					try{
						var mods = require(module);

						mods = new mods(conf, this);

						if(!this.modules[conf._file]){
							this.modules[conf._file] = {};
						}

						this.modules[conf._file][module] = mods;

					}catch(error){
						this.color.red("[Error] ").outn("Host=" + conf._host + "  " + error.toString());
					}
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
		process.on("SIGINT", function () {
			try{
				fs.unlinkSync(rootPath + "/connection.lock");
			}catch(err){}
			process.exit(0);
		});
	
	}catch(error){
		this.br().color.red("[ERROR] ").outn(error);
		console.log(error);
		exitResolve();
	}

};