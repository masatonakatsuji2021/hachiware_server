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

    var source_hs = __dirname + "/linux_gcli.js";
    var path_hs = binPath + "/hachiware_server";

    execSync("chmod 0755 " + source_hs);
    
    if(fs.existsSync(path_hs)){
        fs.unlinkSync(path_hs);
    }
    execSync("ln -s " + source_hs + " " + path_hs);
    execSync("chmod 0755 " + path_hs);
    console.log("# install hachiware_server");

};