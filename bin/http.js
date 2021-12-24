const http = require("http");
const log = require("./log.js");
const server = require("./server.js");

module.exports = function(port, params){

	var h = http.createServer(function(req,res){

		var decisionParam = null;

		for(var n = 0 ; n < params.length ; n++){
			var p_ = params[n];

			var host = p_.host;

			if(port != 80){
				host += ":" + port;
			}

			if(
				req.headers.host === host
			){
				decisionParam = p_;
				break;
			}
		}

		if(!decisionParam){
			res.statusCode = 404;
			res.end();
			return;
		}
	
		server.bind(this)(decisionParam, req, res);
	});
	
	h.httpAllowHalfOpen = true;
	
	console.log(port);

	h.listen(port);

	// log.writeStartUp(true);
};