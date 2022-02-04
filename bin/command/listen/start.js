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

const listen = require("../../listen.js");

process.clusterMode = true;

var args = process.argv;
args.shift();
args.shift();

var rootPath = args[0];

listen(rootPath, function(){
    process.exit();
});

const settingPath = rootPath + "/package.json";

try{
    var setting = require(settingPath);
}catch(error){
    var setting = {};
}

const manualGc = function(){

    if(process.execArgv.indexOf("--expose-gc") == -1){
        return;
    }

    if(!setting.server){
        return;
    }
    
    if(!setting.server.manualMemoryReleaseIinterval){
        return;
    }

    releaseInterval = setting.server.manualMemoryReleaseIinterval;  

    setInterval(function(){
        global.gc();
    },releaseInterval);

};

const refreshCycleDay = function(){

    if(!setting.server){
        return;
    }

    if(!setting.server.threadRefreshCycleDay){
        return;
    }

    var day = 0;
    setInterval(function(){
        day++;
        if(day > setting.server.threadRefreshCycleDay){
            process.exit();
        }
    }, 24 * 3600 * 1000);

};
const refreshCycleDate = function(){

    if(!setting.server){
        return;
    }

    if(!setting.server.threadRefreshCycleDate){
        return;
    }

    var d = new Date(setting.server.threadRefreshCycleDay);
    var target = d.getTime();

    setInterval(function(){
        var d = new Date();
        var now = d.getTime();

        if(now > target){
            process.exit();
        }

    }, 1000);

};

manualGc();
refreshCycleDay();
refreshCycleDate();