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

		this.in("  Q. Enter the host name (domain). (localhost)",function(value, retry){

			if(!value){
				value = "localhost";
			}

			init.host = value;

			resolve();
		});

	}).then(function(resolve){

		this.in("  Q. SSL connection? [y/n] (n)", function(value){

			if(!value){
				value = "N";
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

		this.in("    Q. Specify the path of the private key file of the server certificate. (server.key)",function(value, retry){

			if(!value){
				value = "server.key";
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
		this.in("    Q. Specify the path of the server certificate. (server.crt)",function(value, retry){

			if(!value){
				value = "server.crt";
			}

			init.certificate.cert = value;

			resolve();
		});

	}).then(function(resolve){
		
		if(!init.ssl){
			return resolve();
		}
		this.in("    Q. Specify the CA intermediate certificate path of the server certificate if required. ()",function(value){

			if(value){
				init.certificate.ca = value;
			}

			resolve();
		});

	}).then(function(resolve){

		if(!init.ssl){
			return resolve();
		}

		this.in("    Q. Combined with http connection? [y/n] (y)",function(value){

			if(!value){
				value = "y";
			}

			value = value.toLowerCase();

			if(value == "y"){
				init.combine = true;
			}
			else{
				init.combine = false;
			}

			resolve();
		});
		
	}).then(function(resolve){

		if(init.ssl){
			var port = "443";
		}
		else{
			var port = "80";
		}

		this.in("  Q. Enter the port number. (" + port + ")",function(value, retry){

			if(!value){
				value = port;
			}

			init.port = value;

			resolve();
		});

	}).then(function(resolve){

		this.in("  Q. Prepare a directory area where files can be published? [y/n] (n)",function(value, retry){

			if(!value){
				value = "n";
			}

			value = value.toLowerCase();

			if(value == "y"){
				init.assets = {};
			}

			resolve();
		});

	}).then(function(resolve){

		if(!init.assets){
			return resolve();
		}

		this.in("    Q. Specify the URL for publishing the file (after the host name). (/assets)",function(value, retry){

			if(!value){
				value = "/assets";
			}

			init.assets.url = value;

			resolve();
		});

	}).then(function(resolve){

		if(!init.assets){
			return resolve();
		}

		this.in("    Q. Specify the mount path for publishing the file. (/assets)",function(value, retry){

			if(!value){
				value = "/assets";
			}

			init.assets.mount = value;

			resolve();
		});

	}).then(function(resolve){

		this.in("  Q. Do you want the server to be able to start permanently in the event of an error? [y/n] (y)",function(value, retry){

			if(!value){
				value = "y";
			}

			value = value.toLowerCase();

			if(value == "y"){
				init.httpAllowHalfOpen = true;
			}
			else{
				init.httpAllowHalfOpen = false;
			}

			resolve();
		});

	}).then(function(resolve){

		this.in("  Q. Display the log on the console? [y/n] (y)",function(value, retry){

			if(!value){
				value = "y";
			}

			value = value.toLowerCase();

			if(value == "y"){
				init.errorConsoleOutput = true;
			}
			else{
				init.errorConsoleOutput = false;
			}
			
			resolve();
		});

	}).then(function(resolve){

		this.in("  Q. Output server start/end log? [y/n] (y)",function(value, retry){

			if(!value){
				value = "y";
			}

			value = value.toLowerCase();

			if(value == "y"){

				if(!init.logs){
					init.logs = {};
				}

				init.logs.startup = {
					enable: true,
				};
			}
			
			resolve();
		});

	}).then(function(resolve){

		if(!tool.objExists(init, "logs.startup")){
			return resolve();
		}

		this.in("    Q. Specify the output destination path of the server start/end log (logs/startup/startup-{YYYY}.log)",function(value, retry){

			if(!value){
				value = "logs/startup/startup-{YYYY}.log";
			}

			init.logs.startup.path = value;
			
			resolve();
		});

	}).then(function(resolve){

		if(!tool.objExists(init, "logs.startup")){
			return resolve();
		}

		this.in("    Q. Specify the output content format of the server start/end log ([{DATETIME}] {MODE} {HOST}:{PORT} server_name = {SERVERNAME})",function(value, retry){

			if(!value){
				value = "[{DATETIME}] {MODE} {HOST}:{PORT} server_name = {SERVERNAME}";
			}

			init.logs.startup.contents = value;
			
			resolve();
		});

	}).then(function(resolve){

		this.in("  Q. Output access log? [y/n] (y)",function(value, retry){

			if(!value){
				value = "y";
			}

			value = value.toLowerCase();

			if(value == "y"){

				if(!init.logs){
					init.logs = {};
				}

				init.logs.access = {
					enable: true,
				};
			}
			
			resolve();
		});

	}).then(function(resolve){

		if(!tool.objExists(init, "logs.access")){
			return resolve();
		}

		this.in("    Q. Specify the output destination path of the access log. (logs/access/access-{YYYY}-{MM}.log)",function(value, retry){

			if(!value){
				value = "logs/access/access-{YYYY}-{MM}.log";
			}

			init.logs.access.path = value;
			
			resolve();
		});

	}).then(function(resolve){

		if(!tool.objExists(init, "logs.access")){
			return resolve();
		}

		this.in("    Q. Specify the output content format of the access log. ([{DATETIME}] {METHOD} {REQUEST_URL} {REMOTE_IP} {RESPONSE_CODE})",function(value, retry){

			if(!value){
				value = "[{DATETIME}] {METHOD} {REQUEST_URL} {REMOTE_IP} {RESPONSE_CODE}";
			}

			init.logs.access.contents = value;
			
			resolve();
		});

	}).then(function(resolve){

		this.in("  Q. Output error log? [y/n] (y)",function(value, retry){

			if(!value){
				value = "y";
			}

			value = value.toLowerCase();

			if(value == "y"){
				
				if(!init.logs){
					init.logs = {};
				}

				init.logs.error = {
					enable: true,
				};
			}
			
			resolve();
		});

	}).then(function(resolve){

		if(!tool.objExists(init, "logs.error")){
			return resolve();
		}

		this.in("    Q. Specify the output destination path of the error log. (logs/error/error-{YYYY}-{MM}.log)",function(value, retry){

			if(!value){
				value = "logs/error/error-{YYYY}-{MM}.log";
			}

			init.logs.error.path = value;
			
			resolve();
		});

	}).then(function(resolve){

		if(!tool.objExists(init, "logs.error")){
			return resolve();
		}

		this.in("    Q. Specify the output content format of the error log. ([{DATETIME}] {METHOD} {REQUEST_URL} {REMOTE_IP} {RESPONSE_CODE} {ERROR_EXCEPTION} {ERROR_STACK})",function(value, retry){

			if(!value){
				value = "[{DATETIME}] {METHOD} {REQUEST_URL} {REMOTE_IP} {RESPONSE_CODE} {ERROR_EXCEPTION} {ERROR_STACK}";
			}

			init.logs.error.contents = value;
			
			resolve();
		});

	}).then(function(resolve){

		this.in("  Q. Specify an access handling callback? [y/n] (y)",function(value, retry){

			if(!value){
				value = "y";
			}

			value = value.toLowerCase();

			if(value == "y"){

				if(!init.callbacks){
					init.callbacks = {};
				}

				init.callbacks.access = true;
			}
			
			resolve();
		});

	}).then(function(resolve){

		if(!tool.objExists(init, "callbacks.access")){
			return resolve();
		}

		this.in("    Q. Specify access handling callbacks for synchronization? [y/n] (y)",function(value, retry){

			if(!value){
				value = "y";
			}

			value = value.toLowerCase();

			if(value == "y"){
				init.callbacks.syncAccess = true;
			}
			
			resolve();
		});

	}).then(function(resolve){

		this.in("  Q. Specify an error handling callback? [y/n] (y)",function(value, retry){

			if(!value){
				value = "y";
			}

			value = value.toLowerCase();

			if(value == "y"){

				if(!init.callbacks){
					init.callbacks = {};
				}

				init.callbacks.error = true;
			}
			
			resolve();
		});

	}).then(function(resolve){

		if(!tool.objExists(init, "callbacks.error")){
			return resolve();
		}

		this.in("    Q. Specify error handling callbacks for synchronization? [y/n] (y)",function(value, retry){

			if(!value){
				value = "y";
			}

			value = value.toLowerCase();

			if(value == "y"){
				init.callbacks.syncError = true;
			}
			
			resolve();
		});

	}).then(function(resolve){

		this.br();

		var outData = {
			"Server Name" : init.server_name.toString(),
			"SSL" : init.ssl.toString(),
		};

		if(init.ssl){
			outData["  SSL certificate key"] = init.certificate.key;
			outData["  SSL certificate cert"] = init.certificate.cert;
			if(init.certificate.ca){
				outData["  SSL certificate CA"] = init.certificate.ca;
			}
			outData["  https/http combine"] = init.combine;
		}
		
		outData["host"] = init.host;
		outData["port"] = init.port;
		outData["http Allow Half Open"] = init.httpAllowHalfOpen;
		outData["Error Console Output"] = init.errorConsoleOutput;

		if(init.logs){
			if(init.logs.startup){
				if(init.logs.startup.enable){
					outData["Log StartUp"] = true;
					outData["  Log StartUp Path"] = init.logs.startup.path;
					outData["  Log StartUp contents"] = init.logs.startup.contents;
				}
				else{
					outData["Log StartUp Enable"] = false;
				}
			}

			if(init.logs.access){
				if(init.logs.access.enable){
					outData["Log Access"] = true;
					outData["  Log Access Path"] = init.logs.access.path;
					outData["  Log Access contents"] = init.logs.access.contents;
				}
				else{
					outData["Log Access Enable"] = false;
				}
			}

			if(init.logs.error){
				if(init.logs.error.enable){
					outData["Log Error"] = true;
					outData["  Log Error Path"] = init.logs.error.path;
					outData["  Log Error contents"] = init.logs.error.contents;
				}
				else{
					outData["Log Error Enable"] = false;
				}
			}
		}

		if(init.callbacks){
			if(init.callbacks.access){
				outData["Callback Access"] = true;
				if(init.callbacks.syncAccess){
					outData["Callback Access Sync"] = true;
				}
			}
			if(init.callbacks.error){
				outData["Callback Error"] = true;
				if(init.callbacks.syncError){
					outData["Callback Error Sync"] = true;
				}
			}
		}

		this.outData(outData,{
			fieldMaxLength:40,
			valueMaxLength:80,
		});

		this.br();

		this.in(" Create a server with the above contents. Is it OK? [y/n] (y)", function(value, retry){

			if(!value){
				value = "y";
			}

			if(value == "y"){

				var path = rootPath + "/" + init.server_name;

				fs.mkdirSync(path);

				var initStr = require("./cmd_init_source.js");

				fs.writeFileSync(path + "/index.js",initStr(init));

				this.br(2).outn("Completed server creation.");
			}
			else{
				this.br(2).outn("Cancel server creation.");

			}

			exitResolve();

		});

	}).start();

};