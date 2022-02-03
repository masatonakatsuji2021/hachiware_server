/**
 * ====================================================================
 * Hachiware_Server
 * 
 * Web server application with Node.js
 * 
 * License : MIT License. 
 * Since   : 2021.12.25
 * Author  : Nakatsuji Masato 
 * GitHub  : https://github.com/masatonakatsuji2021/hachiware_server
 * npm     : https://www.npmjs.com/package/hachiware_server
 * ====================================================================
 */

const fs = require("fs");
const path = require('path');

module.exports = function(rootPath, exitResolve){
	
	this.br().outn("  Hachiware Server Status.").br();

	if(!fs.existsSync(rootPath + "/connection.lock")){
		this.color.red("Status : Stop").br();
		return exitResolve();
	}

	var getData = JSON.parse(fs.readFileSync(rootPath + "/connection.lock").toString());

	this.color.green("  Status : Listen now").br(2);

	this.outn("  Started : " + getData.startDate);

	this.out("  Threads : " + getData.mainPid + " (main), ");
	this.out(getData.pids.join(", ")).br();

	this.br();

	var res = [];
	for(var n = 0 ; n < getData.ss.length ; n++){
		var row = getData.ss[n];

		var protocol = "http://";
		if(row.ssl){
			protocol = "https://";
		}

		var buff = {
			"name": path.basename(row._file,".js"),
			"host":row.host,
			"port":row.port,
			"ssl":row.ssl ? true : false,
			"url":protocol + row._host,
		};

		res.push(buff);
	}


	this.outListData(res);
	return exitResolve();
};