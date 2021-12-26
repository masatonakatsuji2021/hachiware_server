const fs = require("fs");
const tool = require("hachiware_tool");
const path0 = require("path");

module.exports = {

	/**
	 * defaultConvert
	 * @param {*} logPath 
	 * @param {*} date 
	 * @param {*} paarms 
	 * @returns 
	 */
	defaultConvert: function(strs, date, params){

		strs = strs.replace("{DATETIME}", tool.getDateFormat("{DATETIME}",date));
		strs = strs.replace("{DATE}", tool.getDateFormat("{DATE}",date));
		strs = strs.replace("{TIME}", tool.getDateFormat("{TIME}",date));
		strs = strs.replace("{YYYY}", tool.getDateFormat("{YYYY}",date));
		strs = strs.replace("{MM}", tool.getDateFormat("{MM}",date));
		strs = strs.replace("{M}", tool.getDateFormat("{M}",date));
		strs = strs.replace("{DD}", tool.getDateFormat("{DD}",date));
		strs = strs.replace("{D}", tool.getDateFormat("{D}",date));
		strs = strs.replace("{HH}", tool.getDateFormat("{HH}",date));
		strs = strs.replace("{H}", tool.getDateFormat("{H}",date));
		strs = strs.replace("{mm}", tool.getDateFormat("{mm}",date));
		strs = strs.replace("{m}", tool.getDateFormat("{m}",date));
		strs = strs.replace("{ss}", tool.getDateFormat("{ss}",date));
		strs = strs.replace("{s}", tool.getDateFormat("{s}",date));
		strs = strs.replace("{HOST}", params.host);
		strs = strs.replace("{PORT}", params.port);

		if(params.ssl){
			var ssl = true;
			var url = "https://" + params._host;
		}
		else{
			var ssl = false;
			var url = "http://" + params._host;
		}

		strs = strs.replace("{SSL}", ssl);
		strs = strs.replace("{LISTEN_URI}", url);
		strs = strs.replace("{CONF_FILE}", path0.basename(params._file));

		return strs;
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
	 * @param {*} port 
	 * @param {*} params 
	 * @returns 
	 */
	writeStartUp: function(mode, params){

		if(!tool.objExists(params,"logs.startUp")){
			return;
		}

		var startUp = params.logs.startUp;

		if(!startUp.enable){
			return;
		}

		var logPath = "logs/logs/startup/startup.log";
		if(startUp.path){
			logPath = startUp.path;
		}

		var contents = "[{DATETIME}] MODE={MODE} HOST={HOST} PORT={PORT} SSL={SSL} CONF={CONF_FILE}";
		if(startUp.contents){
			contents = startUp.contents;
		}

		var d = new Date();

		logPath = this.defaultConvert(logPath, d, params);
		contents = this.defaultConvert(contents, d, params);

		this.defaultMkDir(logPath);

		if(mode){
			mode = "OPEN";			
		}
		else{
			mode = "CLOSE";
		}
		var url = params._host;

		if(params.ssl){
			url = "https://" + url;
		}
		else{
			url = "http://" + url;
		}
		contents = contents.replace("{MODE}", mode);

		if(startUp.callback){
			var buff = startUp.callback(contents, params);
			if(buff){
				contents = buff;
			}
		}

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

		var access = params.logs.access;

		if(!access.enable){
			return;
		}

		var logPath = "logs/access/access-{YYYY}-{MM}.log";
		if(access.path){
			logPath = access.path;
		}

		var contents = "[{DATETIME}] METHOD={METHOD} REQUEST_URI={REQUEST_URL} REMOTE_IP={REMOTE_IP} RESPONSE_CODE={RESPONSE_CODE}";
		if(access.contents){
			contents = access.contents;
		}

		var d = new Date();

		logPath = this.defaultConvert(logPath, d, params);
		contents = this.defaultConvert(contents, d, params);

		this.defaultMkDir(logPath);

		var method = req.method;
		var requestUrl = req.url;
		var responseCode = res.statusCode;
		var remoteIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
		var query = req.query;

		contents = contents.replace("{METHOD}", method);
		contents = contents.replace("{REQUEST_URL}", requestUrl);
		contents = contents.replace("{RESPONSE_CODE}", responseCode);
		contents = contents.replace("{REMOTE_IP}", remoteIp);
		contents = contents.replace("{REQUEST_QUERY}", JSON.stringify(query));

		if(access.callback){
			var buff = access.callback(contents, params, req, res);
			if(buff){
				contents = buff;
			}
		}

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

		var errLog = params.logs.error;

		if(!errLog.enable){
			return;
		}

		var logPath = "logs/error/error-{YYYY}-{MM}.log";
		if(errLog.path){
			logPath = errLog.path;
		}

		var contents = "[{DATETIME}] METHOD={METHOD} REQUEST_URI={REQUEST_URL} REMOTE_IP={REMOTE_IP} RESPONSE_CODE={RESPONSE_CODE} ERROR_EXP={ERROR_EXCEPTION} ERROR_STACK={ERROR_STACK}";
		if(errLog.contents){
			contents = errLog.contents;
		}

		var d = new Date();

		logPath = this.defaultConvert(logPath, d, params);
		contents = this.defaultConvert(contents, d, params);

		this.defaultMkDir(logPath);

		var method = req.method;
		var requestUrl = req.url;
		var responseCode = res.statusCode;
		var remoteIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
		var query = req.query;
		var body = req.body;

		contents = contents.replace("{METHOD}", method);
		contents = contents.replace("{REQUEST_URL}", requestUrl);
		contents = contents.replace("{RESPONSE_CODE}", responseCode);
		contents = contents.replace("{REMOTE_IP}", remoteIp);
		contents = contents.replace("{REQUEST_QUERY}", JSON.stringify(query));
		contents = contents.replace("{REQUEST_BODY}", JSON.stringify(body));
		
		contents = contents.replace("{ERROR_EXCEPTION}", errorException);
		contents = contents.replace("{ERROR_STACK}", errorException.stack);

		if(errLog.callback){
			var buff = errLog.callback(contents, errorException, params, req, res);
			if(buff){
				contents = buff;
			}
		}

		fs.appendFileSync(logPath, contents + "\n");
	},

};