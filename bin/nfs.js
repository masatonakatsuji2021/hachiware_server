// nfs (404 not found response)
module.exports = function(res){
	res.responseCode = 404;
	res.end();
};