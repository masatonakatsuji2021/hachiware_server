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

### - Host name

```javascript
module.exports = {

    host: "localhost",

};
```

### - Port number

```javascript
module.exports = {

    port: 80,

};
```

### - Public area

The public area is an area for installing and reading static files such as css and images.

Multiple areas can be specified.

```javascript
module.exports = {

	assets:[
		{
			url:"/ast",
			mount: "/assets",
		},
	],

};
```

### - callbacks

```javascript
module.exports = {

	callbacks: {
		access: function(data){
		
			data.res.write("Hello Web Server!");
			data.res.end();
		},
		error: function(error, data){

			data.res.write(error);
			data.res.end();
		}
	},
};
```


---

Author : Nakatsuji Masato.