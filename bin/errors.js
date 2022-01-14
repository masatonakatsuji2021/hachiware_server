/**
 * ====================================================================
 * Hachiware_Server
 * 
 * Web server application with Node.js
 * 
 * Author : Nakatsuji Masato 
 * ====================================================================
 */
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

		params.callbacks.error.bind(context)(error, req, res);
		
		if(params.errorConsoleOutput){
			console.log(tool.getDateFormat("[{DATETIME}] ") + error);
		}

	}
	else{
		res.end();
	}

	if(params.errorConsoleOutput){
		console.log(tool.getDateFormat("[{DATETIME}] ") + error);
	}
};