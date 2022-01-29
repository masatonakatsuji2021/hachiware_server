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

const fs = require("hachiware_fs");

module.exports = function(rootPath, noOutputMsg, exitResolve){

    var confList = fs.readdirSync(rootPath);

    if(!confList.length){
        throw("No bootable server section.");
    }

    var loadConf = [];

    if(!noOutputMsg){
        this.outn("# Listen Server-Section").br();
    }

    for(var n = 0 ; n < confList.length ; n++){
        var ssName = confList[n];

        var dirPath = rootPath + "/" + confList[n];
        var path = rootPath + "/" + confList[n] + "/conf.js";

        try{
            var conf = require(path);
        }catch(err){
            continue;
        }

        if(!Object.keys(conf).length){
            continue;
        }

        conf.rootPath = dirPath;
        conf._file = path;

        if(!conf.host){
            conf.host = "localhost";
        }

        if(!conf.port){
            if(conf.ssl){
                conf.port = 443;
            }
            else{
                conf.port = 80;
            }
        }

        var fileName = ssName;
        if(conf.enable === false){
            fileName += "(disable) ";
        }
        var connectStr = " - " + fileName.padEnd(50) + " ";

        if(conf.ssl){
            connectStr += "https://";
            connectStr += conf.host;
            if(conf.port !== 443){
                connectStr += ":" + conf.port;
            }
        }
        else{
            connectStr += "http://";
            connectStr += conf.host;
            if(conf.port !== 80){
                connectStr += ":" + conf.port;
            }
        }

        if(!noOutputMsg){
            if(conf.enable === false){
                this.color.grayn(connectStr);
            }
            else{
                this.outn(connectStr);
            }
        }

        if(conf.enable === false){
            continue;
        }

        conf._host = conf.host;
        if(conf.ssl){
            if(conf.port != 443){
                conf._host += ":" + conf.port;
            }
        }
        else{
            if(conf.port != 80){
                conf._host += ":" + conf.port;
            }
        }

        // module load check...
        if(!noOutputMsg){
            if(conf.modules){
                for(var n2 = 0 ; n2 < conf.modules.length ; n2++){
    
                    var module = conf.modules[n2];
    
                    try{
                        require(module);
                    }catch(error){
                        this.color.red("[Error] ").outn("Host=" + conf._host + "  " + error.toString());
                    }
                }
            }    
        }

        loadConf.push(conf);
    }

    if(loadConf.length == 0){
        this.br().outn(".....Quit because there is no server to start.");
        return exitResolve();
    }

    for(var n = 0 ; n < loadConf.length ; n++){
        var conf = loadConf[n];

        if(conf.modules){
            for(var n2 = 0 ; n2 < conf.modules.length ; n2++){

                var module = conf.modules[n2];

                try{
                    require(module);
                }catch(error){
                    this.color.red("[Error] ").outn("Host=" + conf._host + "  " + error.toString());
                }
            }
        }
    }

    return loadConf;
};