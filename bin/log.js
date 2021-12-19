const fs = require("fs");
const tool = require("hachiware_tool");

module.exports = {

	/**
	 * defaultConvertLogPath
	 * @param {*} logPath 
	 * @param {*} date 
	 * @returns 
	 */
	defaultConvertLogPath: function(logPath, date){

		logPath = logPath.replace("{YYYY}", tool.getDateFormat("{YYYY}",date));
		logPath = logPath.replace("{MM}", tool.getDateFormat("{MM}",date));
		logPath = logPath.replace("{M}", tool.getDateFormat("{M}",date));
		logPath = logPath.replace("{DD}", tool.getDateFormat("{DD}",date));
		logPath = logPath.replace("{D}", tool.getDateFormat("{D}",date));
		logPath = logPath.replace("{HH}", tool.getDateFormat("{HH}",date));
		logPath = logPath.replace("{H}", tool.getDateFormat("{H}",date));
		logPath = logPath.replace("{mm}", tool.getDateFormat("{mm}",date));
		logPath = logPath.replace("{m}", tool.getDateFormat("{m}",date));
		logPath = logPath.replace("{ss}", tool.getDateFormat("{ss}",date));
		logPath = logPath.replace("{s}", tool.getDateFormat("{s}",date));

		return logPath;
	},

	/**
	 * defaultConvertContents
	 * @param {*} contents 
	 * @param {*} date 
	 * @returns 
	 */
	defaultConvertContents: function(contents, date){

		contents = contents.replace("{DATETIME}",tool.getDateFormat("{DATETIME}", date));
		contents = contents.replace("{DATE}",tool.getDateFormat("{DATE}", date));
		contents = contents.replace("{TIME}",tool.getDateFormat("{TIME}", date));
		contents = contents.replace("{YYYY}", tool.getDateFormat("{YYYY}",date));
		contents = contents.replace("{MM}", tool.getDateFormat("{MM}",date));
		contents = contents.replace("{M}", tool.getDateFormat("{M}",date));
		contents = contents.replace("{DD}", tool.getDateFormat("{DD}",date));
		contents = contents.replace("{D}", tool.getDateFormat("{D}",date));
		contents = contents.replace("{HH}", tool.getDateFormat("{HH}",date));
		contents = contents.replace("{H}", tool.getDateFormat("{H}",date));
		contents = contents.replace("{mm}", tool.getDateFormat("{mm}",date));
		contents = contents.replace("{m}", tool.getDateFormat("{m}",date));
		contents = contents.replace("{ss}", tool.getDateFormat("{ss}",date));
		contents = contents.replace("{s}", tool.getDateFormat("{s}",date));

		return contents;
	},

	/**
	 * defaultMkDir
	 * @param {*} logPath 
	 */
	defaultMkDir: function(logPath){

		if(!fs.existsSync(logPath)){
			var logDirs = logPath.split("/");

			if(logDirs.length > 1){
				var _dirPath = "";
				for(var n = 0 ; n < logDirs.length - 1 ; n++){
					_dirPath += logDirs[n] + "/";
					try{
						fs.mkdirSync(_dirPath);						
					}catch(err){}
				}	
			}	
		}

	},

	/**
	 * writeStartUp
	 * @param {*} mode 
	 * @param {*} params 
	 * @returns 
	 */
	writeStartUp: function(mode, params){

		if(!tool.objExists(params,"logs.startUp")){
			return;
		}

		if(!params.logs.startUp.enable){
			return;
		}

		var logPath = "logs/logs/startup/startup.log";
		var contents = "[{DATETIME}] MODE={MODE} HOST={HOST} PORT={PORT} SERVER_NAME={SERVERNAME}";

		if(params.logs.startUp.path){
			logPath = params.logs.startUp.path;
		}
		if(params.logs.startUp.contents){
			contents = params.logs.startUp.contents;
		}

		logPath = this.defaultConvertLogPath(logPath);
		contents = this.defaultConvertContents(contents);

		this.defaultMkDir(logPath);

		if(mode){
			mode = "OPEN";			
		}
		else{
			mode = "CLOSE";
		}
		var host = params.host;
		var port = params.port;
		var serverName = params.server_name;
		var httpAllowHalfOpen = params.httpAllowHalfOpen;

		contents = contents.replace("{MODE}", mode);
		contents = contents.replace("{HOST}", host);
		contents = contents.replace("{PORT}", port);
		contents = contents.replace("{SERVERNAME}", serverName);
		contents = contents.replace("{HTTPALLOWHALFOPEN}", httpAllowHalfOpen.toString());

		fs.appendFileSync(logPath, contents + "\n");
	},

	/**
	 * writeAccess
	 * @param {*} params 
	 * @param {*} req 
	 * @param {*} res 
	 */
	writeAccess: function(params, req, res){

		if(!tool.objExists(params,"logs.access")){
			return;
		}

		if(!params.logs.access.enable){
			return;
		}

		var logPath = "logs/access/access-{YYYY}-{MM}.log";
		var contents = "[{DATETIME}] METHOD={METHOD} REQUEST_URI={REQUEST_URL} REMOTE_IP={REMOTE_IP} RESPONSE_CODE={RESPONSE_CODE}";

		if(params.logs.access.path){
			logPath = params.logs.access.path;
		}
		if(params.logs.access.contents){
			contents = params.logs.access.contents;
		}

		logPath = this.defaultConvertLogPath(logPath);
		contents = this.defaultConvertContents(contents);

		this.defaultMkDir(logPath);

		var method = req.method;
		var requestUrl = req.url;
		var responseCode = res.statusCode;
		var remoteIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

		contents = contents.replace("{METHOD}", method);
		contents = contents.replace("{REQUEST_URL}", requestUrl);
		contents = contents.replace("{RESPONSE_CODE}", responseCode);
		contents = contents.replace("{REMOTE_IP}", remoteIp);

		fs.appendFileSync(logPath, contents + "\n");
	},

	/**
	 * writeError
	 * @param {*} errorException 
	 * @param {*} params 
	 * @param {*} req 
	 * @param {*} res 
	 */
	writeError: function(errorException, params, req, res){

		if(!tool.objExists(params,"logs.error")){
			return;
		}

		if(!params.logs.error.enable){
			return;
		}

		var logPath = "logs/error/error-{YYYY}-{MM}.log";
		var contents = "[{DATETIME}] METHOD={METHOD} REQUEST_URI={REQUEST_URL} REMOTE_IP={REMOTE_IP} RESPONSE_CODE={RESPONSE_CODE} ERROR_EXP={ERROR_EXCEPTION} ERROR_STACK={ERROR_STACK}";

		if(params.logs.error.path){
			logPath = params.logs.error.path;
		}
		if(params.logs.error.contents){
			contents = params.logs.error.contents;
		}

		logPath = this.defaultConvertLogPath(logPath);
		contents = this.defaultConvertContents(contents);

		this.defaultMkDir(logPath);

		var method = req.method;
		var requestUrl = req.url;
		var responseCode = res.statusCode;
		var remoteIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

		contents = contents.replace("{METHOD}", method);
		contents = contents.replace("{REQUEST_URL}", requestUrl);
		contents = contents.replace("{RESPONSE_CODE}", responseCode);
		contents = contents.replace("{REMOTE_IP}", remoteIp);
		contents = contents.replace("{ERROR_EXCEPTION}", errorException);
		contents = contents.replace("{ERROR_STACK}", errorException.stack);

		fs.appendFileSync(logPath, contents + "\n");
	},

};