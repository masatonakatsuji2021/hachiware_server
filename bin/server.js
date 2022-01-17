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
		
		var pageContent = "";

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