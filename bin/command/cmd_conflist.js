const { ifError } = require("assert");
const fs = require("fs");
const path0 = require("path");

module.exports = function(rootPath, exitResolve){

    this.then(function(resolve){

        var path = rootPath + "/conf";

        if(!fs.existsSync(path)){
            this.br().outn("Not found Configure Directory");
            return exitResolve();
        }

        if(!fs.statSync(path).isDirectory()){
            this.br().outn("Not found Configure Directory");
            return exitResolve();
        }

        var lists = fs.readdirSync(path);

        var confList = [];
        for(var n = 0 ; n < lists.length ; n++){
            var p_ = lists[n];

            var conf = require(rootPath + "/conf/" + p_);

            if(!conf.host){
                conf.host = "localhost";
            }

            if(!conf.ssl){
                conf.ssl = false;
            }
            
            if(!conf.port){
                if(conf.ssl){
                    conf.port = 443;
                }
                else{
                    conf.port = 80;
                }
            }

            if(conf.logs){
                conf.log = true;
            }
            else{
                conf.log = false;
            }

            if(conf.callbacks){
                conf.callback = true;
            }
            else{
                conf.callback = false;
            }

            confList.push({
                name: path0.basename(p_),
                host: conf.host,
                port:conf.port,
                ssl:conf.ssl,
                logWrite:conf.log,
                callback: conf.callback,
            });
        }

        this.outListData(confList);

        exitResolve();
    }).start();

};