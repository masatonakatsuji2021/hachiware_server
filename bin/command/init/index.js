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

const tool = require("hachiware_tool");
const fs = require("fs");

module.exports = function(rootPath, args, exitResolve){

	var init = {};

	this.then(function(resolve){

		this.br();

		this.outn("** Create server settings **")
			.outn("Create a new server setting. Please answer the following questions.")
			.br(2)
		;

		if(args.getOpt("name")){
			init.ssName = args.getOpt("name");

			if(init.fileName.substring(-3) != ".js"){
				init.ssName += ".js";
			}

			if(fs.existsSync(rootPath + "/" + init.ssName)){
				if(fs.statSync(rootPath + "/" + init.ssName).isDirectory()){
					this.color.redn("[WARM] ").outn("The same server section \"" + init.ssName + "\" already exists.").br();
				}
				else{
					return resolve();
				}
			}
			else{
				return resolve();
			}
		}

		var ssName = "";

		var existFile = fs.readdirSync(rootPath);
		var fileLen = existFile.length + 1;
		ssName = "sect_" + ("000" + fileLen).slice(-4);

		this.in("Q. Enter the server-section name (" + ssName  + ")", function(value, retry){

			if(!value){
				value = ssName;
			}

			if(fs.existsSync(rootPath + "/" + value)){
				if(fs.statSync(rootPath + "/" + value).isDirectory()){
					this.color.red("[WARM] ").outn("The same server section \"" + value + "\" already exists.").br();
					return retry();
				}
			}

			init.ssName = value;

			resolve();
		});

	}).then(function(resolve){

		if(args.getOpt("host")){
			init.host = args.getOpt("host");
			return resolve();
		}

		this.in("Q. Enter the host name. (localhost)",function(value, retry){

			if(!value){
				value = "localhost";
			}

			init.host = value;

			resolve();
		});

	}).then(function(resolve){

		if(args.getExists("ssl")){
			if(args.getOpt("ssl") == "false"){
				init.ssl = false;
			}
			else{
				init.ssl = true;
			}
			return resolve();
		}

		this.in("Q. SSL connection? [y/n] (n)", function(value){

			if(!value){
				value = "n";
			}

			value = value.toLowerCase();

			if(value == "y"){
				init.ssl = true;
			}
			else{
				init.ssl = false;
			}

			resolve();
		});

	}).then(function(resolve){

		if(!init.ssl){
			return resolve();
		}
		
		init.certificate = {};

		this.then(function(resolve2){

			if(args.getOpt("certkey")){
				init.certificate.key = args.getOpt("certkey");
				return resolve2();
			}

			this.in("  Q. Specify the path of the private key file of the server certificate. (key/server.key)",function(value, retry){

				if(!value){
					value = "key/server.key";
				}
	
				init.certificate.key = value;
	
				resolve2();
			});
	
		}).then(function(resolve2){

			if(args.getOpt("cert")){
				init.certificate.cert = args.getOpt("cert");
				return resolve2();
			}

			this.in("  Q. Specify the path of the server certificate. (key/server.crt)",function(value, retry){

				if(!value){
					value = "key/server.crt";
				}
	
				init.certificate.cert = value;
	
				resolve2();
			});

		}).then(function(){

			if(args.getOpt("ca")){
				init.certificate.ca = args.getOpt("ca");
				return resolve();
			}

			this.in("  Q. Specify the CA intermediate certificate path of the server certificate if required. ()",function(value){

				init.certificate.ca = value;
	
				resolve();
			});

		}).start();
		
	}).then(function(resolve){

		if(args.getOpt("port")){
			init.port = args.getOpt("port");
			return resolve();
		}

		if(init.ssl){
			var port = "443";
		}
		else{
			var port = "80";
		}

		this.in("Q. Enter the port number. (" + port + ")",function(value, retry){

			if(!value){
				value = port;
			}

			init.port = value;

			resolve();
		});
		
	}).then(function(resolve){

		this.br();

		var outData = {
			"Server-Section Name" : init.ssName.toString(),
			"SSL" : init.ssl.toString(),
		};

		if(init.ssl){
			outData["  SSL certificate key"] = init.certificate.key;
			outData["  SSL certificate cert"] = init.certificate.cert;
			if(init.certificate.ca){
				outData["  SSL certificate CA"] = init.certificate.ca;
			}
		}
		
		outData["host"] = init.host;
		outData["port"] = init.port;

		this.outData(outData,{
			fieldMaxLength:40,
			valueMaxLength:80,
		});

		this.br();

		this.outn("Create a server with the above contents.");

		this.in("Q. Is it OK? [y/n] (y)", function(value, retry){

			if(!value){
				value = "y";
			}

			if(value != "y"){
				this.br(2).outn("Cancel server creation.");
				return exitResolve();
			}

			var path = rootPath + "/" + init.ssName;

			if(!fs.existsSync(path)){
				fs.mkdirSync(path);
			}

			var initStr = require("./source.js");

			fs.writeFileSync(path + "/conf.js", initStr(init));

			this.br(2).outn("Completed server creation.");

			exitResolve();
		});

	}).start();

};