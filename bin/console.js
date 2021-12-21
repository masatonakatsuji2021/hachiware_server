const CLI = require("hachiware_cli");

module.exports = function(){

	const cli = new CLI();

	cli.then(function(resolve){

		this.outn("** Hachiware Server *****************")
			.br()
		;

		this.in("コマンドを入力", function(value, retry){

			if(!value){
				this.color.red("[ERROR] ").outn("コマンドが入力されていません。retry.");
				return retry();
			}

			var values = value.split(" ");

			var fcmd = values[0];
			values.shift();

			if(fcmd == "init"){
				const cmd_init = require("./cmd_init.js");
				cmd_init.bind(this)(resolve);
			}
			else{
				this.color.red("[ERROR] ").outn("\""+ values[0] + "\"というコマンドは存在しません。retry.");
				return retry();
			}

		});

	}).then(function(){
		this.exit();
	}).start();

};
