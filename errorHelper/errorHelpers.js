let errorHelpers = {
    errorBuilder:function(err){
        return{"status" : 500,
        "statusText" : "Internal Server Error",
        "message" : err.message,
        "error" : {
            "errno":err.errno,
            "call": err.syscall,
            "code": "INTERNAL_SERVER_ERROR",
            "message": err.message
        }}
    },
    logError:function(err,req,res,next){
        if(err){
        console.error("Log entry: "+JSON.stringify(errorHelpers.errorBuilder(err)))
        console.error("*".repeat(80));
        next(err);
        }
    },
    clientErrorHandler: function(err,req,res,next){
        if(req.xhr){
            res.status(500).json({
                "status" : 500,
                        "statusText" : "Internal Server Error",
                        "message" : "XMLHttpRequest error",
                        "error" : {
                            "errno":0,
                            "call": "XMLHtppRequest Call",
                            "code": "INTERNAL_SERVER_ERROR",
                            "message": "XMLHttpRequest error"
                        }});
        }else if(err){
            next(err);
        }
    },
    errorHandler:function(err,req,res,next){
        if(err) res.status(500).json(errorHelpers.errorBuilder(err)) 
    },
}
module.exports = errorHelpers;