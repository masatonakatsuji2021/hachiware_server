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

const CLI = require("hachiware_cli");

module.exports = function(rootPath){

	if(!rootPath){
		rootPath = process.cwd();
	}

	const versions = require("./package.json");

	const cli = new CLI();

	cli.then(function(resolve){

		try{
			var setting = require(process.cwd() + "/package.json");
			if(setting.server.path){
				rootPath = setting.server.path;
			}
		}catch(error){}
	
		var args = this.getArgs();

		if(args.length){
			const command = require("./bin/command/");
			command.bind(this)(rootPath, args, resolve);
			return;
		}

		this.outn("** Hachiware Server [Version : " + versions.version + "] *****************").br(2);

		this.in("Enter command ", function(value, retry){

			var args = this.convertArgs(value);

			if(!args.length){
				this.color.red("[ERROR] ").outn("No command entered. retry.");
				return retry();
			}

			const command = require("./bin/command/");
			command.bind(this)(rootPath, args, resolve, retry);
		});

	}).then(function(){
		process.exit();
	}).start();
};