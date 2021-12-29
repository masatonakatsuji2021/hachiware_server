const tool = require("hachiware_tool");
const fs = require("fs");

module.exports = function(rootPath, exitResolve){

	var init = {};

	this.then(function(resolve){

		this.br();

		this.outn("** Create server settings **")
			.outn("Create a new server setting. Please answer the following questions.")
			.br(2)
		;

		var confDefFileName = "";

		if(fs.existsSync(rootPath + "/conf")){
			var existFile = fs.readdirSync(rootPath + "/conf");
			var fileLen = existFile.length + 1;
			confDefFileName = "conf_" + fileLen + ".js";
		}
		else{
			confDefFileName = "conf.js";
		}

		this.in("Q. Enter the configuration file name (" + confDefFileName  + ")", function(value, retry){

			if(!value){
				value = confDefFileName;
			}

			init.fileName = value;

			resolve();
		});

	}).then(function(resolve){

		this.in("Q. Enter the host name. (localhost)",function(value, retry){

			if(!value){
				value = "localhost";
			}

			init.host = value;

			resolve();
		});

	}).then(function(resolve){

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

		this.in("  Q. Specify the path of the private key file of the server certificate. (key/server.key)",function(value, retry){

			if(!value){
				value = "key/server.key";
			}

			init.certificate = {
				key: value,
			};

			resolve();
		});

	}).then(function(resolve){

		if(!init.ssl){
			return resolve();
		}
		this.in("  Q. Specify the path of the server certificate. (key/server.crt)",function(value, retry){

			if(!value){
				value = "key/server.crt";
			}

			init.certificate.cert = value;

			resolve();
		});

	}).then(function(resolve){
		
		if(!init.ssl){
			return resolve();
		}
		this.in("  Q. Specify the CA intermediate certificate path of the server certificate if required. ()",function(value){

			init.certificate.ca = value;

			resolve();
		});
		
	}).then(function(resolve){

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

		this.in("Q. Add Log output. [y/n] (y)", function(value){

			if(!value){
				value = "y";
			}

			value = value.toLowerCase();

			if(value == "y"){
				init.logs = true;
			}
			else{
				init.logs = false;
			}

			resolve();
		});

	}).then(function(resolve){

		this.in("Q. Add Callback function. [y/n] (y)", function(value){

			if(!value){
				value = "y";
			}

			value = value.toLowerCase();

			if(value == "y"){
				init.callbacks = true;
			}
			else{
				init.callbacks = false;
			}

			resolve();
		});

	}).then(function(resolve){

		this.in("Q. Use more modules? [y/n] (n)",function(value){

			if(!value){
				value = "n";
			}

			value = value.toLowerCase();

			if(value == "y"){
				init.options = true;
			}
			else{
				init.options = false;
			}

			resolve();
		});

	}).then(function(resolve){

		if(!init.options){
			return resolve();
		}

		this.then(function(resolve2){

			this.in("  Q. Use \"filtering\" module? [y/n] (n)", function(value){

				if(!value){
					value = "n";
				}
	
				value = value.toLowerCase();
	
				if(value == "y"){
					init.module_filtering = true;
				}
				else{
					init.module_filtering = false;
				}
	
				resolve2();
			});

		}).then(function(resolve2){

			this.in("  Q. Use \"basicAuth\" module? [y/n] (n)", function(value){

				if(!value){
					value = "n";
				}
	
				value = value.toLowerCase();
	
				if(value == "y"){
					init.module_basicauth = true;
				}
				else{
					init.module_basicauth = false;
				}
	
				resolve2();
			});

		}).then(function(resolve2){

			this.in("  Q. Use \"publics\" module? [y/n] (n)", function(value){

				if(!value){
					value = "n";
				}
	
				value = value.toLowerCase();
	
				if(value == "y"){
					init.module_publics = true;
				}
				else{
					init.module_publics = false;
				}
	
				resolve2();
			});

		}).then(function(resolve2){

			this.in("  Q. Use \"request\" module? [y/n] (n)", function(value){

				if(!value){
					value = "n";
				}
	
				value = value.toLowerCase();
	
				if(value == "y"){
					init.module_request = true;
				}
				else{
					init.module_request = false;
				}
	
				resolve2();
			});

		}).then(function(){

			this.in("  Q. Use \"proxy\" module? [y/n] (n)", function(value){

				if(!value){
					value = "n";
				}
	
				value = value.toLowerCase();
	
				if(value == "y"){
					init.module_proxy = true;
				}
				else{
					init.module_proxy = false;
				}
	
				resolve();
			});

		}).start();


	}).then(function(resolve){

		this.br();

		var outData = {
			"conf File Name" : init.fileName.toString(),
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
		outData["Log Output"] = init.logs.toString();
		outData["Callbacks function"] = init.callbacks.toString();

		if(init.options){
			outData["Use MModule"] = {};

			outData["Use MModule"]["filtering"] = init.module_filtering;
			outData["Use MModule"]["basicAuth"] = init.module_basicauth;
			outData["Use MModule"]["publics"] = init.module_publics;
			outData["Use MModule"]["request"] = init.module_request;
			outData["Use MModule"]["proxy"] = init.module_proxy;
		}

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

			var path = rootPath + "/conf";

			if(!fs.existsSync(path)){
				fs.mkdirSync(path);
			}

			var initStr = require("./cmd_init_source.js");

			fs.writeFileSync(path + "/" + init.fileName, initStr(init));

			this.br(2).outn("Completed server creation.");

			exitResolve();
		});

	}).start();

};