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

	var pidList = [];
	var limit = 1;
	var loadConf = null;
	const packagePath = "../../../package.json";
	var foreverd = true;
	var refreshed = false;
	var foreverdCount = 0;
	var setting = {};

	const listenStart = function(){

		var package = require(packagePath);
	
		this.br(2).outn("  Hachieare Server [Version : " + package.version + "] Listen Start! *****************").br();
	
		try{
			loadConf = loaderCheck.bind(this)(rootPath);
		}catch(error){
			this.color.red("[ERROR] ").outn(error.toString());
			return exitResolve();
		}
	
		// setting json load & write
		const settingPath = rootPath + "/package.json";

		setting = {};

		try{
			setting = fs.readFileSync(settingPath).toString();
			setting = JSON.parse(setting);
		}catch(error){}

		if(!setting){
			setting = {};
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

		limit = 1;

		if(setting.server.multiThread){
			limit = os.cpus().length;
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
			this.outn("  # Multi thread. [thread = " + limit + autoStr + "]").br();
		}
		else{
			this.outn("  # Single thread.").br();
		}
	
		var clusterOption = {
			exec: __dirname + "/start.js",
			args: [rootPath],
		}
	
		if(setting.server.manualMemoryRelease){
			clusterOption.execArgv = ["--expose-gc"];
		}
	
		cluster.setupMaster(clusterOption);
	
		for(var n = 0 ; n < limit ; n++){
			var newProcess = cluster.fork();
			this.outn("   -  Thread " + newProcess.process.pid.toString().padEnd(5) + "");
			pidList.push(newProcess.process.pid);
		}
	
		lockSave();
	
		this.br().color.greenn("  Listen Start!").br(2);

		this.outn("Enter here if there is a command related to server operation.")
			.in(" >", function(value, retry){
	
				if(!value){
					this.color.red("[ERROR] ").outn("No command entered. retry.");
					return retry();
				}
	
				if(value == "status"){
					const status = require("../status/");
					status.bind(this)(rootPath, retry);
				}
				else if(value == "refresh"){
	
					this.br().outn("...Server Refresh!!").br();

					refreshed = true;
					foreverdCount = 0;
	
					if(refreshed){
						for(var n = 0 ; n < pidList.length ; n++){
							var cpid = pidList[n];
							process.kill(cpid);
						}
					}
				}
				else if(value == "exit"){
					this.br().outn("Server exit.").br();
					clusterKill();
				}
				else{
					this.color.red("[Error] ").outn("\"" + value + "\" command does not exist.")
						.br()
						.outn("   status   .. Display server operation status")
						.outn("   refresh  .. Restart the server once")
						.outn("   exit     .. Quit the server.")
						.br()
						.outn("Enter the command from the above. retry.");

					retry();
				}
			return;
		});

	};

	listenStart.bind(this)();

	cluster.on('exit', (worker) => {

		if(!foreverd || refreshed){
			foreverdCount++;

			console.log("..thread exit " + worker.process.pid);

			if(foreverdCount == limit){

				if(refreshed){
					pidList = [];
					listenStart.bind(vm)();
				}
				else{
					process.exit(0);
				}
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
		clusterKill();
		return null;
	});

	const clusterKill = function(){

		foreverd = false;
		refreshed = false;
		foreverdCount = 0;

		for(var n = 0 ; n < pidList.length ; n++){
			var pid = pidList[n];
			try{
				process.kill(pid);
			}catch(error){}
		}
	};

};