const os = require("os");
const fs = require("fs");

module.exports = function(rootPath , args, exitResolve){

    var setups = {};

    this.then(function(resolve){

        this.outn("hachiware Server Setup").br();

        this.in("Q. Specify the directory path. (" + rootPath + ")", function(value){

            if(!value){
                value = rootPath;
            }

            setups.path = value;

            resolve();
        });
        
    }).then(function(resolve){

        this.in("Q. Do you want the server startup to be multithreaded? [y/n] (y)", function(value, retry){

            if(!value){
                value = "y";
            }

            value = value.toLowerCase();

            if(value == "y"){
                setups.multiThread = true; 
            }
            else if(value == "n"){
                setups.multiThread = false;
            }
            else{
                this.color.red("[Error] ").outn("Please enter either \"y\" (= yes) or \"n\" (= no). retry");
                return retry();
            }

            resolve();
        });

    }).then(function(resolve){

        if(!setups.multiThread){
            return resolve();
        }

        var maxCpu = os.cpus().length;

        this.in("Q. Specify the number of threads to start the server. \n * If \"auto\" is specified, up to " + maxCpu + " this thread will be allocated. (auto)", function(value, retry){

            if(!value){
                value = "auto";
            }

            var _value = parseInt(value);

            if(_value < 1){
                this.color.red("[Error] ").outn("Please specify 1 or more. retry");
                return retry();
            }
            else if(_value === NaN){
                if(value != "auto"){
                    this.color.red("[Error] ").outn("Please enter an integer value. retry");
                    return retry();    
                }
            }

            setups.multiThreadMaxProcess = value;

            resolve();
        });

    }).then(function(resolve){

        setups.systemLog = {};

        this.in("Q. Specify the save destination path for the system failure log. (sysLog/sysLog.log)", function(value, retry){

            if(!value){
                value = "sysLog/sysLog.log";
            }

            setups.systemLog.path = value;

            resolve();
        });

    }).then(function(resolve){

        this.in("Q.. Specify the output format of the system failure log. ({DATETIME} PID={PID} {EXCEPTION})", function(value, retry){

            if(!value){
                value = "{DATETIME} PID={PID} {EXCEPTION}";
            }

            setups.systemLog.contents = value;

            resolve();
        });

    }).then(function(resolve){

        this.in("Q. Do you want to display exceptions on the console when a system failure occurs?? [y/n] (y)", function(value, retry){

            if(!value){
                value = "y";
            }

            value = value.toLowerCase();

            if(value == "y"){
                setups.systemLog.console = true; 
            }
            else if(value == "n"){
                setups.systemLog.console = false;
            }
            else{
                this.color.red("[Error] ").outn("Please enter either \"y\" (= yes) or \"n\" (= no). retry");
                return retry();
            }

            resolve();
        });

    }).then(function(resolve){


        this.in("Q. If you want to change the memory release to specify every mirisecond, specify the interval. ()", function(value){

            setups.manualMemoryReleaseInterval = false;
            if(parseInt(value)){
                setups.manualMemoryReleaseInterval = value; 
            }

            resolve();            
        });

    }).then(function(resolve){

        this.in("Q. Specify the number of valid days for the server thread. ()", function(value){

            setups.threadRefreshCycleDay = false; 
            if(parseInt(value)){
                setups.threadRefreshCycleDay = value; 
            }

            resolve();    

        });

    }).then(function(resolve){

        this.outData(setups);

        this.in("Q. It is this ok? [y/n] (y)", function(value, retry){

            if(!value){
                value = "y";
            }

            value = value.toLowerCase();

            if(value == "y"){
                var enable = true; 
            }
            else if(value == "n"){
                var enable = false;
            }
            else{
                this.color.red("[Error] ").outn("Please enter either \"y\" (= yes) or \"n\" (= no). retry");
                return retry();
            }

            if(!enable){
                this.br(2).outn(".....Setup has been canceled.");
                return exitResolve();
            }

            try{
                var package = require(rootPath + "/package.json");
            }catch(err){
                var package = {};
            }

            package.server = setups;

            var pStr = JSON.stringify(package, null, "    ");

            fs.writeFileSync(rootPath + "/package.json", pStr);

            this.br(2).outn("....Setup is complete.");
            exitResolve();
        });

    }).start();


};