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

const tool = require("hachiware_tool");
const fs = require("fs");
const path0 = require("path");

module.exports = function(rootPath, exception){

    const convertShortCode = function(contents){

        contents = contents.split("{DATETIME}").join(tool.getDateFormat("{DATETIME}"));
        contents = contents.split("{PID}").join(process.pid);
        contents = contents.split("{EXCEPTION}").join(exception.stack.toString());

        return contents;
    };

    try{
        var setting = require(rootPath + "/package.json");
    }catch(error){
        var setting = {};
    }

    if(!setting.server){
        setting.server = {};
    }

    if(!setting.server.systemLog){
        setting.server.systemLog = {};
    }

    if(!setting.server.systemLog.path){
        setting.server.systemLog.path = "sylog/sylog.log";
    }

    if(!setting.server.systemLog.contents){
        setting.server.systemLog.contents = "{DATETIME} PID={PID} {EXCEPTION}";
    }

    try{
        fs.mkdirSync(rootPath + "/" + path0.dirname(setting.server.systemLog.path),{
            recursive: true,
        });
    }catch(err){}

    var logPath = convertShortCode(setting.server.systemLog.path);
    var logStr = convertShortCode(setting.server.systemLog.contents);

    fs.appendFileSync(rootPath + "/" + logPath, logStr + "\n");

    if(setting.server.systemLog.console){
       console.log(exception);
    }
};