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

		var arg = this.convertArgs(value);

		var cmd = arg.get(0);

		if(cmd == "start"){
			const listen = require("../listen.js");
			listen.bind(this)(rootPath, exitResolve);
		}
		else if(cmd == "init"){
			const cmd_init = require("./cmd_init.js");
			cmd_init.bind(this)(rootPath, arg, exitResolve);
		}
		else if(cmd == "status"){
			const cmd_status = require("./cmd_status.js");
			cmd_status.bind(this)(rootPath, resolve);	
		}
		else{
			this.color.red("[ERROR] ").outn("The command \"" + cmd + "\ does not exist. retry.");
			return retry();
		}

	});
};
