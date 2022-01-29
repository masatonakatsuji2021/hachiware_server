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

const CLI = require("hachiware_cli");
const listen = require("../../listen.js");

var args = process.argv;
args.shift();
args.shift();

var rootPath = args[0];

var cli = new CLI();

cli.then(function(){

    this.outn(" -  Thread [PID = " + process.pid.toString().padEnd(6) + "]");

    listen.bind(this)(rootPath, function(){
        process.exit();
    });

}).start();

