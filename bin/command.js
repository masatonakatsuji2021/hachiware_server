const CLI = require("hachiware_cli");

module.exports = function(rootPath){

	const cli = new CLI();

	cli.then(function(resolve){

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

			if(fcmd == "init"){
				const cmd_init = require("./cmd_init.js");
				cmd_init.bind(this)(rootPath, resolve);
			}
			else if(fcmd == "delete"){

			}
			else if(fcmd == "start"){
//				const cmd_start = require("./cmd_start.js");
//				cmd_start.bind(this)(values, rootPath, resolve);
			}
			else if(fcmd == "forever-start"){

			}
			else if(fcmd == "forever-stop"){

			}
			else{
				this.color.red("[ERROR] ").outn("The command \"" + fcmd + "\ does not exist. retry.");
				return retry();
			}

		});

	}).then(function(){
		this.exit();
	}).start();

};
