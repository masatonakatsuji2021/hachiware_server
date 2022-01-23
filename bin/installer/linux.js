const { execSync } = require('child_process')

module.exports = function(__dirname){

    execSync("chmod 0755 " + __dirname+ "/linux_gcli.js");
    execSync("ln -s " + __dirname+ "/linux_gcli.js /usr/local/bin/hachiware_server");
    execSync("chmod 0755 /usr/local/bin/hachiware_server");
    console.log("# install hachiware_server");

    execSync("chmod 0755 " + __dirname+ "/linux_gcli_listen.js");
    execSync("ln -s " + __dirname+ "/linux_gcli_listen.js /usr/local/bin/hachiware_server_listen");
    execSync("chmod 0755 /usr/local/bin/hachiware_server_listen");
    console.log("# install hachiware_server_listen");

};