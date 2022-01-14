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

const errors = require("./errors.js");

module.exports = function(params ,req ,res){

	var context = this;

	sync.then(function(resolve){

		if(!params.modules){
			return resolve();
		}

		sync.foreach(
			params.modules, 
			function(next, module){

				if(module.indexOf("node_modules|") > -1){
					var mPath = module.replace("node_modules|","");
					var mods = require(mPath);
				}
				else{
					var mPath = "modules/" + module + "/index.js";
					var mods = require("./" + mPath);
				}


				if(mods.each){
					mods.each(next, params, req, res);
				}
				else{
					next();
				}
			},
			function(){
				resolve();
			});

	}).then(function(){

		try{

			res.setHeader("server","hachiware server");

			if(params.headers){
				var colums = Object.keys(params.headers);
				for(var n = 0 ; n < colums.length ; n++){
					var field = colums[n];
					var value = params.headers[field];
					res.setHeader(field, value);
				}
			}
			
			if(context.modules.logs){
				context.modules.logs.writeAccess(params, req, res);
			}
	
			if(tool.objExists(params,"callbacks.access")){
				params.callbacks.access.bind(context)(req, res);
				return;
			}
			
			if(params.welcomeToPage){
				var pageContent = fs.readFileSync(params.rootPath + "/" + params.welcomeToPage);
				res.write(pageContent);	
				res.end();
			}

		}catch(error){
			errors.bind(context)(error, params, req, res);
		}
		
	}).start();

};