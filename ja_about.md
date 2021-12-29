# Hachieare_server (簡易日本語訳ページ)

## # 何のパッケージ?

簡単に言えばNode.jsで動くWebサーバーアプリケーション。

---

## # どうやって動かすの?

まず任意のディレクトリに``index.js``ファイルを設置して下記コードを埋めてください。

```javascript
const hachiware_server = require("hachiware_server");
hachiware_server(__dirname);
```

あとはコンソールから上記``index.js``をnodeから実行します。

サーバー設定コマンド(init)を行ってサーバー設定を行った後、後はサーバーを起動するのみです。

---

## # サーバー設定コマンド (init)

上記``index.js``ファイルの場所までパスを移動して、そこで下記コマンドを実行。

```
node . init
```

下記のように色々質問が対話形式で表示されます。
それらに順次回答をしていってください。

```
** Create server settings **
Create a new server setting. Please answer the following questions.


Q. Enter the configuration file name (conf.js) :
Q. Enter the host name. (localhost) :
Q. SSL connection? [y/n] (n) : y
  Q. Specify the path of the private key file of the server certificate. (key/server.key) :
  Q. Specify the path of the server certificate. (key/server.crt) :
  Q. Specify the CA intermediate certificate path of the server certificate if required. () :
Q. Enter the port number. (443) :
Q. Add Log output. [y/n] (y) :
Q. Add Callback function. [y/n] (y) :
Q. Use more modules? [y/n] (n) : y
  Q. Use "filtering" module? [y/n] (n) :
  Q. Use "basicAuth" module? [y/n] (n) :
  Q. Use "publics" module? [y/n] (n) :
  Q. Use "request" module? [y/n] (n) :
  Q. Use "proxy" module? [y/n] (n) :


  conf File Name         : conf.js
  SSL                    : true
    SSL certificate key  : key/server.key
    SSL certificate cert : key/server.crt
  host                   : localhost
  port                   : 443
  Log Output             : true
  Callbacks function     : true
  Use MModule
    filtering            : false
    basicAuth            : false
    publics              : false
    request              : false
    proxy                : false


Create a server with the above contents.
Q. Is it OK? [y/n] (y) :
```

最終確認でyを選択した時点で、サーバー設定ファイルが生成されます。  
(直下にconfディレクトリが生成されてその中に設定ファイルが生成される)

ファイル/ディレクトリ構成は下記のようになります。

```
conf
    L conf.js
index.js
```

このconfファイルを複数設置することで複数のサーバーを同時に展開することが可能。  
下記のようにすれば4つのサーバー(https、ドメインまたはポート番号別)を展開できる。

```
conf
    L conf.js
    L conf_2.js
    L conf_3.js
    L conf_4.js
index.js
```

これでサーバー設定は完了。 

細かい設定については設定ファイル内をエディター等で直接変更してください。

---

## # サーバーの起動コマンド (start)

サーバーを起動するには  
上記``index.js``ファイルの場所までパスを移動して、そこで下記コマンドを実行。

```
node . start
```

コンソールに下記のように出力されてListen Startがされていればサーバーは起動完了。

```
**************************************************************************
Hachieare Server Listen [2021/12/30 00:11:52] Listen Start!

**** Connect URL ******************

 - conf.js               https://localhost

....Listen Start.
```

終了するときはCtrl + Cを押します。

なおforever等で永続化する場合はこのコンソールは表示されません。

---

## # サーバー設定

サーバー設定ファイル(conf/conf.js)には下記のようにコードが配置されているので  
その項目ごとの意味についてはこちらでて解説していきます。

```javascript
module.exports = {

	host:"www.sample2.com",

	ssl: true,

	certificate: {
		key: "key/server.key",
		cert: "key/server.crt",
        ca: "",
	},
	
    ....
}
```

### - ホスト名

``host``にホスト名(ドメイン)を指定。  
ホスト名を指定しなかった場合は自動的に``localhost``となります。

```javascript
host: "www.sample2.com",
```

### - HTTPSの設定

``ssl``でhttps化する場合はtrueを指定してください。

```javascript
ssl: true,
```

### - 証明書ファイルパスの設定

上記でhttps化する場合。``certificate``にそれぞれの証明書ファイルパスを指定が必要です。  
パスは``index.js``があるファイルからの相対。

```javascript
certificate: {
	key: "key/server.key",
	cert: "key/server.crt",
    ca: "",
},
```

keyは秘密鍵、certはサーバー証明書(crt)、caは中間CA証明書をそれぞれ指定。  
(中間CA証明書は任意、リスト形式で複数指定可能)

なお証明書ファイルが存在しな買った場合はサーバー起動時にエラーを返して起動を強制停止して終了するので注意。

### - ポート番号

``port``にてポート番号を指定。

ポート番号を指定しなかった場合は、  
httpの場合は80、httpsの場合は443を自動的に指定されます。

同じホスト名(ドメイン)で、ポート毎で別サーバーを追加する場合はポート番号を指定してください。

```javascript
port: 120,
```

### - コールバックの指定

正常または異常でリクエストされた時のコールバックを指定します。

正常(レスポンスコードが200)の場合はsuccess、それ以外の異常(レスポンスコードが200以外)の場合はerrorのコールバックが処理されます。

引数はdataで、中にリクエスト(data.req)とレスポンス(data.res)が入っている。   
(リクエスト、レスポンスはhttpモジュールのとほぼ同じ)

errorの場合はエラー内容が先頭に追加されます。

```javascript
callbacks: {
    
    success: function(data){

        data.res.write("Hallo World");
    },

    error: function(error, data){

        data.res.write(error);
    },

}
```

このコールバックではres.endは不要。

ちなみに同期処理に対応させる場合はsyncAccssまたはsyncErrorにtrueを指定して、
引数に新たにresolveを追加して、必ずresolveしてください。

```javascript
callbacks: {
    
    syncSuccess: true,

    success: function(resolve, data){

        setTimeout(function(){
        
            data.res.write("Hallo World");

            resolve();


        },1000);
    },

    syncError: true,

    error: function(resolve, error, data){

        res.write(error);
        resolve();

    },

}
```

### - ログの出力

ログは``logs``で設定。

サーバー起動/終了時(startUp)、アクセス時(access)、エラー発生時(error)の大きく3つのログを指定可能。

アクセス時はエラー発生時にもエラー出力されます。

```javascript
// log
logs: {

    // startup write log
    startUp: {
        enable: true,
        path: "logs/startup/startup-{YYYY}.log",
        contents: "[{DATETIME}] {MODE} {HOST}:{PORT} URL= {LISTEN_URI} CONF= {CONF_FILE}",
    },

    // access write log
    access: {
        enable: true,			
        path: "logs/access/access-{YYYY}-{MM}.log",
        contents: "[{DATETIME}] {METHOD} {REQUEST_URL} {REMOTE_IP} {RESPONSE_CODE}",
    },

    // error write log
    error: {
        enable: true,
        path: "logs/error/error-{YYYY}-{MM}.log",
        contents: "[{DATETIME}] {METHOD} {REQUEST_URL} {REMOTE_IP} {RESPONSE_CODE} {ERROR_EXCEPTION} {ERROR_STACK}",
    },
},
```

enableはログ出力の有無を設定、pathはログ出力する場所、contentsはログ出力内容のフォーマットを指定。

ログ出力場所とログ内容についてはショートコード({}の部分)により、動的に指定が可能。  

ショートコードと出力内容は下記に記載

|ショートコード|startUp|access|error|概要|
|:--|:--|:--|:--|:--|
|{DATETIME}|〇|〇|〇|ログ出力日時<br>{YYYY}/{MM}/{DD} {HH}:{mm}:{ss}|
|{DATE}|〇|〇|〇|ログ出力日付<br>{YYYY}/{MM}/{DD}|
|{TIME}|〇|〇|〇|ログ出力時間<br>{HH}:{mm}:{ss}|
|{YYYY}|〇|〇|〇|ログ出力年|
|{MM}|〇|〇|〇|ログ出力月|
|{DD}|〇|〇|〇|ログ出力日|
|{HH}|〇|〇|〇|ログ出力時|
|{mm}|〇|〇|〇|ログ出力分|
|{ss}|〇|〇|〇|ログ出力秒|
|{HOST}|〇|〇|〇|ホスト名|
|{PORT}|〇|〇|〇|ポート番号|
|{SSL}|〇|〇|〇|SSL設定|
|{LISTEN_URI}|〇|〇|〇|Listen Url|
|{CONF_FILE}|〇|〇|〇|設定ファイル名|
|{MODE}|〇|-|-|サーバー開始/終了|
|{METHOD}|-|〇|〇|リクエストメソッド|
|{REQUEST_URL}|-|〇|〇|リクエストURL|
|{RESPONSE_CODE}|-|〇|〇|レスポンスコード|
|{REMOTE_IP}|-|〇|〇|送信元IPアドレス|
|{REQUEST_QUERY}|-|〇|〇|リクエストクエリ(GETパラメータ)|
|{REQUEST_BODY}|-|〇|〇|リクエストボディ(POST/PUT/DELETEパラメータ)|
|{ERROR_EXCEPTION}|-|-|〇|エラー内容|
|{ERROR_STACK}|-|-|〇|エラースタック|

なおログ出力内容をフォーマットとは別で独自に加工を行いたい場合は、callback指定を行うことで可能。  

```javascript
access: {
    enable: true,			
    path: "logs/access/access-{YYYY}-{MM}.log",
	callback: function(contents, params, req, res){
        var d = new Date();        
        return d.getFullYear() + (d.getMonth()+1) + d.getDate() + " " + d.getHour() + ":" + d.getMinutes() + ":" + d.getSeconds() + " " +req.method + " " + req.url;
	},
},
```

### - モジュール

hachieare_serverでは各オプション機能をモジュール化しています。  
そのモジュールについて利用する分は下記のように``modules``にてリストに配置してください。

```javascript
modules: [
    "filtering",
    "basicAuth",
    "publics",
    "request",
    "proxy",
],
```

以上。ここになかった項目は英語版を見てください....。

---

作った人 : Nakatsuji Masato.


