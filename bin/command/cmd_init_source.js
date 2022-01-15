module.exports = function(init){

	var str="";

	str += "// server configure \n";

	str += "module.exports = { \n\n";

	str += "	// host name \n";

	str += "	host: \"" + init.host + "\", \n\n";

	str += "	// SSL enable (true/false) \n";

	str += "	ssl: " + init.ssl.toString() + ", \n\n";

	if(init.ssl){
		
		str += "	// SSL certificate \n";

		str += "	certificate: {  \n\n";
		
		str += "		// certificate key \n";

		str += "		key: \"" + init.certificate.key + "\", \n\n";

		str += "		// certificate cert \n";

		str += "		cert: \"" + init.certificate.cert + "\", \n\n";

		if(init.certificate.ca){
			str += "		// certificate CA certs \n";

			str += "		ca: \"" + init.certificate.ca + "\", \n\n";
		}

		str += "	}, \n\n";
	}

	str += "	// Port Number \n";

	str += "	port: " + init.port + ",  \n\n";

	str += "	// error Console Output flg \n";

	str += "	errorConsoleOutput: true, \n\n";

	str += "	// Welcome To Page HTML \n";

	str += "	// welcomeToPage: \"conf/welcome.html\", \n\n";

	if(init.callbacks){

		str += "	// Callbacks \n";

		str += "	callbacks: { \n\n";

		str += "		// Access Callback \n";

		str += "		access: function(req, res){ \n\n";
			
		str += "			res.write(\"<h1>Welcome Hachiware Server</h1>\"); \n";
					
		str += "			res.write(\"<p>Currently displaying test text.</p>\"); \n";

		str += "			res.end(); \n";

		str += "		}, \n\n";

		str += "		// error callback \n";

		str += "		error: function(error, req, res){ \n\n";
	
		str += "			data.res.write(\"<h1>Server Error</h1>\"); \n";
				
		str += "			data.res.write(error.toString()); // <= error output \n";

		str += "			res.end(); \n";

		str += "		}, \n";	
	
		str += "	}, \n\n";

	}

	/*
	if(init.options){

		str += "	// Use Modules List \n";

		str += "	modules: [ \n";

		if(init.module_logs){
			str += "		\"logs\", \n";
		}

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

		if(init.module_logs){

			str += "	// Log Output Setting \n";

			str += "	logs: { \n\n";
		
			str += "		// Server Start/End Write Log \n";

			str += "		startup: { \n\n";
			
			str += "			// Server Start/end Write Log Enable \n";

			str += "			enable: true, \n\n";
			
			str += "			// server Start/end write path \n";

			str += "			path: \"logs/startup/startup-{YYYY}.log\", \n\n";
			
			str += "			// Server Start/end Write Contents Format \n";

			str += "			contents: \"[{DATETIME}] {MODE} {HOST}:{PORT} URL= {LISTEN_URI} CONF= {CONF_FILE}\", \n";
			
			str += "		}, \n";
			
			str += "		 // Server Access Write Log \n";

			str += "		access: { \n\n";
			
			str += "			// Server Access Write Log Enable \n";

			str += "			enable: true, \n";
			
			str += "			// Server Access Write Path \n";

			str += "			path: \"logs/access/access-{YYYY}-{MM}.log\", \n\n";
			
			str += "			// Server Access Write Contents Format \n";

			str += "			contents: \"[{DATETIME}] {METHOD} {REQUEST_URL} {REMOTE_IP} {RESPONSE_CODE}\", \n\n";
			
			str += "		}, \n";
		
			str += "		// Server Error Write Log \n";

			str += "		error: { \n";
					
			str += "			// Server Error Write Log Enable \n";

			str += "			enable: true, \n\n";
							
			str += "			// Server Error Write Path \n";

			str += "			path: \"logs/error/error-{YYYY}-{MM}.log\", \n\n";
				
			str += "			// Server Error Write Contents Format \n";

			str += "			contents: \"[{DATETIME}] {METHOD} {REQUEST_URL} {REMOTE_IP} {RESPONSE_CODE} {ERROR_STACK}\", \n\n";
			
			str += "		}, \n";
			
			str += "	}, \n\n";
			
		}

		if(init.module_filtering){

			str += "	// Request Filtering \n";

			str += "	filtering: { \n";
	
			str += "		// Mode (accpet/block) \n";
			
			str += "		mode: \"block\", \n";
				
			str += "		// accept/block IP Address List \n";

			str += "		address: [ \n";
			
			str += "			\"52.195.22.312\", \n";
			
			str += "		], \n";
			
			str += "	}, \n\n";
	
		}
	
		if(init.module_basicauth){
	
			str += "	// Basic Authoricate \n";

			str += "	basicAuth: { \n\n";
	
			str += "		// User Name \n";

			str += "		username: \"admin\",  \n";
	
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

		if(init.framework){


			
		}

	}

		*/
	str += "};"

	return str;
};