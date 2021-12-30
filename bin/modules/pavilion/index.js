/**
 * ====================================================================
 * Hachiware_Server
 * 
 * Web server application with Node.js
 * 
 * Author : Nakatsuji Masato 
 * ====================================================================
 */

var hte = null;
try{
    hte = require("hachiware_te");
}catch(error){
    var str = " [ERROR] It seems that the npm package for the template engine \"hachiware_te\" is not installed.\n";
    str += "Execute the following command to complete the installation of the template engine. \n\n";
    str +=" npm i hachiware_te";
    console.log(str);
    process.exit();
}

module.exports = {

    /**
     * each
     * @param {*} exitResolve 
     * @param {*} params 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    each: function(exitResolve, params, req, res){

        if(!params.pavilion){
            return;
        }

        var conf = params.pavilion;

        if(!conf.path){
            conf.path = "htmls";
        }

        if(!conf.topPage){
            conf.topPage = "index.hte";
        }

        if(req.url == "/"){
            var file = conf.topPage;
        }
        else{
            var file =req.url + ".hte";
        }

        var path = params.rootPath + "/" +conf.path;
        path = path.split("//").join("/");

        if(!conf.errorDebug){
            conf.errorDebug = false;
        }
        
        new hte({
            errorDebug: conf.errorDebug,
            path: path,
            load: file,
            request: req,
            response: res,
            callback: function(html, req, res, error){

                if(conf.callback){
                    conf.callback(html, req, res, error);
                }
                res.write(html);
                res.end();
            }
        });
    },

};