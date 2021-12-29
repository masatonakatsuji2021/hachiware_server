module.exports = function(init){

	var str="";

	str += "// server configure \n";

	str += "module.exports = { \n\n";

	str += "	host: \"" + init.host + "\", // <= host name \n\n";

	str += "	ssl: " + init.ssl.toString() + ", // <= ssl enable (true/false) \n\n";

	if(init.ssl){
		
		str += "	certificate: {  // <= ssl certificate \n";

		str += "		key: \"" + init.certificate.key + "\", // <= certificate key \n";

		str += "		cert: \"" + init.certificate.cert + "\",  // <= certificate cert \n";

		if(init.certificate.ca){
			str += "		ca: \"" + init.certificate.ca + "\", // <= certificate CA cert \n";
		}

		str += "	}, \n\n";
	}

	str += "	port: " + init.port + ",  // <= port number \n\n";

	str += "	errorConsoleOutput: true, // <= error Console Output \n\n";

	if(init.logs){

		str += "	logs: {  // <= log setting \n";
	
		str += "		startup: { 	// <= server Start/End log \n";
		
		str += "			enable: true, // <= server Start/end enable \n";
		
		str += "			path: \"logs/startup/startup-{YYYY}.log\", // <= server Start/end write path \n";
		
		str += "			contents: \"[{DATETIME}] {MODE} {HOST}:{PORT} URL= {LISTEN_URI} CONF= {CONF_FILE}\", // <= server Start/end write contents format\n";
		
		str += "		}, \n";
		
		str += "		access: {  // <= server access log \n";
		
		str += "			enable: true, // <= server access enable \n";
		
		str += "			path: \"logs/access/access-{YYYY}-{MM}.log\", // <= server access write path \n";
		
		str += "			contents: \"[{DATETIME}] {METHOD} {REQUEST_URL} {REMOTE_IP} {RESPONSE_CODE}\", // <= server access write contents format\n";
		
		str += "		}, \n";
	
		str += "		error: {  // <= server error log \n";
				
		str += "			enable: true, // <= server error enable \n";
						
		str += "			path: \"logs/error/error-{YYYY}-{MM}.log\", // <= server error write path \n";
			
		str += "			contents: \"[{DATETIME}] {METHOD} {REQUEST_URL} {REMOTE_IP} {RESPONSE_CODE} {ERROR_STACK}\", // <= server error write contents format \n";
		
		str += "		}, \n";
		
		str += "	}, \n\n";
		
	}

	if(init.callbacks){

		str += "	callbacks: { // <= callbacks \n";
	
		str += "		syncAccess: true, // <= access callback sync \n";

		str += "		access: function(resolve, data){ // <= access callback \n\n";
			
		str += "			data.res.write(\"<h1>Welcome Hachiware Server</h1>\"); \n";
					
		str += "			data.res.write(\"<p>Currently displaying test text.</p>\"); \n\n";

		str += "			resolve(); // <= Be sure to execute the solution.\n";

		str += "		}, \n\n";	
	
		str += "		syncError: true, // <= error callback sync \n";

		str += "		error: function(resolve, error, data){ // <= error callback \n\n";
	
		str += "			data.res.write(\"<h1>Server Error</h1>\"); \n\n";
				
		str += "			data.res.write(error.toString()); // <= error output \n\n";

		str += "			resolve(); // <= Be sure to execute the solution. \n";

		str += "		}, \n";	
	
		str += "	}, \n\n";

	}

	if(init.options){

		str += "	modules: [ // <= use modules list \n";

		if(init.module_filtering){
			str += "		\"filtering\", \n";
		}
		
		if(init.module_basicauth){
			str += "		\"basicAuth\", \n";
		}

		if(init.module_publics){
			str += "		\"publics\", \n";
		}

		if(init.module_request){
			str += "		\"request\", \n";
		}

		if(init.module_proxy){
			str += "		\"proxy\", \n";
		}

		str += "	], \n\n";

		if(init.module_filtering){

			str += "	filtering: { // <= request filtering \n";
	
			str += "		mode: \"block\", // <= accpet/block \n";
				
			str += "		address: [ // <= accept/block ip address list \n";
			
			str += "			\"52.195.22.312\", \n";
			
			str += "		], \n";
			
			str += "	}, \n\n";
	
		}
	
		if(init.module_basicauth){
	
			str += "	basicAuth: {  // <= basic Authoricate \n";
	
			str += "		username: \"admin\", // <= user name \n";
	
			str += "		password: \"12345\", // <= password \n";
	
			str += "		onFailed: function(res){ // <= on failed callback \n";
	
			str += "			res.write(\"......orz....\"); \n";
	
			str += "			res.end(); \n";
	
			str += "		}, \n";
	
			str += "	}, \n\n";
	
		}
	
		if(init.module_publics){
	
			str += "	assets: [ // <= public area setting \n";
	
			str += "		{ \n";
			
			str += "			url: \"/assets\", // <= public url \n",
			
			str += "			mount: \"/publics\", // <= public mount directory path  \n",
			
			str += "			headers: { // <= public file access response headers \n";
	
			str += "				name:\"Hachiware Server\", \n";
	
			str += "				\"Cache-Control\":\"max-age=31536000\", \n";
	
			str += "			}, \n";
	
			str += "			indexed: [ // <= public area indexed file \n";
			
			str += "				\"index.html\", \n";
	
			str += "			],\n";
	
			str += "		}, \n";
	
			str += "	], \n\n";
	
		}
	
		if(init.module_proxy){
	
			str += "	proxy: { // <= proxy setting \n";
	
			str += "		\"/page_a\" : \"http://localhost:1000\", \n";
	
			str += "		\"/page_b\" : \"http://localhost:1001\", \n";
	
			str += "	}, \n\n"
	
		}
	
	}

	str += "};"

	return str;
};