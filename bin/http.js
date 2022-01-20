/**
 * ====================================================================
 * Hachiware_Server
 * 
 * Web server application with Node.js
 * 
 * License : MIT License. 
 * Since   : 2021.12.25
 * Author  : Nakatsuji Masato 
 * GitHub  : https://github.com/masatonakatsuji2021/hachiware_server
 * npm     : https://www.npmjs.com/package/hachiware_server
 * ====================================================================
 */

const http = require("http");
const server = require("./server.js");

module.exports = function(port, params){

	var context = this;

	var h = http.createServer(function(req,res){

		var decisionParam = null;

		var targetHost = req.headers.host;

		for(var n = 0 ; n < params.length ; n++){
			var p_ = params[n];

			if(targetHost === p_._host){
				decisionParam = p_;
				break;
			}
		}

		if(!decisionParam){
			res.statusCode = 404;
			res.end();
			return;
		}
	
		server.bind(context)(decisionParam, req, res);
	});
	
	h.httpAllowHalfOpen = true;
	
	h.listen(port);

	for(var n = 0 ; n < params.length ; n++){
		var p_ = params[n];

		context.loadFookModule(p_, "start", [p_]);
	}
}; 