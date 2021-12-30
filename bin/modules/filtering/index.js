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

	/**
	 * each
	 * @param {*} resolve 
	 * @param {*} params 
	 * @param {*} req 
	 * @param {*} res 
	 * @returns 
	 */
	 each: function(resolve, params, req, res){

		if(!params.filtering){
			return resolve();
		}
	
		var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	
		var juge = true;
	
		if(params.filtering.mode == "accpet"){
			var juge = false;
	
			if(params.filtering.address){
				var address = params.filtering.address;
	
				if(typeof address == "string"){
					address = [address];
				}
	
				for(var n = 0 ; n < address.length ; n++){
					var tip = address[n];
					if(ip == tip){
						juge = true;
						break;
					}
				}
			}
		}
		else if(params.filtering.mode == "block"){
			var juge = true;
	
			if(params.filtering.address){
				var address = params.filtering.address;
	
				if(typeof address == "string"){
					address = [address];
				}
	
				for(var n = 0 ; n < address.length ; n++){
					var tip = address[n];
					if(ip == tip){
						juge = false;
						break;
					}
				}
			}
		}
	
		if(!juge){
			res.statusCode = 404;
			res.end();
			return;
		}
	
		resolve();

	},
};