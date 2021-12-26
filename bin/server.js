/**
 * ====================================================================
 * Hachiware_Server
 * 
 * Web server application with Node.js
 * 
 * Author : Nakatsuji Masato 
 * ====================================================================
 */

const sync = require("hachiware_sync");
const tool = require("hachiware_tool");

const errorHandle = require("./errorHandle.js");
const log = require("./log.js");

module.exports = function(params ,req ,res){

	sync.then(function(resolve){

		if(!params.modules){
			return resolve();
		}

		sync.foreach(
			params.modules, 
			function(next, module){

				var mPath = "modules/" + module + ".js";

				var mod = require("./" + mPath);

				mod(next, params, req, res);
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
			
			log.writeAccess(params, req, res);
	
			if(tool.objExists(params,"callbacks.access")){
		
				var data = {
					req: req,
					res: res,
				};
		
				sync.then(function(resolve){
		
					if(tool.objExists(params,"callbacks.SyncAccess")){
						params.callbacks.access(resolve, data);
					}
					else{
						params.callbacks.access(data);
						resolve();
					}
		
				}).then(function(){
					res.end();
				}).start();
			}
			else{
				res.statusCode = 404;
				res.end();
			}

		}catch(error){
			errorHandle(error, params, req, res);
		}
		
	}).start();

};