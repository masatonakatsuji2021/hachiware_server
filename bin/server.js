/**
 * ====================================================================
 * Hachiware_Server
 * 
 * Web server application with Node.js
 * 
 * License : MIT License. 
 * Since   : 2021.12.25
 * Author  : Nakatsuji Masato 
 * GitHub  : https://github.com/masatonakatsuji2021/hachiware_server
 * npm     : https://www.npmjs.com/package/hachiware_server
 * ====================================================================
 */

const fs = require("fs");
const sync = require("hachiware_sync");

module.exports = function(conf ,req ,res){

	var context = this;

	sync.then(function(resolve){

		res.setHeader("server","hachiware server");

		if(conf.headers){
			var colums = Object.keys(conf.headers);
			for(var n = 0 ; n < colums.length ; n++){
				var field = colums[n];
				var value = conf.headers[field];
				res.setHeader(field, value);
			}
		}

		if(!conf.modules){
			return resolve();
		}
	
		if(!context.modules[conf._file]){
			return resolve();
		}

		if(Object.keys(!context.modules[conf._file]).length){
			return resolve();
		}

		sync.foreach(
			context.modules[conf._file],
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
		
		var pageContent = "";

		context.loadFookModule(conf, "access", [
			req, 
			res,
		]);

		if(conf.welcomeToPage){
			if(fs.existsSync(conf.rootPath + "/" + conf.welcomeToPage)){
				pageContent = fs.readFileSync(conf.rootPath + "/" + conf.welcomeToPage).toString();
			}
		}

		if(!pageContent){
			if(req.url == "/image.png"){
				pageContent = fs.readFileSync(__dirname + "/welcome/image.png");
			}
			else{
				pageContent = fs.readFileSync(__dirname + "/welcome/index.html").toString();
			}
		}

		res.write(pageContent);
		res.end();

	}).start();

};