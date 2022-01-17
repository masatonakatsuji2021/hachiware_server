
const fs = require("fs");
const path = require("path");

module.exports = function(rootPath, args, exitResolve){

    var minfo = {};

    this.then(function(resolve){
  
        var confName = args.getOpt("conf");

        if(confName){

            if(!fs.existsSync(rootPath + "/conf/" + confName + ".js")){
                this.color.red("[Error] ").outn("The specified configuration file \"" + confName + "\" does not exist.");
                return exitResolve();
            }

            var juge = false;

            try{
                var conf = require(rootPath + "/conf/" + confName + ".js");
                juge = true;
            }catch(err){}

            if(!juge){
                this.color.red("[Error] ").outn("Could not load \"" + confName + "\" configuration information.");
                return exitResolve();
            }

            conf._file = rootPath + "/conf/" + confName + ".js";

            minfo.conf = conf;
            return resolve();
        }

        this.in("Q. Please specify the target configuration file name.", function(value, retry){

            if(!value){
                this.color.red("[Error] ").outn("The configuration file name is not specified.");
                return retry();
            }

            if(!fs.existsSync(rootPath + "/conf/" + value + ".js")){
                this.color.red("[Error] ").outn("The specified configuration file \"" + value + "\" does not exist.");
                return exitResolve();
            }

            var juge = false;

            try{
                var conf = require(rootPath + "/conf/" + value + ".js");
                juge = true;
            }catch(err){}

            if(!juge){
                this.color.red("[Error] ").outn("Could not load \"" + value + "\" configuration information.");
                return retry();
            }

            conf._file = rootPath + "/conf/" + value + ".js";

            minfo.conf = conf;

            resolve();
        });

    }).then(function(resolve){
  
        var moduleName = args.getOpt("name");

        if(moduleName){

            var exists = false;
        
            try{
                var mdn = require(moduleName);
                mdn = new mdn(minfo.conf, this);
                exists = true;
            }catch(err){}

            if(!exists){
                this.color.red("[Error] ").outn("The specified module name \"" + moduleName + "\" does not exist.");
                return exitResolve();
            }

            if(!mdn.fookConsole){
                this.color.red("[Error] ").outn("No console is specified for the server module \"" + moduleName + "\".");
                return exitResolve();
            }

            minfo.module = mdn;
            return resolve();
        }

        this.in("Q. Please specify the server module name.", function(value, retry){

            if(!value){
                this.color.red("[Error] ").outn("The server module name has not been entered. retry.");
                return retry();
            }
            
            var exists = false;

            try{
                var mdn = require(value);
                mdn = new mdn(minfo.conf, this);
                exists = true;
            }catch(err){
                console.log(err);
            }

            if(!exists){
                this.color.red("[Error] ").outn("The specified module name \"" + value + "\" does not exist.");
                return retry();
            }

            if(!mdn.fookConsole){
                this.color.red("[Error] ").outn("No console is specified for the server module \"" + value + "\".");
                return retry();
            }

            minfo.module = mdn;

            resolve();
        });

    }).then(function(resolve){

        minfo.module.fookConsole(rootPath,args,resolve);

    }).then(function(){


    }).start();

};