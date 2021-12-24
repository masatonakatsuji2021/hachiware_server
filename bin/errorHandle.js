const tool = require("hachiware_tool");
const log = require("./log.js");

module.exports = function(error, params, req, res){

	if(error.stack){
		error = error.stack;
	}

	if(res.statusCode == 200){
		res.statusCode = 500;
	}

	log.writeError(error, params, req, res);

	if(tool.objExists(params,"callbacks.error")){

		var data = {
			req: req,
			res: res,
		};

		sync.then(function(resolve){

			if(tool.objExists(params,"callbacks.syncError")){
				params.callbacks.error(resolve, error, data);
			}
			else{
				params.callbacks.error(error, data);
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