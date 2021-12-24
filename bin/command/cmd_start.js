module.exports = function(values, rootPath, exitResolve){

	var server_name = values[0];

	this.then(function(resolve){

		if(!server_name){

			this.color.orange(" [WARM] ").outn("The server name to start is not specified");

			this.in(" Q. Enter server name.", function(value,retry){
	
				if(!value){
					this.color.red("  [ERROR] ").outn("Server name not entered. retry.");
					return retry();
				}

				server_name = value;
				resolve();	
			});
		}

		resolve();

	}).then(function(resolve){

		this.outn("Start Server " + server_name);
		const { execSync  } = require('child_process')

		const stdout = execSync("node " + server_name + "/.");
	
		console.log(stdout.toString());

	}).start();

};