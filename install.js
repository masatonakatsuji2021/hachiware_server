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
    linux(envPath);
}