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

module.exports = function(resolve, params, req, res){

	const failed = function(basicAuth, res){
		res.statusCode = 401;
		res.setHeader("server","hachiware server");
		basicAuth.onFailed(res);
	};

	if(!params.basicAuth){
		return resolve();
	}

	var basicAuth = params.basicAuth;

	if(!basicAuth.name){
		basicAuth.name = "Basic realm=\"SECRET AREA\"";
	}

	res.setHeader("WWW-Authenticate",basicAuth.name);

	if(!basicAuth.onFailed){
		basicAuth.onFailed = function(res){
			res.write("Authentication failure");
			res.end();
		};
	}

	if(!req.headers.authorization){
		return failed(basicAuth, res);
	}

	var auth = req.headers.authorization;

	if(auth.indexOf("Basic ") !== 0){
		return failed(basicAuth, res);
	}
	auth = auth.replace("Basic ","");
	auth = tool.base64Decode(auth);
	auth = auth.split(":");


	if(!(
		auth[0] == basicAuth.username &&
		auth[1] == basicAuth.password
	)){
		return failed(basicAuth, res);
	}

	resolve();
};