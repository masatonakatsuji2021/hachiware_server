const tool = require("hachiware_tool");
const log = require("./bin/log.js");

module.exports = {
	
	listen: function(params){

		console.log("****************************************");
		console.log("*** Hachiware Server *****");
		console.log("");

		if(!params){
			params = {};
		}

		if(params.ssl){
			const https = require("./bin/https.js");
			https(params);

			if(params.combine){
				const http = require("./bin/http.js");
				http(params, true);
			}
		}
		else{
			const http = require("./bin/http.js");
			http(params);
		}

		process.on("exit",function(){
			console.log("[" + tool.getDateFormat("{DATETIME}") + "] Server Exit.");
			log.writeStartUp(false, params);
		});
		process.on("SIGINT", function () {
			process.exit(0);
		});
		
	},

	console: function(){
		const console = require("./bin/console.js");
		console();
	},

};