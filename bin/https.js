/**
 * ====================================================================
 * Hachiware_Server
 * 
 * Web server application with Node.js
 * 
 * Author : Nakatsuji Masato 
 * ====================================================================
 */

const https = require("https");
const log = require("./log.js");
const server = require("./server.js");
const fs = require('fs');
const tls = require("tls");

module.exports = function(port, params){

	var cetificates = {};

	try{
		
		var cetf_ = {};

		for(var n = 0 ; n < params.length ; n++){
			var p_ = params[n];

			if(!p_.certificate){
				throw Error("Insufficient server certificate information for SSL connection.");
			}
	
			if(!p_.certificate.key){
				throw Error("Insufficient private key information in server certificate for SSL connection.");
			}
	
			if(
				!fs.existsSync(p_.rootPath + "/" + p_.certificate.key) ||
				!fs.statSync(p_.rootPath + "/" + p_.certificate.key).isFile()
			){
				throw Error("Private key file for the specified server certificate does not exist. \"" + p_.rootPath + "/" + p_.certificate.key + "\"");
			}

			cetf_.key = fs.readFileSync(p_.rootPath + "/" + p_.certificate.key);

			if(!p_.certificate.cert){
				throw Error("Insufficient certificate information in server certificate for SSL connection.");
			}
			if(
				!fs.existsSync(p_.rootPath + "/" + p_.certificate.cert) ||
				!fs.statSync(p_.rootPath + "/" + p_.certificate.cert).isFile()
			){
				throw Error("certificate file for the specified server certificate does not exist. \"" + p_.rootPath + "/" + p_.certificate.cert + "\"");
			}

			cetf_.cert = fs.readFileSync(p_.rootPath + "/" + p_.certificate.cert);

			if(p_.certificate.ca){

				if(typeof p_.certificate.ca == "string"){
					p_.certificate.ca = [p_.certificate.ca];
				}

				cetf_.ca = [];

				for(var n2 = 0 ; n2 < p_.certificate.ca.length ; n2++){
					var ca = p_.certificate.ca[n2];

					if(
						!fs.existsSync(p_.rootPath + "/" + ca) ||
						!fs.statSync(p_.rootPath + "/" + ca).isFile()
					){
						throw Error("The intermediate CA certificate file for the specified server certificate does not exist. \"" + p_.rootPath + "/" + ca + "\"");
					}
	
					cetf_.ca.push(fs.readFileSync(p_.rootPath + "/" + ca));
				}
			}

			cetificates[p_._host] = cetf_;
		}

	}catch(error){
		console.log(error);
		process.exit();
	}

	var options = {
		SNICallback: function(hostName, cb){

			var opt = null;
			if(cetificates[hostName]){
				opt = cetificates[hostName];
			}

			if(!opt){
				return;
			}

			var ctx = tls.createSecureContext(opt) ;
			cb(null, ctx);
		},
	};

	var hs = https.createServer(options, function(req,res){

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

	hs.httpAllowHalfOpen = true;

	hs.listen(port);

	for(var n = 0 ; n < params.length ; n++){
		var p_ = params[n];
		log.writeStartUp(true, p_);
	}
};