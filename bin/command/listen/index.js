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
const { spawn } = require("child_process");
const cluster = require("cluster");
const fs = require("fs");
const os = require("os");
const loaderCheck = require("./loaderCheck.js");

cluster.schedulingPolicy = cluster.SCHED_RR;

module.exports = function(rootPath, args, exitResolve){

	var vm = this;

	const lockPath = rootPath + "/connection.lock";

	const lockSave = function(){

		var lockData = {
			startDate: tool.getDateFormat("{DATETIME}"),
			mainPid: process.pid,
			pids: pidList,
			ss: loadConf,
		};
	
		var lockDataStr = JSON.stringify(lockData);
		fs.writeFileSync(lockPath, lockDataStr);
	};

	const lockDelete = function(){
		try{
			fs.unlinkSync(lockPath);
		}catch(err){}
	};

	const packagePath = "../../../package.json";

	var package = require(packagePath);

	this.outn("Hachieare Server [Version : " + package.version + "] Listen Start! *****************").br();

	try{
		var loadConf = loaderCheck.bind(this)(rootPath);
	}catch(error){
		this.color.red("[ERROR] ").outn(error.toString());
		return exitResolve();
	}

	// setting json load & write
//	const settingPath = rootPath + "/hachiware_server.json";
	const settingPath = rootPath + "/package.json";

	try{
		var setting = require(settingPath);
	}catch(error){
		var setting = {};
	}

	if(!setting.server){
		setting.server = {};
	}

	if(!setting.server.multiThread){
		setting.server.multiThread = false;
	}

	if(!setting.server.multiThreadMaxProcess){
		setting.server.multiThreadMaxProcess = "auto";
	}

	var pidList = [];

	var limit = 1;

	if(setting.server.multiThread){

		var limit = os.cpus().length;
		if(setting.server.multiThreadMaxProcess){
			if(setting.server.multiThreadMaxProcess != "auto"){
				limit = setting.server.multiThreadMaxProcess;
			}
		}

	}

	this.br();

	if(limit > 1){
		var autoStr = "";
		if(setting.server.multiThreadMaxProcess == "auto"){
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
		var newProcess = cluster.fork();
		this.outn(" -  Thread " + newProcess.process.pid.toString().padEnd(5) + "");
		pidList.push(newProcess.process.pid);
	}

	lockSave();

	this.br().color.greenn("Listen Start!").br();

	var foreverd = true;
	var foreverdCOunt = 0;

	cluster.on('exit', (worker) => {

		if(!foreverd){
			foreverdCOunt++;

			console.log("..thread exit " + worker.process.pid);

			if(foreverdCOunt == limit){
				process.exit(0);
			}

			return;
		}

		var newProcess = cluster.fork();

		var delPid = worker.process.pid;
		var newPid = newProcess.process.pid;

		console.log("* thread exit " + delPid + " -> restart " + newPid);

		pidList.splice(pidList.indexOf(delPid),1);

		pidList.push(newPid);

		lockSave();
	});

	process.on("exit",function(){
		lockDelete();
		vm.br().outn("...Exit");
	});

	process.on("SIGINT", function (){ 

		foreverd = false;
		for(var n = 0 ; n < pidList.length ; n++){
			var pid = pidList[n];
			try{
				process.kill(pid);
			}catch(error){}
		}

		return null;
	});
};