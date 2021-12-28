/**
 * ====================================================================
 * Hachiware_Server
 * 
 * Web server application with Node.js
 * 
 * Author : Nakatsuji Masato 
 * ====================================================================
 */

module.exports = function(resolve, params, req, res){

	var url = req.url;
	var queryStr = url.split("?")[1];
	var query = {};

	if(queryStr){
		var qbuff = queryStr.split("&");
		for(var n = 0 ; n < qbuff.length ; n++){
			var q_ = qbuff[n].split("=");

			query[q_[0]] = q_[1];
		}
	}
	req.query = query;

	if(req.method == "GET"){
		req.body = null;
		resolve();
	}
	else{
	
		var bodyBuff = null;
		req.on("data",function(data){
			if(!bodyBuff){
				bodyBuff = "";
			}
			bodyBuff += data;
		}).on("end", function(){

			var contentType = req.headers["content-type"];
			var body = null;

			if(contentType == "application/json"){
				body = JSON.parse(bodyBuff);
			}
			else if(contentType == "application/x-www-form-urlencoded"){
				body = {};
				var bbuff = bodyBuff.split("&");
				for(var n = 0 ; n < bbuff.length ; n++){
					var b_ = bbuff[n].split("=");
					body[b_[0]] = b_[1];
				}
			}
			else{
				body = bodyBuff;
			}

			req.body = body;

			resolve();
		});

	}
};