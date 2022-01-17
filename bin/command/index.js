/**
 * ====================================================================
 * Hachiware_Server
 * 
 * Web server application with Node.js
 * 
 * Author : Nakatsuji Masato 
 * ====================================================================
 */
 module.exports = function(rootPath, args, exitResolve, retry){

	var cmd = args.get(0);

	if(cmd == "start"){
		const listen = require("../listen.js");
		listen.bind(this)(rootPath, exitResolve);
	}
	else if(cmd == "init"){
		const init = require("./init/");
		init.bind(this)(rootPath, args, exitResolve);
	}
	else if(cmd == "status"){
		const status = require("./status/");
		status.bind(this)(rootPath, exitResolve);	
	}
	else if(cmd == "module"){
		const modules = require("./module");
		modules.bind(this)(rootPath, args, exitResolve);
	}
	else{
		this.color.red("[ERROR] ").outn("The command \"" + cmd + "\ does not exist.");
		if(retry){
			return retry();
		}
		else{
			return exitResolve();
		}
	}

};
