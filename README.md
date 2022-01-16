<p align="center">
    <img src="https://github.com/masatonakatsuji2021/hachiware_server/raw/master/logo.png" alt="hachiware server">
</p>

# Hachiware_Server

<a href="https://github.com/masatonakatsuji2021/hachiware_server/blob/master/LICENSE"><img alt="GitHub license" src="https://img.shields.io/github/license/masatonakatsuji2021/hachiware_server"></a>
<img alt="GitHub package.json version" src="https://img.shields.io/github/package-json/v/masatonakatsuji2021/hachiware_server">
<img alt="GitHub top language" src="https://img.shields.io/github/languages/top/masatonakatsuji2021/hachiware_server">
<img alt="Libraries.io dependency status for GitHub repo" src="https://img.shields.io/librariesio/github/masatonakatsuji2021/hachiware_server">
<img src="https://img.shields.io/badge/author-Nakatsuji%20Masato-brightgreen" alt="author Nakatsuji Masato">
<img src="https://img.shields.io/badge/made%20in-Japan-brightgreen" alt="made in japan">

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

    welcomeToPage: "welcome.html",
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

    welcomeToPage: "welcome.html",
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

    welcomeToPage: "welcome.html",
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

### - Error Console Output 

Specify true to set the display of the result when an error is issued on the console.

```javascript
errorConsoleOutput: true,
```

### - welcome to page

To display the page at the initial stage when the request to the server is completed normally,  
Specify the path of the display page HTML file in welcomeToPage.

```javascript
welcomeToPage: "welcome.html",
```

In the above case, by installing the `` welcome.html`` file directly under the current directory,  
Its contents are displayed.

### - modules

For individual functions, the functions are divided into units called modules (server modules).
With hachiware server, you can build the optimum server environment by using this server module properly.  
(Only necessary functions can be activated.)

The server module specifies the one provided by the npm package.

First, specify all the server module names to be used in ``modules`` like the configuration file.

```javascript
modules: [
    "hachiware_server_module_log",
    "hachiware_server_module_firewall",
    "hachiware_server_module_basic_auth",
    //.....
],
```

After that, please set while referring to the explanation on GitHub for each server module.  
The following is an overview of the server modules currently available.

|module name|overview|
|:--|:--|
|[hachiware_server_module_log](https://github.com/masatonakatsuji2021/hachiware_server_module_log/blob/main/README.md)|It is a server module that outputs various logs.|
|[hachiware_server_module_firewall](https://github.com/masatonakatsuji2021/hachiware_server_module_firewall/blob/main/README.md)|Server module for firewall.|
|[hachiware_server_module_basic_auth](https://github.com/masatonakatsuji2021/hachiware_server_module_basic_auth/blob/main/README.md)|Perform basic authentication|
|[hachiware_server_module_public](https://github.com/masatonakatsuji2021/hachiware_server_module_public/blob/main/README.md)|Set the bizarre that can publish source files such as css and image files.|
|[hachiware_server_module_get_request](https://github.com/masatonakatsuji2021/hachiware_server_module_get_request/blob/main/README.md)|Get the request data contents (GET, POST, etc.)|
|[hachiware_server_module_proxy](https://github.com/masatonakatsuji2021/hachiware_server_module_proxy/blob/main/README.md)|It is a server module that realizes a proxy server.|
|[hachiware_server_module_callback](https://github.com/masatonakatsuji2021/hachiware_server_module_callback/blob/main/README.md)|Implement a simple callback that can receive requests.<br>※ This module cannot be used with ``hachiware_server_module_framework``|
|[hachiware_server_module_framework](https://github.com/masatonakatsuji2021/hachiware_server_module_framework/blob/main/README.md)|A module that provides a web framework.<br>* This module cannot be used with ``hachiware_server_module_callback``.|


---

<a id="console"></a>

## # About the console

hachiware_server provides some command execution.  
After preparing the following ``index.js`` file, execute the command from node

```javascript
const server = require("hachiware_server");
server(__dirname);
```

If you execute the following command, a simple dedicated console menu will be displayed.

```console
> node . 
```

The dedicated console menu is displayed as shown below.  
It may be slightly different depending on the version

```console
> node .
** Hachiware Server *****************

Enter command  :
```

From here onward, enter the command to proceed,  
Alternatively, it is also possible to execute by passing the execution command as a command line argument as shown below.

```console
> node . start
```

It doesn't matter which one you use.

The commands that can be used are as follows

|command|Overview|
|:--|:--|
|init|Create a new server <br>Generate a conf file.|
|start|Start server startup|
|status|View server status|

### - Create a new server (Generating a conf file)

If you want to create a new server, use the init command.

```console
> node . init
```

After executing the init command, the dialogue will start.  

```console
> node . init
** Create server settings **
Create a new server setting. Please answer the following questions.


Q. Enter the configuration file name (conf_1.js) :
Q. Enter the host name. (localhost) :
Q. SSL connection? [y/n] (n) : y
  Q. Specify the path of the private key file of the server certificate. (key/server.key) :
  Q. Specify the path of the server certificate. (key/server.crt) :
  Q. Specify the CA intermediate certificate path of the server certificate if required. () :
Q. Enter the port number. (443) :

  conf File Name         : conf_1.js
  SSL                    : true
    SSL certificate key  : key/server.key
    SSL certificate cert : key/server.crt
  host                   : localhost
  port                   : 443


Create a server with the above contents.
Q. Is it OK? [y/n] (y) :
```

Answer each question and select y(yes) at the final confirmation.
A server configuration file (conf file) is generated.

After that, it will be updated if you restart the server with the start command etc.

### - Start the server

Use the start command to start the server.

```console
> node . start
**************************************************************************
Hachieare Server Listen [2022/01/16 15:28:18] Listen Start!

**** Connect URL ******************

 - conf_1.js                      https://localhost

....Listen Start.
```

Due to the server trajectory, if an error occurs, it will be forcibly terminated.

### - View server status

Use the status command to display the server operating status.

```console
> node . status
Server Status.
Status : Listen
--------------------------------------------------------------------------------------------------------------
 name                    host                    port                    ssl                     url
--------------------------------------------------------------------------------------------------------------
 conf_1                  localhost               80                      false                   http://localhost
```

If the server is down, see below.

```console
> node . status
Server Status.
Status : Stop
```

---

Author : Nakatsuji Masato.
