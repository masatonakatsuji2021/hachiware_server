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

const { execSync } = require("child_process");

console.log("hachiware_server installer begin.");

const envPath = execSync("npm bin -g").toString().trim();

if(__dirname.indexOf(envPath) !== 0){
    console.log("local install");
    return;
}

console.log("# global installed.");
console.log("# platform = " + process.platform);

if(process.platform == "win32"){
    const win32 = require("./bin/installer/win32.js");
    win32(envPath);
}
else if(process.platform == "linux"){
    const linux = require("./bin/installer/linux.js");
    linux(__dirname);
}