module.exports = function(resolve, params, req, res){

    if(!params.proxy){
        return resolve();
    }

    var proxyUrl = false;

    var colums = Object.keys(params.proxy);
    for(var n = 0 ; n < colums.length ; n++){
        var url = colums[n];
        var sendUrl = params.proxy[url];

        if(req.url == url){
            proxyUrl = sendUrl;;            
            break;
        }
    }

    if(!proxyUrl){
        return resolve();
    }




    
};