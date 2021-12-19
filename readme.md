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
const server = require("hachiware_server");

server.listen({

	port:1234,

	callbacks: {
		access: function(data){

			data.res.write("Hello Web Server");
		},
	},
});
```

Specify the connection port number and the callback at the time of request as an object in the argument.

After that, by executing this and accessing with ``http://localhost: 1234`` from the browser, "Hello Web Server characters will be displayed.

Details of the argument option values will be described later.  
(2021.12.19 comming soon....)

---

Author : Nakatsuji Masato.