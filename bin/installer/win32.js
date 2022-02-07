/**
 * ====================================================================
 * Hachiware_Server
 * 
 * Web server application with Node.js
 * 
 * License : MIT License. 
 * Since   : 2021.12.25
 * Author  : Nakatsuji Masato 
 * Email   : nakatsuji@teastalk.jp
 * HP URL  : https://hachiware-js.com/
 * GitHub  : https://github.com/masatonakatsuji2021/hachiware_server
 * npm     : https://www.npmjs.com/package/hachiware_server
 * ====================================================================
 */

const fs = require("fs");

module.exports = function(binPath){

    fs.copyFileSync(__dirname + "/win32", binPath + "/hachiware_server",);
    fs.copyFileSync(__dirname + "/win32.cmd", binPath + "/hachiware_server.cmd");
    console.log("# install hachiware_server");
};