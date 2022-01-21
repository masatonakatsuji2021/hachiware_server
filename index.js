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
	
	const cli = new CLI();

	cli.then(function(resolve){

		this.outn("** Hachiware Server *****************")
			.br()
		;

		var args = this.getArgs();

		if(args.length){
			const command = require("./bin/command/");
			command.bind(this)(rootPath, args, resolve);
			return;
		}

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