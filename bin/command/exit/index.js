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

module.exports = function(rootPath, exitResolve){

    const lockFilePath = rootPath + "/connection.lock";

    if(!fs.existsSync(lockFilePath)){
        this.outn("....Already finished.");
        return exitResolve();
    }

    var getLock = fs.readFileSync(lockFilePath).toString();
    getLock = JSON.parse(getLock);

    if(!getLock){
        this.outn("....Abnormal termination.");
        return exitResolve();
    }

    if(!getLock.mainPid){
        this.outn("....Abnormal termination.");
        return exitResolve();
    }

    try{

        process.kill(getLock.mainPid);
        fs.unlinkSync(lockFilePath);
        this.outn("Server termination.");

    }catch(error){
        this.outn("Server termination. Abnormal termination.");
    }

    exitResolve();
};