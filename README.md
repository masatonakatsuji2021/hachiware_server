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

---

## # How do you use this?

First, install the npm package with the following command.

```code
npm i hachiware_server
```

Below for global installation.

```code
npm i -g hachiware_server
```

If you install globally, you can use the command of hachiware_server as it is.

```code
hachiware_server
```

For local installation, All you have to do is add the package require code to index.js etc. and you're ready to go.

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

## # Global and local installations

When using Hachiware_server, the specifications differ slightly depending on whether it is a global installation or a local installation.

Global installation is when installing with the following command.

```code
npm i -g hachiware_server
```

Local installation is below.

```code
npm i hachiware_server
```

It is recommended to use the local installation for development testing or emergency batch support, and the global installation for publishing such as Linux.

### - Command execution

For global installations, you can use the hachiware_server command or the hachiware_server_listen command directly.

The hachiware_server command opens a dedicated console.

```code
> hachiware_server
** Hachiware Server [Version : 1.0.10] *****************


Enter command  :
```

hachiware_server_listen is a command to start the server.  

```code
> hachiware_server_listen

** Hachiware Server [Version : 1.0.10] *****************


**************************************************************************
Hachieare Server Listen [2022/01/23 15:49:01] Listen Start!

**** Connect URL ******************

 - sect_0001                                          http://localhost

....Listen Start.
```

Persistence can be easily set by specifying ``systemctl enable hachiware_server_lissten`` on Linux etc.

On the other hand, for local installation, you need to install the `` indes.js`` file on any directory.

```javascript
const hachiware_server = require("hachiware_server");
hachiware_server(__dirname);
```

After writing the following code, execute it via the ``node`` command.

```code
> node .
** Hachiware Server [Version : 1.0.10] *****************


Enter command  :
```

To start the server, execute the ``node .start`` command.

```code
> node . start

** Hachiware Server [Version : 1.0.10] *****************


**************************************************************************
Hachieare Server Listen [2022/01/23 15:49:01] Listen Start!

**** Connect URL ******************

 - sect_0001                                          http://localhost

....Listen Start.
```


## - Configuration directory path

For global installations, the ``/hachiware_server`` directory is the configuration directory.
By setting the server section (collection of configuration files etc. to be published on the server) here, the server will be started in a batch by the ``hachiware_server_listen`` command.

On the other hand, in the local installation, the setting directory is the directory area where the above ``index.js`` is executed.

Since it is only on any directory that is made into a server, it is possible to start the server individually.

---

## # Server construction

For global installation, Server construction is possible only with the `` hachiware_server_listen`` command.

```code
hachiware_server_listen
```

For local installation, To start the server, execute the following command on the directory where ``index.js`` is installed.

```code
node . start
```

In the initial state, the server section, which is a collection of server settings and sources, is not prepared at all, so the server cannot be started.
(Only the message "There is no bootable server section" is displayed)

You can deploy multiple servers at the same time by installing a server section for each domain or port.

The server section has different installation locations and conditions for global installation and local installation.

In the case of global installation, it can be installed only in the ``/hachiware_server`` directory, but instead, all servers are started by the server start command from any current directory.

For local installation, start the server by installing the following directory structure.

```code
index.js
sect_0001               <= Server Section 1
    L conf.js
    L .....
sect_0002               <= Server Section 2
    L conf.js
    L .....
sect_0003               <= Server Section 3
    L conf.js
    L .....
...
```

Works like a virtual host in Apache's conf.d directory.  
Within the server section is the configuration file conf.js, which determines one server (domain-based / port-based) for each conf.js file.

``sect_0001/conf.js`` is coded as follows

```javascript
module.exports = {

    host: "www.sample1.com",

    port: 80,

};
```

Specify the connection host, connection port number, callback at the time of access, etc. like the above code.

Do this and access it from your browser with ``http://www.sample1.com`` and you should see the words "Hallo Web Server!" On your screen.

The configuration file ``sect_0002/conf.js`` is below.  

```javascript
module.exports = {

    host: "www.sample2.com",

    port: 80,

};
```

Now, if you access ``http://www.sample2.com`` with a browser, the characters "Hello Web Server 2 !!" .


When creating a new server section, it is convenient to use the ``init`` command of hachiware_server.

[Click here for details](#cmd_init)

---

## # Server settings

Here is how to describe various settings in the configuration file.

### - enable

Enables / disables server publishing.  
Specify by Boolean.

If not specified, it will be published by default.  
If specified with `` false``, server publishing will be disabled, but instead the notation `` (disable) `` will be displayed on the console.

```javascript
enable: true,
```

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

### - Timeout

Specifies the default timeout.  
Specify in milliseconds.

If no timeout is set, the process will open indefinitely without timing out.  

```javascript
timeout: 3000,
```

### - Response Header

Specifies the default response header.  
Specify with an object as shown below.

```javascript
headers: {
    "Content-Type": "text/html",
},
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

For a global installation, just run the `` hachiware_server`` command.

```
> hachiware_server
```

For local installation, After preparing the following ``index.js`` file, execute the command from node.

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
> hachiware_server
** Hachiware Server *****************

Enter command  :
```

From here onward, enter the command to proceed,  
Alternatively, it is also possible to execute by passing the execution command as a command line argument as shown below.

```
> hachiware_server start
```

The same applies to local installation.

```console
> node . start
```

It doesn't matter which one you use.

The commands that can be used are as follows

|command|Overview|
|:--|:--|
|init|Create a new Server-Section.|
|start|Start server startup|
|status|View server status|

<a id="cmd_init"></a>

### - Create a new Server-Section

If you want to create a new Server-Section, use the init command.

```console
> hachiware_server init
```

After executing the init command, the dialogue will start.  

```console
> hachiware_server init
** Create server settings **
Create a new server setting. Please answer the following questions.


Q. Enter the Server-Section name (sect_0001.js) :
Q. Enter the host name. (localhost) :
Q. SSL connection? [y/n] (n) : y
  Q. Specify the path of the private key file of the server certificate. (key/server.key) :
  Q. Specify the path of the server certificate. (key/server.crt) :
  Q. Specify the CA intermediate certificate path of the server certificate if required. () :
Q. Enter the port number. (443) :

  Server-Sction Name     : sect_0001.js
  SSL                    : true
    SSL certificate key  : key/server.key
    SSL certificate cert : key/server.crt
  host                   : localhost
  port                   : 443


Create a server with the above contents.
Q. Is it OK? [y/n] (y) :
```

Answer each question and select y(yes) at the final confirmation.  
A directory for the server section and a configuration file (conf.js file) will be generated.

After that, it will be updated if you restart the server with the start command etc.

### - Start the server

Use the start command to start the server.

```console
> hachiware_server start
**************************************************************************
Hachieare Server Listen [2022/01/16 15:28:18] Listen Start!

**** Connect URL ******************

 - sect_0001                      https://localhost

....Listen Start.
```

Global installation can be done directly with ``hachiware_server_listen``.

### - View server status

Use the status command to display the server operating status.

```console
> hachiware_server status
Server Status.
Status : Listen
--------------------------------------------------------------------------------------------------------------
 name                    host                    port                    ssl                     url
--------------------------------------------------------------------------------------------------------------
 sect_0001               localhost               80                      false                   http://localhost
```

If the server is down, see below.

```console
> hachiware_server status
Server Status.
Status : Stop
```

---

Hachiware_Server

JavaScript Framework "Hachiware" Web Server Application.
 
License : MIT License.   
Author  : Nakatsuji Masato  
HP URL  : [https://hachiware-js.com/](https://hachiware-js.com/)  
GitHub  : [https://github.com/masatonakatsuji2021/Hachiware_server](https://github.com/masatonakatsuji2021/Hachiware_server)  
npm     : [https://www.npmjs.com/package/Hachiware_server](https://www.npmjs.com/package/Hachiware_server)