const sync = require("hachiware_sync");
const tool = require("hachiware_tool");
const log = require("./log.js");
const publics = require("./publics.js");
const filtering = require("./filtering.js");

module.exports = function(params ,req ,res){

	var juge = filtering(params, req, res);

	if(!juge){
		res.statusCode = 404;
		res.end();
		return;
	}

	try{
		var assets = publics.searchAssets(params, req.url);

		if(assets){
			publics.loadAssets(assets, req, res);
		}
		else{
			log.writeAccess(params, req, res);

			if(tool.objExists(params,"callbacks.access")){

				var data = {
					params: params,
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
		}

	}catch(error){

		if(error.stack){
			error = error.stack;
		}

		if(res.statusCode == 200){
			res.statusCode = 500;
		}

		log.writeError(error, params, req, res);

		if(tool.objExists(params,"callbacks.error")){

			var data = {
				params: params,
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
	}

};