const http = require("http");
const log = require("./log.js");
const server = require("./server.js");

module.exports = function(port, params){

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
	
		server.bind(this)(decisionParam, req, res);
	});
	
	h.httpAllowHalfOpen = true;
	
	h.listen(port);

	// log.writeStartUp(true);
};