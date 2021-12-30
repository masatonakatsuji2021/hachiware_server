/**
 * ====================================================================
 * Hachiware_Server
 * 
 * Web server application with Node.js
 * 
 * Author : Nakatsuji Masato 
 * ====================================================================
 */

 module.exports = {
	
    static: function(params){

        this.param = params;

        this.writeStartUp = function(mode, params){

            console.log(" Log Write StartUp");

        };

        this.writeAccess = function(params, req, res){

            console.log(" Log Write Access");

        };

        this.writeError = function(error, params, req, res){

            console.log(" Log Write Error");

        };
        
    },

};