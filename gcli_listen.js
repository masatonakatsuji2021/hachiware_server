const server = require("hachiware_server");
const fs = require("fs");

var rootPath = "/hachiware_server";
if(process.platform == "linux"){
    rootPath = "/etc/hachiware_server";
}

try{
    
    fs.mkdirSync(rootPath,{
        recursive:true,
    });

}catch(err){}

process.argv.push("start");

server(rootPath);