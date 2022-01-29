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

	this.outn("Server Status.");

	if(!fs.existsSync(rootPath + "/connection.lock")){
		this.color.red("Status : Stop").br();
		return exitResolve();
	}

	var getList = fs.readFileSync(rootPath + "/connection.lock").toString();

	getList = JSON.parse(getList);

	this.color.green("Status : Listen").br();

	var res = [];
	for(var n = 0 ; n < getList.length ; n++){
		var row = getList[n];

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