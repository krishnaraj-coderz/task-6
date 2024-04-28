module.exports = (err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    const status = statusCode>=400 && statusCode<500 ? "fail" : "error"
    res.status(statusCode).json({
        status,
        message:err.message
    })
}