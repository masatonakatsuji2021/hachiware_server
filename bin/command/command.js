/**
 * ====================================================================
 * Hachiware_Server
 * 
 * Web server application with Node.js
 * 
 * Author : Nakatsuji Masato 
 * ====================================================================
 */
module.exports = function(rootPath, exitResolve){

	this.outn("** Hachiware Server *****************")
		.br()
	;

	this.in("Enter command ", function(value, retry){

		if(!value){
			this.color.red("[ERROR] ").outn("No command entered. retry.");
			return retry();
		}

		var values = value.split(" ");

		var fcmd = values[0];
		values.shift();

		if(fcmd == "start"){
			const listen = require("../listen.js");
			listen.bind(this)(rootPath, exitResolve);
		}
		else if(fcmd == "init"){
			const cmd_init = require("./cmd_init.js");
			cmd_init.bind(this)(rootPath, exitResolve);
		}
		else if(arg[0] == "status"){
			const cmd_status = require("./bin/command/cmd_status.js");
			cmd_status.bind(this)(rootPath, resolve);	
		}
		else{
			this.color.red("[ERROR] ").outn("The command \"" + fcmd + "\ does not exist. retry.");
			return retry();
		}

	});
};
