<p align="center">
    <img src="https://github.com/masatonakatsuji2021/hachiware_server/raw/master/logo.png" alt="hachiware server">
</p>

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

```console
node . init
```

下記のように色々質問が対話形式で表示されます。
それらに順次回答をしていってください。

```console
> node . init
** Create server settings **
Create a new server setting. Please answer the following questions.


Q. Enter the configuration file name (conf.js) :
Q. Enter the host name. (localhost) :
Q. SSL connection? [y/n] (n) : y
  Q. Specify the path of the private key file of the server certificate. (key/server.key) :
  Q. Specify the path of the server certificate. (key/server.crt) :
  Q. Specify the CA intermediate certificate path of the server certificate if required. () :
Q. Enter the port number. (443) :


  conf File Name         : conf.js
  SSL                    : true
    SSL certificate key  : key/server.key
    SSL certificate cert : key/server.crt
  host                   : localhost
  port                   : 443

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
> node . start
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

### - モジュール

hachieare_serverでは各オプション機能をモジュール化しているため、  
そのモジュールを利用する分は下記のように``modules``にて列挙する必要があります。

```javascript
modules: [
    "hachiare_server_module_logs",
    "hachiare_server_module_firewall",
    "hachiare_server_module_basic_auth",
    "hachiare_server_module_public",
    "hachiare_server_module_get_request",
    ....
],
```

2022年1月時点で標準で用意されているモジュールは下記の通り。

|モジュール|概要|
|:--|:--|
|[hachiare_server_module_logs](https://github.com/masatonakatsuji2021/hachiware_server_module_log/blob/main/README.md)|ログ出力用|
|[hachiare_server_module_firewall](https://github.com/masatonakatsuji2021/hachiware_server_module_firewall/blob/main/README.md)|ファイアーウォール用|
|[hachiare_server_module_basic_auth](https://github.com/masatonakatsuji2021/hachiware_server_module_basic_auth/blob/main/README.md)|ベーシック認証の実装用|
|[hachiare_server_module_public](https://github.com/masatonakatsuji2021/hachiware_server_module_public/blob/main/README.md)|画像イメージ等の静的ファイル用パブリック領域の構築|
|[request](https://github.com/masatonakatsuji2021/hachiware_server_module_get_request/blob/main/README.md)|リクエストデータ(GET/POST等)の取得|
|[hachiware_server_module_callback](https://github.com/masatonakatsuji2021/hachiware_server_module_callback/blob/main/README.md)|リクエスト受信時の簡易コールバック実装|
|[framework](https://github.com/masatonakatsuji2021/hachiware_server_module_framework/blob/main/README.md)|Webフレームワーク用|

....

以上。ここになかった項目は英語版を見てください....。

---

作った人 : Nakatsuji Masato.


