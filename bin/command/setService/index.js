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

const os = require("os");
const fs = require("fs");
const {execSync} = require("child_process");

module.exports = function(rootPath, argv, exitResolve){

    this.br().outn("  Service Setup").br(2);

    if(os.platform() != "linux"){
        this.color.red("[Warm] ").outn("This feature is only available on Linux-based operating systems.\nThis function cannot be used with the OS of this terminal.").outn("OS : " + os.version());
        return exitResolve();
    }

    var services = {};

    this.then(function(resolve){

        this.in("Q. Please enter the registered service name.", function(value, retry){

            if(!value){
                this.color.red("[Error] ").outn("Service name not entered. retry.");
                return retry();
            }

            services.name = value + ".service";

            resolve();
        });

    }).then(function(resolve){

        this.in("Q. Enter if there is a Description. ()", function(value, retry){

            services.description = value;

            resolve();
        });

    }).then(function(resolve){

        this.in("Q. Enter Restart settings. (always)", function(value, retry){

            if(!value){
                value = "always";
            }

            services.restart = value;

            resolve();
        });

    }).then(function(resolve){

        this.in("Q. Enter type. (simple)", function(value){

            if(!value){
                value = "simple";
            }

            services.type = value;

            resolve();
        });   
        
    }).then(function(resolve){

        this.in("Q. Enter Wanted By. (multi-user.target)", function(value){

            if(!value){
                value = "multi-user.target";
            }

            services.wantedBy = value;

            resolve();
        });   

    }).then(function(resolve){
        
        this.in("Q. Please enter any changes to the service path. (/etc/systemd/system)", function(value){

            if(!value){
                value = "/etc/systemd/system";
            }

            services.systemPath = value;

            resolve();
        });

    }).then(function(){

        this.outData(services);

        this.outn("Register the service with the above contents.")
            .in("It is this ok? [y/n] (y)", function(value, retry){

                if(!value){
                    value = "y";
                }

                value = value.toLowerCase();

                if(value == "y"){
                    var status = true;
                }
                else if(value == "n"){
                    var status = false;
                }
                else{
                    this.color.red("[Error] ").outn("Enter either \"y\"(=Yes) or \"n\"(=No). retry.");
                    return retry();
                }

                if(!status){
                    this.br(2).outn(".....Service Setup Canceled.");
                    return exitResolve();
                }

                var systemdStr = fs.readFileSync(__dirname + "/linux_systemd").toString();
                systemdStr = systemdStr.replace("{path}", "node " + rootPath + " start");
                systemdStr = systemdStr.replace("{description}", services.description);
                systemdStr = systemdStr.replace("{restart}", services.restart);
                systemdStr = systemdStr.replace("{type}", services.type);
                systemdStr = systemdStr.replace("{wantedBy}", services.wantedBy);

                var systemdPath = services.systemPath + "/" + services.name;
                if(fs.existsSync(systemdPath)){
                    fs.unlinkSync(systemdPath);
                }

                fs.writeFileSync(systemdPath, systemdStr);
                execSync("chmod 0755 " + systemdPath);

                this.br(2).outn("Service registration is complete.")
                    .outn("* After that, you can instruct the persistence or stop from the terminal console with the same command as other services.")
                    .br()
                    .outn(".....Service Setup Complete.")
                ;

                exitResolve();
            });

    }).start();

};