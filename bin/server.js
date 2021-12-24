const sync = require("hachiware_sync");
const tool = require("hachiware_tool");

const errorHandle = require("./errorHandle.js");
const log = require("./log.js");

module.exports = function(params ,req ,res){

	res.setHeader("server","hachiware server");

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