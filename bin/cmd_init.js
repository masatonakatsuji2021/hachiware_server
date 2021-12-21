const tool = require("hachiware_tool");

module.exports = function(exitResolve){

	var init = {};

	this.then(function(resolve){

		this.outn("** サーバー初期化設定 **").outn("新規でサーバー設定を作成します。以下の設問にお答えください。").br(2);

		this.in("  Q. サーバー名称があれば入力してください ()",function(value, retry){

			init.server_name = value;

			resolve();
		});

	}).then(function(resolve){

		this.in("  Q. SSL接続しますか？[y/n] (n)", function(value, retry){

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

		this.in("    Q.　サーバー証明書の秘密鍵ファイルのパスを指定 (server.key)",function(value, retry){

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
		this.in("    Q.　サーバー証明書のパスを指定 (server.crt)",function(value, retry){

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
		this.in("    Q.　必要であればサーバー証明書のCA中間証明書パスを指定 ()",function(value, retry){

			if(value){
				init.certificate.ca = value;
			}

			resolve();
		});

	}).then(function(resolve){

		if(!init.ssl){
			return resolve();
		}

		this.in("    Q. http接続を併用しますか？[y/n] (y)",function(value, retry){

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

		this.in("  Q. ホスト名(ドメイン)があれば入力してください。 ()",function(value, retry){

			init.host = value;

			resolve();
		});
		
	}).then(function(resolve){

		if(init.ssl){
			var port = "443";
		}
		else{
			var port = "80";
		}

		this.in("  Q. ポート番号の指定があれば入力してください。 (" + port + ")",function(value, retry){

			if(!value){
				value = port;
			}

			init.port = value;

			resolve();
		});

	}).then(function(resolve){

		this.in("  Q. ファイル公開が可能なディレクトリ領域を用意しますか？[y/n] (n)",function(value, retry){

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

		this.in("    Q. ファイル航海用のURL(ホスト名以降)を指定してください。 (/assets)",function(value, retry){

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

		this.in("    Q. ファイル航海用のマウント先パスを指定してください。 (/assets)",function(value, retry){

			if(!value){
				value = "/assets";
			}

			init.assets.mount = value;

			resolve();
		});

	}).then(function(resolve){

		this.in("  Q. エラー発生時にサーバーを永続的に起動できるようにしますか？[y/n] (y)",function(value, retry){

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

		this.in("  Q. コンソール上にログを表示させますか？[y/n] (y)",function(value, retry){

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

		this.in("  Q. サーバー開始/終了ログを出力しますか？[y/n] (y)",function(value, retry){

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

		this.in("    Q. サーバー開始/終了ログの出力先パスを指定 (logs/startup/startup-{YYYY}.log)",function(value, retry){

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

		this.in("    Q. サーバー開始/終了ログの出力内容フォーマットを指定 ([{DATETIME}] {MODE} {HOST}:{PORT} server_name = {SERVERNAME})",function(value, retry){

			if(!value){
				value = "[{DATETIME}] {MODE} {HOST}:{PORT} server_name = {SERVERNAME}";
			}

			init.logs.startup.contents = value;
			
			resolve();
		});

	}).then(function(resolve){

		this.in("  Q. アクセスログを出力しますか？[y/n] (y)",function(value, retry){

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

		this.in("    Q. アクセスログの出力先パスを指定 (logs/access/access-{YYYY}-{MM}.log)",function(value, retry){

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

		this.in("    Q. アクセスログの出力内容フォーマットを指定 ([{DATETIME}] {METHOD} {REQUEST_URL} {REMOTE_IP} {RESPONSE_CODE})",function(value, retry){

			if(!value){
				value = "[{DATETIME}] {METHOD} {REQUEST_URL} {REMOTE_IP} {RESPONSE_CODE}";
			}

			init.logs.access.contents = value;
			
			resolve();
		});

	}).then(function(resolve){

		this.in("  Q. エラーログを出力しますか？[y/n] (y)",function(value, retry){

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

		this.in("    Q. エラーログの出力先パスを指定 (logs/error/error-{YYYY}-{MM}.log)",function(value, retry){

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

		this.in("    Q. エラーログの出力内容フォーマットを指定 ([{DATETIME}] {METHOD} {REQUEST_URL} {REMOTE_IP} {RESPONSE_CODE} {ERROR_EXCEPTION} {ERROR_STACK})",function(value, retry){

			if(!value){
				value = "[{DATETIME}] {METHOD} {REQUEST_URL} {REMOTE_IP} {RESPONSE_CODE} {ERROR_EXCEPTION} {ERROR_STACK}";
			}

			init.logs.error.contents = value;
			
			resolve();
		});

	}).then(function(resolve){

		this.in("  Q. アクセスハンドリングコールバックを指定しますか？ [y/n] (y)",function(value, retry){

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

		this.in("    Q. アクセスハンドリングコールバックを同期対応で指定しますか？ [y/n] (y)",function(value, retry){

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

		this.in("  Q. エラーハンドリングコールバックを指定しますか？ [y/n] (y)",function(value, retry){

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

		this.in("    Q. エラーハンドリングコールバックを同期対応で指定しますか？ [y/n] (y)",function(value, retry){

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
		}


		this.outData(outData,{
			fieldMaxLength:40,
			valueMaxLength:80,
		});

		console.log(init);

		this.br();

		this.in("上記の内容でサーバーを作成します。よろしいですか？[y/n] (y)", function(value, retry){

			if(!value){
				value = "y";
			}

			if(value == "y"){


				this.br(2).outn("サーバー作成を完了しました。");
			}
			else{
				this.br(2).outn("サーバー作成を中止しました。");

			}

			exitResolve();

		});

	}).start();

};