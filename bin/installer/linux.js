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
//    var source_hsl = __dirname + "/linux_gcli_listen.js";

    var path_hs = binPath + "/hachiware_server";
//    var path_hsl = binPath + "/hachiware_server_listen";

    execSync("chmod 0755 " + source_hs);
    
    if(fs.existsSync(path_hs)){
        fs.unlinkSync(path_hs);
    }
    execSync("ln -s " + source_hs + " " + path_hs);
    execSync("chmod 0755 " + path_hs);
    console.log("# install hachiware_server");

    /*
    execSync("chmod 0755 " + source_hsl);
    if(fs.existsSync(path_hsl)){
        fs.unlinkSync(path_hsl);
    }
    execSync("ln -s " + source_hsl+ " " + path_hsl);
    execSync("chmod 0755 " + path_hsl);
    console.log("# install hachiware_server_listen");

    // write systemcd
    var systemdPath = "/etc/systemd/system/hachiware_server_listen.service";
    if(fs.existsSync(systemdPath)){
        fs.unlinkSync(systemdPath);
    }
    var str = fs.readFileSync(__dirname + "/linux_systemd").toString();
    str = str.replace("{binPath}", path_hsl);

    fs.writeFileSync(systemdPath, str);
    execSync("chmod 0755 " + systemdPath);
    console.log("# add systemd hachiware_server_listen");
    */
};