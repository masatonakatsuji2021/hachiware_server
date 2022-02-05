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

module.exports = function(exitResolve){
    
    var myPackage = require("../../../package.json");

    this.br().outn("  Hachiware Server [Version: " + myPackage.version + "]").br()
        .outn("  Author  : " + myPackage.author)
        .outn("  License : " + myPackage.license)
        .outn("  HP URL  : " + myPackage.homepage)
    ;

    var list = {
        "- start": "Start the server.\n",
        "- exit": "Quit the server.\n",
        "- setup": "Make initial settings for the server.\n",
        "- set_service": "Register for the service.\n                     * This feature is only available on Linux devices.\n",
        "- addss | init":"Add a new server section.\n",
        "- search": "Find and import the public image for creating the server section.\n",
        "- status": "Displays the server operation status.\n",
        "- module": "Displays the console menu for each server module.\n",
        "- version": "Displays version information of Hachiware server."
    };

    this.outData(list);

    exitResolve();
};