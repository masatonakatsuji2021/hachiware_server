/**
 * ====================================================================
 * Hachiware_Server
 * 
 * Web server application with Node.js
 * 
 * Author : Nakatsuji Masato 
 * ====================================================================
 */
const CLI = require("hachiware_cli");

const cli = new CLI();

module.exports = function(rootPath){
	
	cli.then(function(resolve){

		var arg = this.getArgs();

		if(!arg.length){
			const command = require("./bin/command/command.js");
			command.bind(this)(rootPath, resolve);
			return;
		}

		var cmd = arg.get(0);

		if(cmd == "start"){
			const listen = require("./bin/listen.js");
			listen.bind(this)(rootPath, resolve);
		}
		else if(cmd == "init"){
			const cmd_init = require("./bin/command/cmd_init.js");
			cmd_init.bind(this)(rootPath, arg, resolve);	
		}
		else if(cmd == "status"){
			const cmd_status = require("./bin/command/cmd_status.js");
			cmd_status.bind(this)(rootPath, resolve);	
		}

	}).then(function(){
		process.exit();
	}).start();
};