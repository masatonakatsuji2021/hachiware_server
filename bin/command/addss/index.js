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

	var addss = {};

	this.then(function(resolve){

		this.br();

		this.outn("** Create server settings **")
			.outn("Create a new server setting. Please answer the following questions.")
			.br(2)
		;

		if(args.getOpt("name")){
			addss.ssName = args.getOpt("name");

			if(addss.fileName.substring(-3) != ".js"){
				addss.ssName += ".js";
			}

			if(fs.existsSync(rootPath + "/" + addss.ssName)){
				if(fs.statSync(rootPath + "/" + addss.ssName).isDirectory()){
					this.color.redn("[WARM] ").outn("The same server section \"" + addss.ssName + "\" already exists.").br();
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

			addss.ssName = value;

			resolve();
		});

	}).then(function(resolve){

		if(args.getOpt("host")){
			addss.host = args.getOpt("host");
			return resolve();
		}

		this.in("Q. Enter the host name. (localhost)",function(value, retry){

			if(!value){
				value = "localhost";
			}

			addss.host = value;

			resolve();
		});

	}).then(function(resolve){

		if(args.getExists("ssl")){
			if(args.getOpt("ssl") == "false"){
				addss.ssl = false;
			}
			else{
				addss.ssl = true;
			}
			return resolve();
		}

		this.in("Q. SSL connection? [y/n] (n)", function(value){

			if(!value){
				value = "n";
			}

			value = value.toLowerCase();

			if(value == "y"){
				addss.ssl = true;
			}
			else{
				addss.ssl = false;
			}

			resolve();
		});

	}).then(function(resolve){

		if(!addss.ssl){
			return resolve();
		}
		
		addss.certificate = {};

		this.then(function(resolve2){

			if(args.getOpt("certkey")){
				addss.certificate.key = args.getOpt("certkey");
				return resolve2();
			}

			this.in("  Q. Specify the path of the private key file of the server certificate. (key/server.key)",function(value, retry){

				if(!value){
					value = "key/server.key";
				}
	
				addss.certificate.key = value;
	
				resolve2();
			});
	
		}).then(function(resolve2){

			if(args.getOpt("cert")){
				addss.certificate.cert = args.getOpt("cert");
				return resolve2();
			}

			this.in("  Q. Specify the path of the server certificate. (key/server.crt)",function(value, retry){

				if(!value){
					value = "key/server.crt";
				}
	
				addss.certificate.cert = value;
	
				resolve2();
			});

		}).then(function(){

			if(args.getOpt("ca")){
				addss.certificate.ca = args.getOpt("ca");
				return resolve();
			}

			this.in("  Q. Specify the CA intermediate certificate path of the server certificate if required. ()",function(value){

				addss.certificate.ca = value;
	
				resolve();
			});

		}).start();
		
	}).then(function(resolve){

		if(args.getOpt("port")){
			addss.port = args.getOpt("port");
			return resolve();
		}

		if(addss.ssl){
			var port = "443";
		}
		else{
			var port = "80";
		}

		this.in("Q. Enter the port number. (" + port + ")",function(value, retry){

			if(!value){
				value = port;
			}

			addss.port = value;

			resolve();
		});
		
	}).then(function(resolve){

		this.br();

		var outData = {
			"Server-Section Name" : addss.ssName.toString(),
			"SSL" : addss.ssl.toString(),
		};

		if(addss.ssl){
			outData["  SSL certificate key"] = addss.certificate.key;
			outData["  SSL certificate cert"] = addss.certificate.cert;
			if(addss.certificate.ca){
				outData["  SSL certificate CA"] = addss.certificate.ca;
			}
		}
		
		outData["host"] = addss.host;
		outData["port"] = addss.port;

		this.outData(outData,{
			fieldMaxLength:40,
			valueMaxLength:80,
		});

		this.br();

		this.outn("Create a server with the above contents.");

		this.in("Is it this ok? [y/n] (y)", function(value, retry){

			if(!value){
				value = "y";
			}

			if(value != "y"){
				this.br(2).outn("Cancel server creation.");
				return exitResolve();
			}

			var path = rootPath + "/" + addss.ssName;

			if(!fs.existsSync(path)){
				fs.mkdirSync(path);
			}

			var addssStr = require("./source.js");

			fs.writeFileSync(path + "/conf.js", addssStr(addss));

			this.br(2).outn("Completed server creation.");

			exitResolve();
		});

	}).start();

};