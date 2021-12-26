/**
 * ====================================================================
 * Hachiware_Server
 * 
 * Web server application with Node.js
 * 
 * Author : Nakatsuji Masato 
 * ====================================================================
 */

module.exports = function(rootPath){
	
	var args = process.argv;
	args.shift();
	args.shift();

	if(args[0] == "listen"){

		const listen = require("./bin/listen.js");
		listen(rootPath);		

	}
	else{
		const command = require("./bin/command/command.js");
		command(rootPath);
	}

};