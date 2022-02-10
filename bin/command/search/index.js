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

const https = require("https");
const fs = require("fs");
const zip = require("node-zip");
const path0 = require("path");

module.exports = function(rootPath , args, exitResolve){

    //const url = "http://localhost:11234/images/server_ss";
    const url = "https://hachiware-js.com/images/server_ss";

    this.outn("Hachiware Server Image Search/Import").br();

    var keyword = null;
    var response = [];
    var dlData = null;
    var getZip = null;
    var ssName = null;

    this.then(function(resolve){

        this.in("Enter keywords for the image you want to search for ()", function(value){

            keyword = value;

            resolve();
        });
    
    }).then(function(resolve){

        https.request(url + "/search.json",function(res){

            var body = "";
    
            res.on("data", function(data){
                body += data;
            });
    
            res.on("end", function(){
    
                var data = JSON.parse(body);

                var res = {
                    items:[],
                };

                for(var n = 0 ; n < data.items.length ; n++){
                    var d_ = data.items[n];

                    if(
                        d_.name.toLowerCase().indexOf(keyword.trim().toLowerCase()) > -1 ||
                        d_.author.toLowerCase().indexOf(keyword.trim().toLowerCase()) > -1 ||
                        d_.description.toLowerCase().indexOf(keyword.trim().toLowerCase()) > -1 ||
                        d_.keywords.indexOf(keyword.trim().toLowerCase()) > -1
                    ){
                        res.items.push(d_);
                    }
                }

                response = res;

                resolve();
            });

        }).end();

    }).then(function(resolve){

        if(response.items.length == 0){
            this.br().outn(".... There was no image corresponding to the input keyword.");
            return exitResolve();
        }

        var thStr = "No".padEnd(5) + " "
            + "image Name".padEnd(20) + " "
            + "Author".padEnd(20) + " "
            + "description".padEnd(30) + " "
        ;

        this.br().outn(thStr).br();

        for(var n = 0 ; n < response.items.length ; n++){
            var r_ = response.items[n];

            var tdStr = (n + 1).toString().padEnd(5) + " "
                + r_.name.padEnd(20) + " " 
                + r_.author.padEnd(20) + " " 
                + r_.description.substring(0,30).padEnd(30) + " "
            ;

            this.outn(tdStr);
        }

        this.br(2);

        this.in("From the above result, enter the image No to import.", function(value, retry){

            if(!value){
                this.color.red("[Error] ").outn("No image number has been entered. retry");
                return retry();
            }

            if(!response.items[parseInt(value) - 1]){
                this.color.red("[Error] ").outn("There is no image information for the specified No. retry.");
                return retry();
            }

            dlData = response.items[parseInt(value) - 1];

            resolve();
        });

    }).then(function(resolve){

        this.br().color.blue("# ").outn("Downloading " + dlData.name);

        https.request(url + "/" + dlData.path, function(res){

            var body;

            res.on("data", function(data){
                body = data;
            });

            res.on("end", function(){
                getZip = body;
                resolve();
            });

        }).end();

    }).then(function(resolve){

        this.color.blue("# ").outn("DL complete").br();

        this.in("Q. Please enter the server section name", function(value, retry){

            if(!value){
                this.color.red("[Error] ").outn("The server section name has not been entered. rery.");
                return retry();
            }

            if(fs.existsSync(rootPath + "/" + value)){
                this.color.red("[Error] ").outn("The entered Server Section \"" + value + "\" cannot be created because it already exists. retr.");
                return retry();
            }

            ssName = value;

            resolve();
        });

    }).then(function(resolve){
        this.color.blue("# ").outn("Extract the file...");

        var ssPath = rootPath + "/" + ssName;

        var zips = new zip(getZip, {
            base64: false, 
            checkCRC32: true
        });
        
        fs.mkdirSync(ssPath);

        this.color.blue("# ").outn("mkdir   " + ssPath.replace(rootPath,""));

        var colums =Object.keys(zips.files);

        // make directory.
        for(var n = 0 ; n < colums.length ; n++){
            var fileName = colums[n];
            var row = zips.files[fileName];

            var path = ssPath + "/" + fileName;

            if(row.dir){
                fs.mkdirSync(path,{
                    recursive: true,
                });    
                this.color.blue("# ").outn("mkdir   " + path.replace(rootPath, ""));
            }
            else{
                
                var path2 = path0.dirname(path);
                
                var data = zips.files[fileName]._data;

                if(!fs.existsSync(path2)){
                    fs.mkdirSync(path2,{
                        recursive: true,
                    });    
                    this.color.blue("# ").outn("mkdir   " + path2.replace(rootPath, ""));
                }
                else{
                    if(!fs.statSync(path2).isDirectory()){
                        fs.mkdirSync(path2,{
                            recursive: true,
                        });    
                        this.color.blue("# ").outn("mkdir   " + path2.replace(rootPath, ""));    
                    }                        
                }

                fs.writeFileSync(path, data, "binary");
                this.color.blue("# ").outn("addFile " + path.replace(rootPath, ""));
            }
        }

        this.br().outn("...Import Complete!");
    
        exitResolve();

    }).start();

};