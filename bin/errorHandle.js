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

module.exports = function(error, params, req, res){

	var context = this;

	if(res.statusCode == 200){
		res.statusCode = 500;
	}

	if(context.modules.logs){
		context.modules.logs.writeError(error, params, req, res);
	}

	if(tool.objExists(params,"callbacks.error")){

		var data = {
			req: req,
			res: res,
		};

		sync.then(function(resolve){

			if(tool.objExists(params,"callbacks.syncError")){
				params.callbacks.error.bind(context)(resolve, error, data);
			}
			else{
				params.callbacks.error.bind(context)(error, data);
				resolve();
			}

		}).then(function(){
			res.end();
			if(params.errorConsoleOutput){
				console.log(tool.getDateFormat("[{DATETIME}] ") + error);
			}
		}).start();
	}
	else{
		res.end();
		if(params.errorConsoleOutput){
			console.log(tool.getDateFormat("[{DATETIME}] ") + error.stack);
		}
	}
};