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
const path = require("path");

module.exports = {
	
	/**
	 * each
	 * @param {*} resolve 
	 * @param {*} params 
	 * @param {*} req 
	 * @param {*} res 
	 * @returns 
	 */
	each: function(resolve, params, req, res){

		/**
		 * searchAssets
		 * @param {*} params 
		 * @param {*} requestUrl 
		 * @returns 
		 */
		const searchAssets = function(params, requestUrl){

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
		};

		/**
		 * loadFile
		 * @param {*} assets 
		 * @param {*} filePath 
		 * @param {*} req 
		 * @param {*} res 
		 */
		const loadFile = function(assets, filePath, req, res){

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
		};

		/**
		 * loadAssets
		 * @param {*} assets 
		 * @param {*} req 
		 * @param {*} res 
		 */
		const loadAssets = function(assets, req, res){
			var filePath = params.rootPath + "/" + assets.mount + req.url.replace(assets.url,"");

			res.statusCode = 200;

			if(fs.existsSync(filePath)){

				if(fs.statSync(filePath).isFile()){
					loadFile(assets, filePath, req, res);
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
							loadFile(assets, filePath, req, res);
						}
					}

					res.statusCode = 404;
				}
			}
			else{
				res.statusCode = 404;
			}
			res.end();
		};

		/**
		 * mime
		 * @param {*} assets 
		 * @param {*} extName 
		 * @returns 
		 */
		const mime = function(assets, extName){

			extName = extName.split(".").join("");
		
			var mimeList = {
					"txt":"text/plain",
					"jpg":"image/jpeg",
					"jpeg":"image/jpeg",
					"png":"image/png",
					"gif":"image/gif",
					"svg":"image/svg",
					"bmp":"image/bmp",
					"json":"text/json",
					"js":"text/javascript",
					"css":"text/css",
					"html":"text/html",
					"htm":"text/html",
			};
		
			if(assets.mimes){
				var colums = Object.keys(assets.mimes);
				for(var n = 0 ; n < colums.length ; n++){
					var type = colums[n];
					var mime = assets.mimes[type];
					mimeList[type] = mime;
				}
			}
		
			if(mimeList[extName]){
				return mimeList[extName];
			}
			else{
				return "text/plain";
			}
		};

		var assets = searchAssets(params, req.url);

		if(!assets){
			return resolve();
		}

		loadAssets(assets, req, res);
	}
};