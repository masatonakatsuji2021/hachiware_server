const fs = require("fs");

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

        if(req.url == "/common.css"){
            var getCss = fs.readFileSync(__dirname + "/common.css");
            res.setHeader("Content-Type","text/css");
            res.write(getCss);
            res.end();
            return;
        }
        else if(req.url == "/jquery-3.6.0.min.js"){
            var getJquery = fs.readFileSync(__dirname + "/jquery-3.6.0.min.js");
            res.setHeader("Content-Type","text/javascript");
            res.write(getJquery);
            res.end();
            return;
        }

        var getHtml = fs.readFileSync(__dirname + "/index.html");

        res.write(getHtml);
        res.end();
    }, 

};