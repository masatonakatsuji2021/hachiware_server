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

 module.exports = function(rootPath, args, exitResolve, retry){

	var cmd = args.get(0);

	if(cmd == "start"){
		const listen = require("./listen/");
		listen.bind(this)(rootPath,args, exitResolve);
	}
	else if(cmd == "exit"){
		const exit = require("./exit/");
		exit.bind(this)(rootPath, exitResolve);
	}
	else if(cmd == "setup"){
		const setup = require("./setup/");
		setup.bind(this)(rootPath, args, exitResolve);
	}
	else if(cmd == "set_systemd"){
		const setSystemd = require("./setSystemd/");
		setSystemd.bind(this)(rootPath, args, exitResolve);
	}
	else if(
		cmd == "addss" || 
		cmd == "init"
	){
		const addss = require("./addss/");
		addss.bind(this)(rootPath, args, exitResolve);
	}
	else if(cmd == "search"){
		const search = require("./search/");
		search.bind(this)(rootPath, args, exitResolve);
	}
	else if(cmd == "status"){
		const status = require("./status/");
		status.bind(this)(rootPath, exitResolve);	
	}
	else if(cmd == "module"){
		const modules = require("./module");
		modules.bind(this)(rootPath, args, exitResolve);
	}
	else if(cmd == "version"){
		const version = require("./version/");
		version.bind(this)(exitResolve);
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
