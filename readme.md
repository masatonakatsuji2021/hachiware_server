# Hachiware_Server

JavaScript Framework "Hachiware" Web Server Application.

---

## # How do you use this?

First, install the npm package with the following command.

```
npm i hachiware_server
```

All you have to do is add the package require code to index.js etc. and you're ready to go.

```javascript
const server = require("hachiware_server");
```

---

## # Server construction

The ``listen.`` method is a method for building a simple server.

Write the following code in ``index.js``.

```javascript
const { listen } = require("hachiware_server");

listen(__dirname);
```

Specify the current path of ``index.js`` as an argument.

Multiple servers can be set for each domain or port.  
For that setting, you need to specify a configuration file separately in the ``conf`` directory.

The file and directory structure is as follows.

```
index.js
    L conf
        L conf.js 	
```

Describe as follows in the configuration file `` conf/conf.js``

```javascript
module.exports = {

    host: "www.sample1.com",

    port: 80,

    callbacks: {
        access: function(data){

            data.res.write("Hallo Web Server!");
            data.res.end();
        },
    },

    modules: [
        "filtering",
        "basicAuth",
        "publics",
        "request",
    ],
};
```

Specify the connection host, connection port number, callback at the time of access, etc. like the above code.

Do this and access it from your browser with ``http://www.sample1.com`` and you should see the words "Hallo Web Server!" On your screen.

Also, when setting multiple servers, add the configuration file as shown below.

```
index.js
    L conf
        L conf.js
        L conf2.js
```

The configuration file ``conf2.js`` is below.  

```javascript
module.exports = {

    host: "www.sample2.com",

    port: 80,

    callbacks: {
        access: function(data){

            data.res.write("Hello Web Server2!!");
            data.res.end();
        },
    },

    modules: [
        "filtering",
        "basicAuth",
        "publics",
        "request",
    ],
};
```

Now, if you access ``http://www.sample2.com`` with a browser, the characters "Hello Web Server 2 !!" .

In this way, it is possible to set up multiple servers by domain or port number with one ``listen`` method.

The details of the values ​​of various setting items will be explained later.
(2021.12.19 comming soon....)

---

## # Server settings

Here is how to describe various settings in the configuration file.

### - Host name

Specify the host name.  
If not specified, it will automatically be ``localhost``.

```javascript
host: "localhost",
```

### - Port number

Specify the port number.

If not specified, 443 if SSL is true, 80 if false
It will be set automatically.

```javascript
port: 80,
```

### - callbacks

The callback can specify the function when the request arrives or an error occurs.

Describe the logic content in each of access when all requests are reached and error when an error occurs.

```javascript
callbacks: {
    access: function(data){

        data.res.write("Hello Web Server!");
        data.res.end();
    },
    error: function(error, data){

        data.res.write(error);
        data.res.end();
    },
},
```
### - Response Header

Specifies the default response header.

```javascript
headers: {
    name: "sample server 01",
},
```

### - Error Console Output 

Specify true to set the display of the result when an error is issued on the console.

```javascript
errorConsoleOutput: true,
```

### - Log output

Log output settings are described as follows.

```javascript
logs: {

    // startup write log
    startUp: {
        enable: true,
        path: "logs/startup/startup-{YYYY}.log",
        contents: "[{DATETIME}] {MODE} {HOST}:{PORT} server_name = {SERVERNAME}",
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

The high temperature setting for each log is as follows

|item|Overview|
|:--|:--|
|enable|Specify enable/disable of log output|
|path|Specify the log output destination path|
|contents|Specify the output format for log output|

``startUp`` outputs the log at the time of server start and end.

```javascript
startUp: {
    enable: true,
    path: "logs/startup/startup-{YYYY}.log",
    contents: "[{DATETIME}] {MODE} {HOST}:{PORT} server_name = {SERVERNAME}",
},
```

``access`` outputs the access log when the request reaches the access callback.

```javascript
access: {
    enable: true,
    path: "logs/access/access-{YYYY}-{MM}.log",
    contents: "[{DATETIME}] {METHOD} {REQUEST_URL} {REMOTE_IP} {RESPONSE_CODE}",
},
```

``error`` outputs an error log when an error occurs after the request reaches the access callback.

```javascript
error: {
    enable: true,
    path: "logs/error/error-{YYYY}-{MM}.log",
    contents: "[{DATETIME}] {METHOD} {REQUEST_URL} {REMOTE_IP} {RESPONSE_CODE} {ERROR_EXCEPTION} {ERROR_STACK}",
},
```

By describing the format (`` {} part``) in path and contents,
Dynamic results are output at that location.

The shortcodes of each format and their output results are as follows.

|Short code|startUp|access|error|Output result|
|:--|:--|:--|:--|:--|
|{DATETIME}|〇|〇|〇|Log output date and time<br>{YYYY}/{MM}/{DD} {HH}:{mm}:{ss}|
|{DATE}|〇|〇|〇|Log output date<br>{YYYY}/{MM}/{DD}|
|{TIME}|〇|〇|〇|Log output time<br>{HH}:{mm}:{ss}|
|{YYYY}|〇|〇|〇|Log output year|
|{MM}|〇|〇|〇|Log output month|
|{DD}|〇|〇|〇|Log output day|
|{HH}|〇|〇|〇|Log output hour|
|{mm}|〇|〇|〇|Log output minutes|
|{ss}|〇|〇|〇|Log output second|




### - modules

Individual optional functions are divided into modules.

It is possible to add / omit them as needed.

```javascript
modules: [
    "filtering",
    "basicAuth",
    "publics",
    "request",
],
```

### - (modules) filtering

It is a module that performs filtering to allow or block access from IP addresses.

To use this function, it is assumed that module d is set to ``filtering``.

The actual filtering settings are described as follows.  
In the following cases, access to the IP address group at ``address`` is blocked.

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

The contents of each item are as follows

|item|require|Contents|
|:--|:--|:--|
|mode|〇|accept/block mode|
|address|〇|Target IP address list|


On the contrary, if you want to allow access only to the IP address group of ``address``, as follows
Let mode be ``accept``.

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
Requests blocked by filtering will not reach the access callback and will only return an empty response code 404.  
(Access log is not output either.)

### - (modules) Basic authentication

A module for implementing basic authentication across servers by individual domain or port.

To use this function, it is assumed that module d is set to ``basicAuth``.

To implement basic authentication, write as follows.

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

The following for each setting item

|item|require|Contents|
|:--|:--|:--|
|username|〇|Login username|
|password|〇|Login password|
|onFailed|-|This is the callback when authentication fails.|



### - (modules ) Public area

The public area is an area for installing and reading static files such as css and images.

Multiple areas can be specified.

```javascript
module.exports = {

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

};
```

The contents of each item are as follows.

|item|require|contents|
|:--|:--|:--|
|url|〇|URL that is a public area|
|mount|〇|Area mount destination directory path<br>Specifies the path where the static files are located.|
|headers|-|Response header applied<br>If there is Cache-Control etc., specify it here|
|indexed|-|If you specify the part up to the directory when requesting the URL path, you can specify which file to return.|

### - HTTPS support (SSL)

If you want to set up a server with HTTP (SSL connection), write as follows.

ssl (value is true), host, certificate to specify the certificate file path certificate is required.

```javascript
module.exports = {

    host:"www.sample1.com",

    ssl: true,

    certificate: {
        key: "key/www.sample1.com/1/server.key",
        cert: "key/www.sample1.com/1/server.crt",
    },

    callbacks: {
        access: function(data){

            data.res.write("Hallo HTTP Web Server!");
            data.res.end();
        },
    },

};
```

First make sure ssl is true.

```javascript
ssl: true,
```

For the certificate file, prepare three points, the private key,   
the certificate, and the intermediate CA certificate if necessary, and specify the path.

```javascript
certificate: {
    key: "key/www.sample1.com/1/server.key",
    cert: "key/www.sample1.com/1/server.crt",
    ca: "key/www.sample1.com/1/server.ca",
},
```
---

## # About the console

Adjusting ....

---

Author : Nakatsuji Masato.