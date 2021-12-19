module.exports = function(assets, extName){

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