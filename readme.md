# Hachiware_Server

JavaScript Framework "Hachiware" Web Server Application.

[Click here for about page in Japanese](ja_about.md)

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

Optionally create a directory, create a ``index.js`` file and write the following code.

```javascript
const hachiware_server = require("hachiware_server");
hachiware_server(__dirname);
```

Depending on the command line argument at startup, the server is started or various scaffolds are executed by the console.

See [here](#console) for a description of the functions of various commands.

---

## # Server construction

To start the server, execute the following command on the directory where ``index.js`` is installed.

```
node . start
```

In the initial state, the server cannot be started because the configuration file is not prepared at all.  
(Only the message "No configuration directory." Is displayed)

Multiple servers can be set for each domain or port.  
For that setting, you need to specify a configuration file separately in the ``conf`` directory.

The file and directory structure is as follows.

```
index.js
conf
    L conf.js
```

The js files in the conf directory serve the same as the virtual hosts in Apache's conf.d directory.  
Consider one server (domain-based/port-based) per conf file.

Describe as follows in the configuration file ``conf/conf.js``

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
conf
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
|{HOST}|〇|〇|〇|Host name|
|{PORT}|〇|〇|〇|Port Number|
|{SSL}|〇|〇|〇|SSL enabled/disabled|
|{LISTEN_URI}|〇|〇|〇|Requestable URL|
|{CONF_FILE}|〇|〇|〇|Read setting file name|
|{MODE}|〇|-|-|Server start\end|
|{METHOD}|-|〇|〇|Request method|
|{REQUEST_URL}|-|〇|〇|Requested URL|
|{RESPONSE_CODE}|-|〇|〇|Response code number|
|{REMOTE_IP}|-|〇|〇|Source IP address information|
|{REQUEST_QUERY}|-|〇|〇|Query information(GET)|
|{REQUEST_BODY}|-|〇|〇|Request body|
|{ERROR_EXCEPTION}|-|-|〇|Error message|
|{ERROR_STACK}|-|-|〇|Error details|

If you want to include information other than the above shortcode in the error log, you can add the original error information using a callback.

```javascript
access: {
    enable: true,
    path: "logs/access/access-{YYYY}-{MM}.log",
    contents: "[{DATETIME}] {METHOD} {REQUEST_URL} {REMOTE_IP} {RESPONSE_CODE}",
    callback: function(contents, req ,res){
        contents += " HEADERS=" + JSON.stringify(req.headers);
        return contents;
    },
},
```

One thing to keep in mind when implementing a callback is that the arguments are different for startUp, access, and error.

In the case of strtUp, it will be the error content and setting information.

```javascript
callback: function(contents, params){
    contents += " SNAME=" + params.servername;
    return contents;
},
```

In the case of access, the order is error content, setting information, request information, and response information.

```javascript
callback: function(contents, params, req, res){
    contents += " HEADERS=" + JSON.stringify(req.headers);
    return contents;
},
```

In the case of error, the order is content content, error content, setting information, request information, and response information.

```javascript
callback: function(contents, exception, params, req, res){
    contents += "\n\n HEADERS=" + JSON.stringify(req.headers);
    return contents;
},
```

It is also possible to adjust the log output with just a callback.

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

The description of each module is as follows.

|module name|overview|
|:--|:--|
|[filtering](#mod_filtering)|Controls access by IP address|
|basicAuth|Implement basic authentication|
|publics|Implement public areas accessible to static files such as css and image files|
|request|Get the request data contents (GET, POST, etc.)|

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

### - (modules) Public area

The public area is an area for installing and reading static files such as css and images.

To use this function, it is assumed that module d is set to ``publics``.

Multiple areas can be specified.

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

The contents of each item are as follows.

|item|require|contents|
|:--|:--|:--|
|url|〇|URL that is a public area|
|mount|〇|Area mount destination directory path<br>Specifies the path where the static files are located.<br>Access is possible by creating a directory with the specified mount path and placing static files there.|
|headers|-|Response header applied<br>If there is Cache-Control etc., specify it here|
|indexed|-|If you specify the part up to the directory when requesting the URL path, you can specify which file to return.|

### - (modules) request data support

It is a module to automatically acquire request data such as GET/POST.

To use this function, it is assumed that module d is set to ``request``.

There are currently no options set for this module.

If this module is enabled, the Get parameter will be set inside ``req.query`` and form data such as POST or PUT will be set inside ``req.body``.

### - (modules) proxy support

Adjusting ....

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

            data.res.write("Hallo HTTPS Web Server!");
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

This completes the SSL settings.  
After running and starting the server,   
access ``https://www.sample1.com`` with a browser "Hallo HTTPS Web Server!" Is displayed

---

<a id="console"></a>
## # About the console

hachiware_server provides some command execution.  
After preparing the following `` index.js`` file, execute the command from node

```javascript
const hachiware_server = require("hachiware_server");
hachiware_server(__dirname);
```

If you execute the following command, a simple dedicated console menu will be displayed.

``
node . 
```

The dedicated console menu is displayed as shown below.  
It may be slightly different depending on the version

```
** Hachiware Server *****************

Enter command  :
```

From here onward, enter the command to proceed,  
Alternatively, it is also possible to execute by passing the execution command as a command line argument as shown below.

```
node . start
```

It doesn't matter which one you use.

The commands that can be used are as follows

|command|Overview|
|:--|:--|
|start|Start server startup|
|init|Create a new server <br>Generate a conf file.|
|status|View server status|

### - Start the server

Use the start command to start the server.

```
node . start
```

Due to the server trajectory, if an error occurs, it will be forcibly terminated.

### - Create a new server (Generating a conf file)

If you want to create a new server, use the init command.

```
node . init
```

After executing the init command, the dialogue will start.  

```
** Create server settings **
Create a new server setting. Please answer the following questions.


Q. Enter the configuration file name (conf_6.js) :
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


  conf File Name         : conf_6.js
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

Answer each question and select y(yes) at the final confirmation.
A server configuration file (conf file) is generated.

After that, it will be updated if you restart the server with the start command etc.

### - View server status

Use the status command to display the server operating status

```
node . status
```

---

Author : Nakatsuji Masato.