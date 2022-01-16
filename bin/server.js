/**
 * ====================================================================
 * Hachiware_Server
 * 
 * Web server application with Node.js
 * 
 * Author : Nakatsuji Masato 
 * ====================================================================
 */

const fs = require("fs");
const sync = require("hachiware_sync");
const tool = require("hachiware_tool");

module.exports = function(params ,req ,res){

	var context = this;

	sync.then(function(resolve){

		res.setHeader("server","hachiware server");

		if(params.headers){
			var colums = Object.keys(params.headers);
			for(var n = 0 ; n < colums.length ; n++){
				var field = colums[n];
				var value = params.headers[field];
				res.setHeader(field, value);
			}
		}

		if(!params.modules){
			return resolve();
		}

		sync.foreach(
			context.modules,
			function(next, module){

				if(!module.fookRequest){
					return next();
				}

				try{
					module.fookRequest(next, req, res);
				}catch(error){
					console.log(error);
					process.exit();
				}
			},
			function(){
				resolve();
			});

	}).then(function(){
		
		if(conf.welcomeToPage){
			var pageContent = fs.readFileSync(conf.rootPath + "/" + conf.welcomeToPage);
			res.write(pageContent);	
		}

		res.statusCode = 400;
		res.end();

	}).start();

};