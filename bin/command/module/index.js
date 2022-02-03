/**
 * ====================================================================
 * Hachiware_Server
 * 
 * Web server application with Node.js
 * 
 * License : MIT License. 
 * Since   : 2021.12.25
 * Author  : Nakatsuji Masato 
 * GitHub  : https://github.com/masatonakatsuji2021/hachiware_server
 * npm     : https://www.npmjs.com/package/hachiware_server
 * ====================================================================
 */

const fs = require("fs");
const path = require("path");

module.exports = function(rootPath, args, exitResolve){

    var minfo = {};

    this.then(function(resolve){
  
        var ssName = args.getOpt("ssname");

        if(ssName){

            if(!fs.existsSync(rootPath + "/" + ssName + "/conf.js")){
                this.color.red("[Error] ").outn("The specified server-section \"" + ssName + "\" does not exist.");
                return exitResolve();
            }

            var juge = false;

            try{
                var conf = require(rootPath + "/" + ssName + "/conf.js");
                juge = true;
            }catch(err){}

            if(!juge){
                this.color.red("[Error] ").outn("The setting information of server-section \"" + ssName + "\" could not be read. ");
                return exitResolve();
            }

            conf._file = rootPath + "/" + ssName + "/conf.js";

            minfo.conf = conf;
            return resolve();
        }

        this.in("Q. Please specify the target server section.", function(value, retry){

            if(!value){
                this.color.red("[Error] ").outn("The server section name is not specified.");
                return retry();
            }

            if(!fs.existsSync(rootPath + "/" + value + "/conf.js")){
                this.color.red("[Error] ").outn("The specified server-section \"" + value + "\" does not exist.");
                return exitResolve();
            }

            var juge = false;

            try{
                var conf = require(rootPath + "/" + value + "/conf.js");
                juge = true;
            }catch(err){}

            if(!juge){
                this.color.red("[Error] ").outn("The setting information of server-section \"" + value + "\" could not be read. ");
                return retry();
            }

            conf._file = rootPath + "/" + value + "/conf.js";

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

    }).then(function(){

        this.br(2).outn("......Here is the console of the server module.").br(2);

        minfo.module.fookConsole(rootPath,args,exitResolve);

    }).start();

};