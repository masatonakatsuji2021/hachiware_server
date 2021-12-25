module.exports = {
	
	/**
	 * listen
	 * @param {*} rootPath 
	 */
	listen: function(rootPath){
		const listen = require("./bin/listen.js");
		listen(rootPath);		
	},

	/**
	 * command
	 * @param {*} rootPath 
	 */
	command: function(rootPath){
		const command = require("./bin/command/command.js");
		command(rootPath);
	},

};