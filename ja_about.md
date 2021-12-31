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
### - モジュール

hachieare_serverでは各オプション機能をモジュール化しています。  
そのモジュールについて利用する分は下記のように``modules``にてリストに配置してください。

```javascript
modules: [
    "logs",
    "filtering",
    "basicAuth",
    "publics",
    "request",
],
```

2021年12月時点で標準で用意されているモジュールは下記の通り。

|モジュール|概要|
|:--|:--|
|[logs](#mode_logs)|ログ出力用|
|[filtering](#mod_filtering)|送信元IPアドレスによるアクセス制限|
|[basicAuth](#mod_basicauth)|ベーシック認証の実装用|
|[publics](#mod_publics)|画像イメージ等の静的ファイル用パブリック領域の構築|
|[request](#mod_request)|リクエストデータ(GET/POST等)の取得|
|[pavilion](#mod_pavilion)|ファイル単位のWebサーバー構築|

<a href="logs"></a>

### - (モジュール) ログの出力

ログ出力機能を利用する場合は必ず``modules``にて``logs``を列挙してください。

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

<a href="mod_filtering"></a>

### - (モジュール) フィルタリング

送信元IPアドレスからアクセスを許可あるいは遮断するためのフィルタリング用モジュールです。

使用する場合は``modules``に必ず``filtering``を列挙してください。

実際のフィルタリング設定は下記の通りに設定します。 
下記の場合、「address」のIPアドレス群からのアクセスがあった場合は即遮断されます。

```javascript
filtering: {
    mode: "block",
    address: [
        "**.**.**.**",
        "**.**.**.**",
        "**.**.**.**",
        ....
    ],
},
```

各項目の内容は以下のとおりです。

|項目|必須|概要|
|:--|:--|:--|
|mode|〇|許可/遮断|
|address|〇|送信元IPアドレス群|

反対に「address」にてIPアドレス群からのアクセスのみを許可したい場合は、次のように設定してください。  
modeを「accept」(許可)とします。

```javascript
filtering: {
    mode: "accept",
    address: [
        "**.**.**.**",
        "**.**.**.**",
        "**.**.**.**",
        ....
    ],
},
```

filteringによって遮断されたリクエストはaccessコールバックに到達せず、レスポンスコード404のみを返して終了します。  
(同時にアクセスログも出力されません。)

<a href="mod_basicauth"></a>

### - (モジュール) ベーシック認証

ドメイン、ポート毎のサーバー全体に対してベーシック認証を実装させるためのモジュールです。

使用する場合は``modules``に必ず``basicAuth``を列挙してください。

ベーシック認証を実装するには、次のように記述します。

```javascript
basicAuth: {
    username: "abcd",
    password: "1234",
    onFailed: function(res){
        res.write("......orz....");
        res.end();
    },
},
```

設定項目ごとの内容については下記の通り。

|項目|必須|概要|
|:--|:--|:--|
|username|〇|ログインユーザー名|
|password|〇|ログインパスワード|
|onFailed|-|認証失敗時のコールバック|


<a href="mod_publics"></a>

### - (モジュール) パブリック領域の構築

画像イメージ等、静的ファイルを設置して直接アクセスできるようにするパブリック領域を設定するためのモジュールです。

使用する場合は``modules``に必ず``publics``を列挙してください。

下記のようにコード記述することで、複数のパブリック領域を指定できます。

```javascript
assets:[
    {
        url:"/ast",

        mount: "/assets",

        headers: {
            name:"Hachiware Server",
            "Cache-Control":"max-age=31536000",
        },

        indexed: [
            "index.html",
        ],
    },
],
```

各項目の内容は以下のとおりです。

|項目|必須|概要|
|:--|:--|:--|
|url|〇|パブリック猟奇であるURL|
|mount|〇|マウント先のディレクトリパス<br>静的ファイルが配置されているパスを指定します。<br>指定したマウントパスでディレクトリを作成し、そこに静的ファイルを配置することでアクセスできます。|
|headers|-|レスポンスヘッダー<br>Cache-Controlなどを必要とする場合は、ここでレスポンスヘッダーとして指定してください。|
|indexed|-|URLパスを要求するときにディレクトリまでの部分を指定すると、返すファイルを指定できます。|

<a href="mod_request"></a>

### - (モジュール) リクエストデータ取得

GET/POST等のリクエストデータを取得するためのモジュールです。


現時点でこのモジュールに設定可能なオプションはありません。

このモジュールが有効になっている場合、Getパラメーターは``req.query``、POSTやPUTなどのフォームデータは``req.body``に自動的に指定されます。

<a href="mod_pavilion"></a>

### - (モジュール) ファイル単位のWebサーバー構築

ファイル単位でページ作成が可能なWebサーバーを構築できるモジュールです。  
独自開発のテンプレートエンジン``hachiware_te``のファイル形式(hte)とそのスクリプトを使用することができます。

※ ``hachiware_te``については下記参照
[https://github.com/masatonakatsuji2021/hachiware_te](https://github.com/masatonakatsuji2021/hachiware_te)

使用する場合は``modules``に必ず``pavilion``を列挙してください。

構成ファイルに、以下に示すようにpabilionの設定を追加します。

```javascript
pavilion: {
    path: "htmls",
    topPage: "index.hte",
}
```

設定できる項目は以下のとおりです。

|項目|必須|概要|
|:--|:--|:--|
|path|〇|テンプレートファイルの対象ディレクトリ<br>このディレクトリに必要なhteファイルを配置してください。|
|topPage|〇|トップページとして表示するhteファイル名を指定します|
|errorDebug|-|エラーデバッグ内容をページ上に出力するかどうかを設定します|
|callback|-|画面レンダリングを開始する前に実行するコールバック|

上記のコードの場合、ディレクトリ/ファイルの構造は次のように設置してください。

```
index.js
htmls
    L common
        L header.hte
        L footer.hte
    L index.hte
```

まずinex.hteで、画面に表示されるHTMLタグを設定します。 

``index.hte``.

```php
<?te 
var data = { title: "TOP Page"}
load("common/header.hte",data); 
?>

<p>Hellow Web Server.</p>

<?te load("common/footer.hte"); ?>
```

``common/header.hte``

```php
<!DOCTYPE html>
<html>
<head>
</head>
<body>

<header>
    TEST APP - <?te if(this.title){ echo(this.title); } ?>
</header>
```

``common/footer.hte``

```php
<footer>
    FOOTER AREA..
</footer>
</body>
</html>
```

サーバーを起動後、ブラウザでサーバーにアクセスしてみて下さい。

「Hellow Web Server」の表示とヘッダーとフッターが画面に表示れれば、OKです。

hteファイルを作成するだけで、別ページを簡単に作成できます。

たとえば、新しいページ``page_1.hte``を作成し、そのリンクを ``index.hte``に追加します。

```
index.js
htmls
    L common
        L header.hte
        L footer.hte
    L index.hte
    L page_1.hte            <= New addition
```

``page_1.hte``.

```php
<?te 
var data = { title: "Page 1"}
load("common/header.hte",data); 
?>

<p>Page 1</p>

<?te load("common/footer.hte"); ?>
```

``index.hte``.

```php
<?te 
var data = { title: "TOP Page"}
load("common/header.hte",data); 
?>

<p>Hellow Web Server.</p>

<p><a href="/page_1">Page 1</a></p>

<?te load("common/footer.hte"); ?>
```

これで、TOPページからpage 1のリンクをクリックすると、新しくインストールされたpage_1.hteの画面が表示されます。

このようにして、ファイルごとにページを簡単に追加できます。

....

以上。ここになかった項目は英語版を見てください....。

---

作った人 : Nakatsuji Masato.


