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
const cluster = require("cluster");
const fs = require("fs");
const os = require("os");
const loaderCheck = require("./loaderCheck.js");

cluster.schedulingPolicy = cluster.SCHED_RR;

module.exports = function(rootPath, args, exitResolve){

	var package = require("../../../package.json");

	this.outn("Hachieare Server [Version : " + package.version + "] Listen Start! *****************").br();

	try{
		var loadConf = loaderCheck.bind(this)(rootPath);
	}catch(error){
		this.color.red("[ERROR] ").outn(error.toString());
		return exitResolve();
	}

	// setting json load & write
	const settingPath = rootPath + "/hachiware_server.json";
	try{
		var setting = require(settingPath);
	}catch(error){

		var setting = {
			multiThread: false,
			multiThreadMaxProcess: "auto",
		};

		var settingStr = JSON.stringify(setting,null,"    ");
		fs.writeFileSync(settingPath, settingStr);
	}

	this.br().color.greenn("Listen Start").br();

	var pidList = [];

	var limit = 1;

	if(setting.multiThread){

		var limit = os.cpus().length;
		if(setting.multiThreadMaxProcess){
			if(setting.multiThreadMaxProcess != "auto"){
				limit = setting.multiThreadMaxProcess;
			}
		}

	}

	if(limit > 1){
		var autoStr = "";
		if(setting.multiThreadMaxProcess == "auto"){
			autoStr = "(auto)";
		}
		this.outn("# Multi thread. [thread = " + limit + autoStr + "]").br();
	}
	else{
		this.outn("# Single thread.").br();
	}

	cluster.setupMaster({
		exec: __dirname + "/start.js",
		args: [rootPath],
	});

	for(var n = 0 ; n < limit ; n++){
		var processRes = cluster.fork();
		pidList.push(processRes.process.pid);
	}

	cluster.on('exit', (worker, code, signal) => {
		console.log(`worker ${worker.process.pid} died with signal`, signal);
		cluster.fork();
	});

	var lockData = {
		startDate: tool.getDateFormat("{DATETIME}"),
		pids:pidList,
		ss: loadConf,
	};

	var lockDataStr = JSON.stringify(lockData);
	fs.writeFileSync(rootPath + "/connection.lock", lockDataStr);
};