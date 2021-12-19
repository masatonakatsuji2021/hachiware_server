const fs = require("fs");
const path = require("path");
const mime = require("./mime.js");

module.exports = {

	/**
	 * searchAssets
	 * @param {*} params 
	 * @param {*} requestUrl 
	 * @returns 
	 */
	searchAssets: function(params, requestUrl){

		if(!params.assets){
			return null;
		}

		var assets = null;

		for(var n = 0 ; n < params.assets.length ; n++){
			var row = params.assets[n];

			var url = row.url;

			var baseUrl = requestUrl + "/";
			if(baseUrl.indexOf(url + "/") === 0){
				assets = row;
			}
		}

		return assets;
	},

	/**
	 * loadFile
	 * @param {*} assets 
	 * @param {*} filePath 
	 * @param {*} req 
	 * @param {*} res 
	 */
	loadFile: function(assets, filePath, req, res){

		var headers = {};
		headers["Content-Type"] = mime(assets, path.extname(filePath));

		if(assets.headers){
			var colums = Object.keys(assets.headers);
			for(var n = 0 ; n < colums.length ; n++){
				var key = colums[n];
				var val = assets.headers[key];
				headers[key] = val;
			}
		}

		res.writeHead(200,headers);
		var file = fs.readFileSync(filePath);
		res.write(file);
	},

	/**
	 * loadAssets
	 * @param {*} assets 
	 * @param {*} req 
	 * @param {*} res 
	 */
	loadAssets: function(assets, req, res){
		var filePath = assets.mount + req.url.replace(assets.url,"");

		res.statusCode = 200;

		if(fs.existsSync(filePath)){

			if(fs.statSync(filePath).isFile()){
				this.loadFile(assets, filePath, req, res);
			}
			else{

				if(assets.indexed){
					if(typeof assets.indexed == "string"){
						assets.indexed = [assets.indexed];
					}

					var juge = false;
					for(var n = 0 ; n < assets.indexed.length ; n++){
						var fName = assets.indexed[n];

						if(filePath[filePath.length - 1] != "/"){
							filePath += "/";
						}
						filePath += fName;

						if(fs.existsSync(filePath)){
							if(fs.statSync(filePath).isFile()){
								juge = true;
								break;
							}
						}
					}

					if(juge){
						this.loadFile(assets, filePath, req, res);
					}
				}

				res.statusCode = 404;
			}
		}
		else{
			res.statusCode = 404;
		}
		res.end();
	},
	
};