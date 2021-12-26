/**
 * ====================================================================
 * Hachiware_Server
 * 
 * Web server application with Node.js
 * 
 * Author : Nakatsuji Masato 
 * ====================================================================
 */

// nfs (404 not found response)
module.exports = function(res){
	res.responseCode = 404;
	res.end();
};