module.exports = function(init){

	var str="";

	str += "const { listen } = require(\"hachiware_server\"); \n\n";

	str += "listen({ \n\n";

	str += "	// server name \n";

	str += "	server_name: \"" + init.server_name + "\", \n\n";

	str += "	// ssl enable \n";

	str += "	ssl: " + init.ssl.toString() + ", \n\n";

	if(init.ssl){

		str += "	// ssl certificate \n";

		str += "	certificate: {\n";

		str += "		key: \"" + init.certificate.key + "\", \n";

		str += "		cert: \"" + init.certificate.cert + "\", \n";

		if(init.certificate.ca){
			str += "		ca: \"" + init.certificate.ca + "\", \n";
		}

		str += "	}, \n\n";

		str += "	// http/https combine.\n";
	
		str += "	combine: " + init.combine.toString() + ", \n\n";
	}

	str += "	// host \n ";

	str += "	host: \"" + init.host + "\", \n\n";

	str += "	// port number \n ";

	str += "	port: " + init.port + ", \n\n";

	str += "	// http Allow Half Open \n";

	str += "	httpAllowHalfOpen: " + init.httpAllowHalfOpen.toString() + ", \n\n";

	str += "	// error Console Output \n";

	str += "	errorConsoleOutput: " + init.errorConsoleOutput.toString() + ", \n\n";

	if(init.logs){

		str += "	// log setting \n";

		str += "	logs: { \n\n";

		if(init.logs.startup.enable){

			str += "		// server Start/End log \n";

			str += "		startup: { \n\n";

			str += "			// server Start/end enable \n";

			str += "			enable: " + init.logs.startup.enable.toString() + ", \n\n";

			str += "			// server Start/end write path \n";

			str += "			path: \"" + init.logs.startup.path + "\", \n\n";

			str += "			// server Start/end write contents format \n";

			str += "			contents: \"" + init.logs.startup.contents + "\", \n";

			str += "		}, \n\n";

		}

		if(init.logs.access.enable){
		
			str += "		// server access log \n";

			str += "		access: { \n\n";

			str += "			// server access enable \n";

			str += "			enable: " + init.logs.access.enable.toString() + ", \n\n";

			str += "			// server access write path \n";

			str += "			path: \"" + init.logs.access.path + "\", \n\n";

			str += "			// server access write contents format \n";

			str += "			contents: \"" + init.logs.access.contents + "\", \n";

			str += "		}, \n\n";
		}

		if(init.logs.error){

			str += "		// server error log \n";

			str += "		error: { \n\n";
		
			str += "			// server error enable \n";
		
			str += "			enable: " + init.logs.error.enable.toString() + ", \n\n";
		
			str += "			// server error write path \n";
		
			str += "			path: \"" + init.logs.error.path + "\", \n\n";
	
			str += "			// server error write contents format \n";

			str += "			contents: \"" + init.logs.error.contents + "\", \n";

			str += "		}, \n\n";
		}

		str += "	}, \n\n";
	}


	if(init.callbacks){
		str += "	// callbacks \n";
	
		str += "	callbacks: { \n\n";
	
		if(init.callbacks.access){

			if(init.callbacks.syncAccess){

				str += "		// access callback sync \n";

				str += "		syncAccess: true, \n\n";

				str += "		// access callback \n";

				str += "		access: function(resolve, data){ \n";
	
				str += "\n";
					
				str += "			data.res.write(\"<h1>Welcome Hachiware Server</h1>\"); \n\n";
					
				str += "			data.res.write(\"<p>Currently displaying test text.</p>\"); \n\n";

				str += "			// Be sure to execute the solution.\n";

				str += "			resolve(); \n";

				str += "		}, \n\n";	
	
			}
			else{

				str += "		// access callback \n";

				str += "		access: function(data){ \n";
	
				str += "\n";
					
				str += "			data.res.write(\"<h1>Welcome Hachiware Server</h1>\"); \n\n";
					
				str += "			data.res.write(\"<p>Currently displaying test text.</p>\"); \n";
					
				str += "		}, \n";	
	
			}
		}
		if(init.callbacks.error){

			if(init.callbacks.syncError){

				str += "		// error callback sync \n";

				str += "		syncError: true, \n\n";

				str += "		// error callback \n";

				str += "		error: function(resolve, error, data){ \n";
	
				str += "\n";
					
				str += "			data.res.write(\"<h1>Server Error</h1>\"); \n\n";
				
				str += "			// error output \n";

				str += "			data.res.write(error.toString()); \n\n";

				str += "			// Be sure to execute the solution.\n";

				str += "			resolve(); \n";

				str += "		}, \n";	
	
			}
			else{

				str += "		// error callback \n";

				str += "		error: function(error, data){ \n";

				str += "\n";
					
				str += "			data.res.write(\"<h1>Server Error</h1>\"); \n\n";

				str += "			data.res.write(error.toString()); \n";
					
				str += "		}, \n";	
			}
		}

		str += "	}, \n";
	}






	str += "});"

	return str;
};
/*
{
	server_name: 'server_01',
	ssl: true,
	certificate: {
		 key: 'server.key',
		 cert: 'server.crt'
	},
	combine: true,
	host: '',
	port: '443',
	httpAllowHalfOpen: true,
	errorConsoleOutput: true,
	logs:{
		startup:{
			 enable: true,
        	path: 'logs/startup/startup-{YYYY}.log',
        	contents:'[{DATETIME}] {MODE} {HOST}:{PORT} server_name = {SERVERNAME}'
		},
    	access:{
			 enable: true,
        	path: 'logs/access/access-{YYYY}-{MM}.log',
        	contents: '[{DATETIME}] {METHOD} {REQUEST_URL} {REMOTE_IP} {RESPONSE_CODE}' 
		},
    	error:{
			 enable: true,
        	path: 'logs/error/error-{YYYY}-{MM}.log',
        	contents: '[{DATETIME}] {METHOD} {REQUEST_URL} {REMOTE_IP} {RESPONSE_CODE} {ERROR_EXCEPTION} {ERROR_STACK}' 
		} 
	},
}
*/